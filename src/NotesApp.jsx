import React, { useState, useEffect } from 'react';

export default function NotesApp() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('bleep_notes');
    return saved ? JSON.parse(saved) : [];
  });

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem('bleep_notes', JSON.stringify(notes));
  }, [notes]);

  const handleSaveNote = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const timestamp = new Date().toLocaleString();

    if (editingId) {
      setNotes(notes.map(n => n.id === editingId ? { ...n, title, content, category, timestamp } : n));
      setEditingId(null);
    } else {
      setNotes([...notes, { id: Date.now(), title, content, category, timestamp }]);
    }
    setTitle('');
    setContent('');
    setCategory('General');
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const startEditNote = (note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category);
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.content.toLowerCase().includes(search.toLowerCase()) ||
    n.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto my-6 p-6 text-slate-100 font-sans">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-cyan-400 text-xl">📓</div>
        <div>
          <h1 className="text-3xl font-black text-white">IdeaVault Notes App</h1>
          <p className="text-xs text-slate-400">Capture ideas and keep them organized securely</p>
        </div>
      </div>

      <form onSubmit={handleSaveNote} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl mb-6 shadow-xl">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <input 
            type="text" 
            placeholder="Note Title..." 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            className="bg-slate-950 border border-slate-800 px-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-cyan-400 text-slate-200 placeholder-slate-500"
          />
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 px-4 py-3 rounded-2xl text-sm text-slate-300 focus:outline-none focus:border-cyan-400"
          >
            <option value="General">General</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Ideas">Ideas</option>
          </select>
        </div>
        <textarea 
          placeholder="Write your note content here..." 
          rows="3"
          value={content} 
          onChange={(e) => setContent(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-2xl text-sm mb-4 focus:outline-none focus:border-cyan-400 text-slate-200 placeholder-slate-500"
        ></textarea>
        <button type="submit" className="bg-cyan-400 text-slate-950 font-bold px-6 py-3 rounded-2xl text-sm hover:bg-cyan-300 transition shadow-lg shadow-cyan-500/20 cursor-pointer">
          {editingId ? 'Update Note' : 'Create Note'}
        </button>
      </form>

      <div className="mb-8">
        <input 
          type="text" 
          placeholder="🔍 Search notes by title, content, or category..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 px-5 py-3.5 rounded-2xl text-sm focus:outline-none focus:border-cyan-400 text-slate-200 placeholder-slate-500 shadow-md"
        />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-slate-900/50 border border-slate-800/60 rounded-3xl">
            <p className="text-xs text-slate-500">No notes found.</p>
          </div>
        ) : (
          filteredNotes.map(note => (
            <div key={note.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl hover:border-slate-700 transition">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-bold bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-xl border border-cyan-500/20">{note.category}</span>
                  <span className="text-[10px] text-slate-500">{note.timestamp}</span>
                </div>
                <h3 className="font-extrabold text-base text-white mb-2">{note.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">{note.content}</p>
              </div>
              <div className="flex gap-2 pt-4 border-t border-slate-800/80">
                <button onClick={() => startEditNote(note)} className="flex-1 bg-slate-950 text-slate-300 text-xs py-2 rounded-xl border border-slate-800 hover:text-white transition cursor-pointer">Edit</button>
                <button onClick={() => deleteNote(note.id)} className="flex-1 bg-rose-500/10 text-rose-400 text-xs py-2 rounded-xl border border-rose-500/20 hover:bg-rose-500/20 transition cursor-pointer">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}