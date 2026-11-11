import React, { useState } from 'react';
import TodoApp from './TodoApp';
import NotesApp from './NotesApp';

export default function App() {
  const [activeTab, setActiveTab] = useState('todo');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-8">
      <div className="max-w-4xl mx-auto flex justify-center gap-4 mb-8 pt-4">
        <button 
          onClick={() => setActiveTab('todo')}
          className={`px-8 py-3.5 rounded-2xl text-sm font-bold transition shadow-lg cursor-pointer ${activeTab === 'todo' ? 'bg-cyan-400 text-slate-950 shadow-cyan-500/20' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'}`}
        >
          📋 To-Do App
        </button>
        <button 
          onClick={() => setActiveTab('notes')}
          className={`px-8 py-3.5 rounded-2xl text-sm font-bold transition shadow-lg cursor-pointer ${activeTab === 'notes' ? 'bg-cyan-400 text-slate-950 shadow-cyan-500/20' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'}`}
        >
          📓 Notes App
        </button>
      </div>

      {activeTab === 'todo' ? <TodoApp /> : <NotesApp />}
    </div>
  );
}