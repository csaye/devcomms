import React, { useState } from 'react';

import Goal from '../Goal/Goal.js';
import LibraryAddCheckIcon from '@material-ui/icons/LibraryAddCheck';
import AddIcon from '@material-ui/icons/Add';

import firebase from 'firebase/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import './Goals.css';

function Goals(props) {
  const [title, setTitle] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');

  // get goals
  const groupRef = firebase.firestore().collection('groups').doc(props.groupId);
  const goalsRef = groupRef.collection('goals');
  const goalsQuery = goalsRef.orderBy('endAt');
  const [goals] = useCollectionData(goalsQuery, { idField: 'id' });

  // creates a goal document in firebase
  function addGoal(e) {
    e.preventDefault();
    const goalTitle = title;
    setTitle('');
    const endDateTime = new Date(`${endDate} ${endTime}`);
    setEndDate('');
    setEndTime('');

    // add document to firebase
    goalsRef.add({
      endAt: endDateTime,
      title: goalTitle
    });
  }

  return (
    <div className="Goals">
      <h1><LibraryAddCheckIcon /> Goals</h1>
      <form onSubmit={addGoal}>
        <label htmlFor="goals-title">Title</label>
        <input
          id="goals-title"
          autoComplete="off"
          spellCheck="false"
          placeholder="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <label htmlFor="goals-date">Date</label>
        <input
          id="goals-date"
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          required
        />
        <label htmlFor="goals-time">Time</label>
        <input
          id="goals-time"
          type="time"
          value={endTime}
          onChange={e => setEndTime(e.target.value)}
          required
        />
        <button type="submit" className="submit-button clean-btn">
          <AddIcon />
        </button>
      </form>
      <div className="goal-list">
      {
        goals ?
        <>
          {
            goals.length > 0 ?
            goals.map((g, i) =>
              <Goal key={`goal-${i}`} data={g} groupId={props.groupId} />
            ) :
            <p>No goals yet.</p>
          }
        </> :
        <p>Loading goals...</p>
      }
      </div>
    </div>
  );
}

export default Goals;
