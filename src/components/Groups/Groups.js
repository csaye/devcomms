import React, { useEffect, useState } from 'react';

import Loading from '../Loading/Loading.js';

import Popup from 'reactjs-popup';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AddIcon from '@material-ui/icons/Add';
import GroupIcon from '@material-ui/icons/Group';
import DeleteIcon from '@material-ui/icons/Delete';

import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';
import firebase from 'firebase/app';

import './Groups.css';

function Groups(props) {
  const [groups, setGroups] = useState(undefined);
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const groupsRef = firebase.firestore().collection('groups');
  const [allGroups] = useCollectionData(groupsRef);

  const uid = firebase.auth().currentUser.uid;
  const userRef = firebase.firestore().collection('users').doc(uid);
  const [userData] = useDocumentData(userRef);
  const [ownedGroups] = useCollectionData(groupsRef.where('owner', '==', uid));

  // updates current user group in firebase
  async function selectGroup(group) {
    await userRef.update({
      currentGroup: group
    });
  }

  // attempts to create a group with given name
  async function createGroup(e) {
    e.preventDefault();

    // invalid characters
    if (groupName.includes('/')) {
      setError('Group name contains invalid characters.');
      return;
    }

    // if group already exists with name
    if (allGroups.some(group =>
      group.name.toLowerCase() === groupName.toLowerCase()
    )) {
      setError('Group with name already exists.');
      return;
    }

    // start loading
    setLoading(true);

    // create group document
    await firebase.firestore().collection('groups').doc(groupName).set({
      name: groupName,
      owner: uid,
      members: [uid]
    });

    // set current user group to this
    await firebase.firestore().collection('users').doc(uid).update({
      currentGroup: groupName,
      groups: firebase.firestore.FieldValue.arrayUnion(groupName)
    });
  }

  // deletes group with given name
  async function deleteGroup(group) {
    await firebase.firestore().collection('groups').doc(group).delete();
  }

  // set current user groups
  async function getGroups() {
    if (!userData) return;
    setGroups(userData.groups);
  }

  useEffect(() => {
    getGroups();
  }, [userData]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="Groups">
      {
        loading ?
        <Loading /> :
        <div className="center-box">
          <h1><GroupIcon /> Groups</h1>
          <hr />
          {
            (groups && groups.length > 0) &&
            <>
              <h2>Select Group</h2>
              {
                groups.map((g, i) =>
                  <button
                    key={`groupbutton-${i}`}
                    onClick={() => selectGroup(g)}
                    className="group-button"
                  >
                    {g}
                  </button>
                )
              }
            </>
          }
          {
            (ownedGroups && ownedGroups.length > 0) &&
            <>
              <h2>Edit Group</h2>
              {
                ownedGroups.map((g, i) =>
                  <Popup
                    trigger={
                      <button>{g.name}</button>
                    }
                    key={`grouppopup-${i}`}
                    modal
                  >
                    {
                      close => (
                        <div className="modal">
                          <button className="close" onClick={close}>&times;</button>
                          <div className="header">Editing Group</div>
                          <div className="content">
                          </div>
                          {
                            deleting ?
                            <>
                              <p className="delete-text">Delete group?</p>
                              <button onClick={() => setDeleting(false)} style={{"marginRight": "5px"}}>
                                cancel
                              </button>
                              <button onClick={() => {
                                deleteGroup(g.name);
                                close();
                                setDeleting(false);
                              }}>
                                delete
                              </button>
                            </> :
                            <button
                              className="button"
                              onClick={() => {
                                setDeleting(true);
                              }}
                            >
                              <DeleteIcon />
                            </button>
                          }
                        </div>
                      )
                    }
                  </Popup>
                )
              }
            </>
          }
          <form onSubmit={createGroup}>
            <h2>Create Group</h2>
            <div>
              <input
                placeholder="group name"
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                required
              />
              <button className="create-button" type="submit">
                <AddIcon />
              </button>
            </div>
          </form>
          {error && <p className="error-text">{error}</p>}
          <hr />
          <div>
            <p>Signed in as @{props.username}</p>
            <button onClick={() => firebase.auth().signOut()} className="sign-out-button">
              <ExitToAppIcon />
            </button>
          </div>
        </div>
      }
    </div>
  );
}

export default Groups;
