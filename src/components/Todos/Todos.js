import React, { useState } from 'react';

import Todo from '../Todo/Todo.js';

import AddIcon from '@material-ui/icons/Add';
import ListIcon from '@material-ui/icons/List';

import { useCollectionData } from 'react-firebase-hooks/firestore';
import firebase from 'firebase/app';

import './Todos.css';

function Todos() {
  const todosRef = firebase.firestore().collection('todos');
  const [todos] = useCollectionData(todosRef.orderBy('priority'));

  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('0');

  // creates a todo document in firebase
  async function createTodo(e) {
    e.preventDefault();

    // get todo values
    const todoTitle = title;
    const todoPriority = parseFloat(priority);

    // reset todo values
    setTitle('');
    setPriority('0');

    // create document in firebase
    await todosRef.add({
      title: todoTitle,
      priority: todoPriority
    })
  }

  return (
    <div className="Todos">
      <h1><ListIcon /> Todos</h1>
      <form onSubmit={createTodo}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <input
          type="number"
          value={priority}
          onChange={e => setPriority(e.target.value)}
          required
        />
        <button type="submit"><AddIcon /></button>
      </form>
      <div>
        {
          todos ?
          todos.map((t, i) =>
            <Todo key={`todo-${i}`} data={t} />
          ) :
          <p>Retrieving todos...</p>
        }
      </div>
    </div>
  );
}

export default Todos;