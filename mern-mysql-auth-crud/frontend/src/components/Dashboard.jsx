import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getItems, createItem, updateItem, deleteItem, getStats } from '../api/itemApi';

const STATUS_COLORS = { active: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700', completed: 'bg-blue-100 text-blue-700' };

const emptyForm = { title: '', description: '', status: 'active' };

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, completed: 0 });
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchData = async () => {
    try {
      const [itemRes, statRes] = await Promise.all([getItems(), getStats()]);
      setItems(itemRes.data.items);
      setStats(statRes.data.stats);
    } catch {}
  };

  useEffect(() => { fetchData(); }, []);

  const flash = (type, msg) => {
    if (type === 'success') { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); }
    else { setError(msg); setTimeout(() => setError(''), 4000); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return flash('error', 'Title is required');
    setLoading(true);
    try {
      if (editId) {
        await updateItem(editId, form);
        flash('success', 'Item updated!');
      } else {
        await createItem(form);
        flash('success', 'Item created!');
      }
      setForm(emptyForm);
      setEditId(null);
      fetchData();
    } catch (err) {
      flash('error', err.response?.data?.message || 'Operation failed');
    } finally { setLoading(false); }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({ title: item.title, description: item.description || '', status: item.status });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async () => {
    try {
      await deleteItem(deleteId);
      setDeleteId(null);
      flash('success', 'Item deleted!');
      fetchData();
    } catch { flash('error', 'Delete failed'); }
  };

  const statCards = [
    { label: 'Total', value: stats.total, color: 'bg-purple-100 text-purple-700' },
    { label: 'Active', value: stats.active, color: 'bg-green-100 text-green-700' },
    { label: 'Pending', value: stats.pending, color: 'bg-yellow-100 text-yellow-700' },
    { label: 'Completed', value: stats.completed, color: 'bg-blue-100 text-blue-700' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 font-medium">👋 {user?.name}</span>
          <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600">Logout</button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-6">
        {/* Alerts */}
        {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">{success}</div>}

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map(s => (
            <div key={s.label} className={`rounded-xl p-4 text-center font-semibold ${s.color}`}>
              <div className="text-3xl font-bold">{s.value || 0}</div>
              <div className="text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-lg font-bold mb-4">{editId ? '✏️ Edit Item' : '➕ Add New Item'}</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
              placeholder="Title *" className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              placeholder="Description (optional)" rows={3}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            <div className="flex gap-3">
              <button type="submit" disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50">
                {loading ? 'Saving...' : editId ? 'Update' : 'Add Item'}
              </button>
              {editId && (
                <button type="button" onClick={() => { setEditId(null); setForm(emptyForm); }}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
              )}
            </div>
          </form>
        </div>

        {/* Items Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <h2 className="text-lg font-bold p-6 border-b">Your Items ({items.length})</h2>
          {items.length === 0 ? (
            <p className="text-center text-gray-400 py-12">No items yet. Add one above!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {['Title','Description','Status','Created','Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {items.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{item.title}</td>
                      <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{item.description || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[item.status]}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400">{new Date(item.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(item)}
                            className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded hover:bg-yellow-200 text-xs font-semibold">Edit</button>
                          <button onClick={() => setDeleteId(item.id)}
                            className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 text-xs font-semibold">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 shadow-xl">
            <h3 className="text-lg font-bold mb-2">Confirm Delete</h3>
            <p className="text-gray-500 mb-6">Are you sure you want to delete this item? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={handleDelete} className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 font-semibold">Delete</button>
              <button onClick={() => setDeleteId(null)} className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-200">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}