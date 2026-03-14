import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import Spinner from '../../components/Spinner';
import Modal from '../../components/Modal';
import { getAllStudents, addStudent, updateStudent, removeStudent } from '../../services/studentService';

const emptyForm = { name: '', email: '', phone: '', age: '', address: '' };

const StudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [removingId, setRemovingId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const LIMIT = 10;

    const fetchStudents = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, limit: LIMIT };
            if (search) params.search = search;
            if (statusFilter !== 'all') params.status = statusFilter;
            const res = await getAllStudents(params);
            setStudents(res.data.students);
            setTotal(res.data.total);
        } catch { toast.error('Failed to load students'); }
        finally { setLoading(false); }
    }, [page, search, statusFilter]);

    useEffect(() => { fetchStudents(); }, [fetchStudents]);

    const openAdd = () => { setEditingStudent(null); setForm(emptyForm); setModalOpen(true); };
    const openEdit = (s) => { setEditingStudent(s); setForm({ name: s.name, email: s.email, phone: s.phone, age: s.age || '', address: s.address || '' }); setModalOpen(true); };
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingStudent) {
                await updateStudent(editingStudent._id, { name: form.name, phone: form.phone, age: parseInt(form.age) || undefined, address: form.address });
                toast.success('Student updated!');
            } else {
                await addStudent({ ...form, age: parseInt(form.age) || undefined });
                toast.success('Student added! OTP sent to their email.');
            }
            setModalOpen(false);
            fetchStudents();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Operation failed');
        } finally { setSaving(false); }
    };

    const handleRemove = async (id) => {
        if (!window.confirm('Remove this student and all their payment records?')) return;
        setRemovingId(id);
        try {
            await removeStudent(id);
            toast.success('Student removed');
            fetchStudents();
        } catch { toast.error('Failed to remove student'); }
        finally { setRemovingId(null); }
    };

    const totalPages = Math.ceil(total / LIMIT);

    return (
        <div className="page-container min-h-screen">
            <Navbar />
            <div className="content-container">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Student Management</h1>
                        <p className="text-white/50 mt-1">Total: {total} students</p>
                    </div>
                    <button onClick={openAdd} className="btn-primary flex items-center gap-2 self-start sm:self-auto">
                        ➕ Add Student
                    </button>
                </div>

                {/* Search & Filter */}
                <div className="glass p-4 mb-6 flex flex-col sm:flex-row gap-3 animate-slide-up">
                    <div className="flex-1 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">🔍</span>
                        <input
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="input-field pl-9"
                            placeholder="Search by name or phone..."
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                        className="input-field w-full sm:w-44"
                    >
                        <option value="all" className="bg-navy">All Students</option>
                        <option value="paid" className="bg-navy">✅ Paid</option>
                        <option value="pending" className="bg-navy">⏳ Has Pending</option>
                    </select>
                </div>

                {/* Table */}
                <div className="glass overflow-hidden animate-slide-up">
                    {loading ? (
                        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
                    ) : students.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-5xl mb-3">👥</div>
                            <p className="text-white/50">No students found.</p>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="table-style">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((s) => (
                                        <tr key={s._id}>
                                            <td>
                                                <p className="font-medium text-white">{s.name}</p>
                                                {s.address && <p className="text-white/30 text-xs">{s.address}</p>}
                                            </td>
                                            <td className="text-white/70">{s.email}</td>
                                            <td className="text-white/70">{s.phone}</td>
                                            <td>
                                                {s.isVerified
                                                    ? <span className="badge-paid">✅ Verified</span>
                                                    : <span className="badge-pending">⏳ Pending</span>
                                                }
                                            </td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button onClick={() => openEdit(s)} className="text-accent hover:text-hover text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all">
                                                        ✏️ Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemove(s._id)}
                                                        disabled={removingId === s._id}
                                                        className="btn-danger text-sm px-3 py-1.5"
                                                    >
                                                        {removingId === s._id ? '⏳' : '🗑️'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-3 p-4 border-t border-white/10">
                            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary px-3 py-1.5 text-sm disabled:opacity-30">
                                ← Prev
                            </button>
                            <span className="text-white/50 text-sm">Page {page} of {totalPages}</span>
                            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-secondary px-3 py-1.5 text-sm disabled:opacity-30">
                                Next →
                            </button>
                        </div>
                    )}
                </div>

                {/* Add/Edit Modal */}
                <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingStudent ? 'Edit Student' : 'Add Student'}>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-white/70 text-sm mb-1.5">Full Name *</label>
                            <input name="name" value={form.name} onChange={handleChange} className="input-field" placeholder="Student name" required />
                        </div>
                        {!editingStudent && (
                            <div>
                                <label className="block text-white/70 text-sm mb-1.5">Email *</label>
                                <input name="email" type="email" value={form.email} onChange={handleChange} className="input-field" placeholder="student@example.com" required />
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-white/70 text-sm mb-1.5">Phone *</label>
                                <input name="phone" value={form.phone} onChange={handleChange} className="input-field" placeholder="10-digit" maxLength={10} required />
                            </div>
                            <div>
                                <label className="block text-white/70 text-sm mb-1.5">Age</label>
                                <input name="age" type="number" value={form.age} onChange={handleChange} className="input-field" placeholder="e.g. 20" min={10} max={100} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-white/70 text-sm mb-1.5">Address</label>
                            <input name="address" value={form.address} onChange={handleChange} className="input-field" placeholder="Student address" />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                                {saving ? <><Spinner size="sm" /> Saving...</> : editingStudent ? '💾 Update' : '➕ Add Student'}
                            </button>
                            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
                        </div>
                    </form>
                </Modal>
            </div>
        </div>
    );
};

export default StudentManagement;
