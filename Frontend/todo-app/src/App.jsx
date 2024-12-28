// filepath: /F:/Learning Journey/PERN/TODO/Frontend/todo-app/src/App.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editTodoId, setEditTodoId] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/todos');
      setTodos(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/todos/${editTodoId}`, newTodo);
        setIsEditing(false);
        setEditTodoId(null);
      } else {
        await axios.post('http://localhost:5000/api/todos', newTodo);
      }
      fetchTodos();
      setNewTodo({ title: '', description: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const startEditing = (todo) => {
    setIsEditing(true);
    setEditTodoId(todo.ID);
    setNewTodo({ title: todo.TITLE, description: todo.DESCRIPTION });
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditTodoId(null);
    setNewTodo({ title: '', description: '' });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">TODO App</h1>
      <form onSubmit={addTodo} className="mb-4">
        <input
          type="text"
          placeholder="Title"
          value={newTodo.title}
          onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
          required
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Description"
          value={newTodo.description}
          onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
          required
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          {isEditing ? 'Update TODO' : 'Add TODO'}
        </button>
        {isEditing && (
          <button onClick={cancelEditing} className="bg-red-500 text-white p-2 ml-2">
            Cancel
          </button>
        )}
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.ID} className="border p-2 mb-2">
            <h3 className="text-xl font-bold">{todo.TITLE}</h3>
            <p>{todo.DESCRIPTION}</p>
            <button onClick={() => deleteTodo(todo.ID)} className="bg-red-500 text-white p-2 mr-2">
              Delete
            </button>
            <button onClick={() => startEditing(todo)} className="bg-yellow-500 text-white p-2">
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;