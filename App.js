import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    dueDate: '',
    category: 'General'
  });
  const [listItems, setListItems] = useState([]);
  const [isUpdating, setIsUpdating] = useState('');
  const [updateTaskData, setUpdateTaskData] = useState({
    title: '',
    description: '',
    dueDate: '',
    category: 'General'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Fetch all tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('http://localhost:5500/api/items');
        setListItems(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchTasks();
  }, []);

  // Add Task
  const addTask = async (e) => {
    e.preventDefault();
    if (!taskData.title) return; // Ensure title is not empty

    try {
      const res = await axios.post('http://localhost:5500/api/item', {
        ...taskData,
        completed: false
      });
      setListItems(prev => [...prev, res.data]);
      setTaskData({ title: '', description: '', dueDate: '', category: 'General' });
    } catch (err) {
      console.log(err);
    }
  };

  // Delete Task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5500/api/item/${id}`);
      setListItems(listItems.filter(item => item._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  // Toggle Completion
  const toggleComplete = async (id, currentStatus) => {
    try {
      await axios.put(`http://localhost:5500/api/item/${id}`, { completed: !currentStatus });
      setListItems(listItems.map(item =>
        item._id === id ? { ...item, completed: !currentStatus } : item
      ));
    } catch (err) {
      console.log(err);
    }
  };

  // Begin Update
  const startUpdate = (item) => {
    setIsUpdating(item._id);
    setUpdateTaskData({
      title: item.title,
      description: item.description,
      dueDate: item.dueDate,
      category: item.category
    });
  };

  // Submit Update
  const updateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5500/api/item/${isUpdating}`, updateTaskData);
      setListItems(listItems.map(item =>
        item._id === isUpdating ? { ...item, ...updateTaskData } : item
      ));
      setIsUpdating(''); // Clear the state after update
    } catch (err) {
      console.log(err);
    }
  };

  // Update Form
  const renderUpdateForm = () => (
    <form className="update-form" onSubmit={updateTask}>
      <input type="text" placeholder="Title" value={updateTaskData.title} onChange={e => setUpdateTaskData({ ...updateTaskData, title: e.target.value })} required />
      <input type="text" placeholder="Description" value={updateTaskData.description} onChange={e => setUpdateTaskData({ ...updateTaskData, description: e.target.value })} />
      <input type="date" value={updateTaskData.dueDate} onChange={e => setUpdateTaskData({ ...updateTaskData, dueDate: e.target.value })} />
      <select value={updateTaskData.category} onChange={e => setUpdateTaskData({ ...updateTaskData, category: e.target.value })}>
        <option value="General">General</option>
        <option value="Work">Work</option>
        <option value="Personal">Personal</option>
      </select>
      <button type="submit">Update</button>
    </form>
  );

  // Filtered & Searched Tasks
  const filteredTasks = listItems.filter(item =>
    (item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     item.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterCategory === '' || item.category === filterCategory)
  );

  return (
    <div className="App">
      <h1>Task Mate - Advanced To-Do List Web App</h1>

      {/* Add Task Form */}
      <form className="form" onSubmit={addTask}>
        <input
          type="text"
          placeholder="Title"
          value={taskData.title}
          onChange={e => setTaskData({ ...taskData, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={taskData.description}
          onChange={e => setTaskData({ ...taskData, description: e.target.value })}
        />
        <input
          type="date"
          value={taskData.dueDate}
          onChange={e => setTaskData({ ...taskData, dueDate: e.target.value })}
        />
        <select
          value={taskData.category}
          onChange={e => setTaskData({ ...taskData, category: e.target.value })}
        >
          <option value="General">General</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
        </select>
        <button type="submit">Add Task</button>
      </form>

      {/* Search & Filter */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="General">General</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
        </select>
      </div>

      {/* Task List */}
      <div className="todo-listItems">
        {filteredTasks.map(item => (
          <div className={`todo-item ${item.completed ? 'completed' : ''}`} key={item._id}>
            {isUpdating === item._id ? (
              renderUpdateForm()
            ) : (
              <>
                <div className="item-content">
                  <h3>{item.title}</h3>
                  <p><strong>Description:</strong>{item.description}</p>
                  <p><strong>Due:</strong> {item.dueDate}</p>
                  <p><strong>Category:</strong> {item.category}</p>
                  <p><strong>Status:</strong> {item.completed ? "Completed" : "Incomplete"}</p>
                </div>
                <div className="todo-item-buttons">
                  <button onClick={() => toggleComplete(item._id, item.completed)}>
                    {item.completed ? "Mark Incomplete" : "Mark Complete"}
                  </button>
                  <button onClick={() => startUpdate(item)}>Edit</button>
                  <button onClick={() => deleteTask(item._id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
