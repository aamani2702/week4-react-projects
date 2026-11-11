import React, { useState, useEffect } from 'react';

export default function TodoApp() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('bleep_todos');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem('bleep_todos', JSON.stringify(tasks));
  }, [tasks]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    if (editingId) {
      setTasks(tasks.map(t => t.id === editingId ? { ...t, text, dueDate } : t));
      setEditingId(null);
    } else {
      setTasks([...tasks, { id: Date.now(), text, dueDate, completed: false }]);
    }
    setText('');
    setDueDate('');
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setText(task.text);
    setDueDate(task.dueDate || '');
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'completed') return t.completed;
    if (filter === 'pending') return !t.completed;
    return true;
  });

  return (
    <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl my-6 text-slate-100 font-sans">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-cyan-400 text-xl">📋</div>
        <div>
          <h1 className="text-2xl font-black text-white">TaskMaster To-Do App</h1>
          <p className="text-xs text-slate-400">Organize your daily activities efficiently</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-6">
        <input 
          type="text" 
          placeholder="What needs to be done?" 
          value={text} 
          onChange={(e) => setText(e.target.value)}
          className="flex-1 bg-slate-950 border border-slate-800 px-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-cyan-400 text-slate-200 placeholder-slate-500"
        />
        <input 
          type="date" 
          value={dueDate} 
          onChange={(e) => setDueDate(e.target.value)}
          className="bg-slate-950 border border-slate-800 px-4 py-3 rounded-2xl text-sm text-slate-300 focus:outline-none focus:border-cyan-400"
        />
        <button type="submit" className="bg-cyan-400 text-slate-950 font-bold px-6 py-3 rounded-2xl text-sm hover:bg-cyan-300 transition shadow-lg shadow-cyan-500/20 cursor-pointer">
          {editingId ? 'Update' : 'Add Task'}
        </button>
      </form>

      <div className="flex gap-2 mb-6">
        {['all', 'pending', 'completed'].map((f) => (
          <button 
            key={f} 
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition cursor-pointer ${filter === f ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-10 bg-slate-950/50 border border-slate-800/60 rounded-2xl">
            <p className="text-xs text-slate-500">No tasks found. Add a new task above!</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} className="flex items-center justify-between bg-slate-950 border border-slate-800 p-4 rounded-2xl transition hover:border-slate-700">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={task.completed} 
                  onChange={() => toggleComplete(task.id)}
                  className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                />
                <div>
                  <p className={`text-sm font-medium ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>{task.text}</p>
                  {task.dueDate && <span className="text-[10px] text-cyan-400 font-semibold">Due: {task.dueDate}</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(task)} className="text-xs bg-slate-900 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-800 hover:text-white transition cursor-pointer">Edit</button>
                <button onClick={() => deleteTask(task.id)} className="text-xs bg-rose-500/10 text-rose-400 px-3 py-1.5 rounded-xl border border-rose-500/20 hover:bg-rose-500/20 transition cursor-pointer">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}