import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const Notes = () => {
  const { token, logout } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', category: 'General' });
  const [editingId, setEditingId] = useState(null);

  // Setup Axios Instance
  const api = axios.create({
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notes/all');
      setNotes(response.data.notes || []);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch notes.';
      setError(errorMsg);
      toast.error(errorMsg);
      if (err.response?.status === 401) logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openModal = (note = null) => {
    if (note) {
      setFormData({ title: note.title, description: note.description, category: note.category });
      setEditingId(note._id);
    } else {
      setFormData({ title: '', description: '', category: 'General' });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ title: '', description: '', category: 'General' });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const response = await api.put(`/notes/${editingId}`, formData);
        toast.success(response.data.message || 'Note updated successfully');
      } else {
        const response = await api.post('/notes/create', formData);
        toast.success(response.data.message || 'Note created successfully');
      }
      closeModal();
      fetchNotes();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error saving note.';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        const response = await api.delete(`/notes/${id}`);
        toast.success(response.data.message || 'Note deleted successfully');
        fetchNotes();
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Error deleting note.';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 w-full">
      <nav className="flex justify-between items-center py-5 border-b border-white/10 mb-10">
        <div className="text-2xl font-bold bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">NotesApp</div>
        <div className="flex gap-5 items-center">
          <button className="bg-transparent text-slate-100 border border-white/10 hover:bg-white/5 px-5 py-2.5 rounded-lg font-semibold transition-all duration-300" onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-slate-100">My Notes</h2>
        <button className="bg-primary text-white hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(99,102,241,0.3)] px-5 py-2.5 rounded-lg font-semibold transition-all duration-300" onClick={() => openModal()}>+ Add Note</button>
      </div>

      {error && <div className="text-danger mb-4 font-medium">{error}</div>}

      {loading ? (
        <div className="text-center mt-12 text-slate-400 text-lg">Loading notes...</div>
      ) : notes.length === 0 ? (
        <div className="glass-card text-center animate-fade-in mt-12">
          <h3 className="text-2xl font-bold mb-4">No notes found</h3>
          <p className="text-slate-400 mb-6">Start capturing your ideas by creating a new note.</p>
          <button className="bg-primary text-white hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(99,102,241,0.3)] px-5 py-2.5 rounded-lg font-semibold transition-all duration-300" onClick={() => openModal()}>Create your first note</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {notes.map(note => (
            <div key={note._id} className="p-6 rounded-xl bg-card-bg border border-white/10 hover:-translate-y-1 hover:shadow-2xl hover:border-white/20 transition-all flex flex-col animate-fade-in">
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-primary">{note.title}</h3>
                  <span className="text-xs px-2.5 py-1 bg-primary/20 text-primary rounded-full whitespace-nowrap ml-2">
                    {note.category}
                  </span>
                </div>
                <p className="text-slate-400 mb-5 whitespace-pre-wrap">{note.description}</p>
              </div>
              <div className="flex gap-3 justify-end mt-auto">
                <button className="bg-transparent text-slate-100 border border-white/10 hover:bg-white/5 px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-300" onClick={() => openModal(note)}>Edit</button>
                <button className="bg-danger text-white hover:bg-danger-hover hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(239,68,68,0.3)] px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-300" onClick={() => handleDelete(note._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card animate-fade-in w-full max-w-lg p-8">
            <h3 className="mb-6 text-2xl font-bold">{editingId ? 'Edit Note' : 'Add New Note'}</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="title"
                placeholder="Note Title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-white/10 bg-slate-900/60 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                required
              />
              <input
                type="text"
                name="category"
                placeholder="Category (e.g., Personal, Work)"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-white/10 bg-slate-900/60 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <textarea
                name="description"
                placeholder="Note Description"
                rows="5"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-white/10 bg-slate-900/60 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                required
              ></textarea>
              <div className="flex gap-3 justify-end mt-4">
                <button type="button" className="bg-transparent text-slate-100 border border-white/10 hover:bg-white/5 px-5 py-2.5 rounded-lg font-semibold transition-all duration-300" onClick={closeModal}>Cancel</button>
                <button type="submit" className="bg-primary text-white hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(99,102,241,0.3)] px-5 py-2.5 rounded-lg font-semibold transition-all duration-300">Save Note</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
