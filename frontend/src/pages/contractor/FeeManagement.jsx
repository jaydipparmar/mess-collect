import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import Spinner from '../../components/Spinner';
import Modal from '../../components/Modal';
import { getFees, createFee, updateFee, deleteFee } from '../../services/feeService';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const CURRENT_YEAR = new Date().getFullYear();

const emptyForm = { month: 'January', year: CURRENT_YEAR, amount: '' };

const FeeManagement = () => {
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingFee, setEditingFee] = useState(null);
    const [form, setForm] = useState(emptyForm);

    const fetchFees = async () => {
        try {
            const res = await getFees();
            setFees(res.data.fees);
        } catch { toast.error('Failed to load fees'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchFees(); }, []);

    const openAdd = () => { setEditingFee(null); setForm(emptyForm); setModalOpen(true); };
    const openEdit = (fee) => { setEditingFee(fee); setForm({ month: fee.month, year: fee.year, amount: fee.amount }); setModalOpen(true); };
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingFee) {
                await updateFee(editingFee._id, { ...form, amount: parseFloat(form.amount), year: parseInt(form.year) });
                toast.success('Fee updated!');
            } else {
                await createFee({ ...form, amount: parseFloat(form.amount), year: parseInt(form.year) });
                toast.success('Fee created! Pending payments added for all students.');
            }
            setModalOpen(false);
            fetchFees();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Operation failed');
        } finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this fee and all related payment records?')) return;
        setDeletingId(id);
        try {
            await deleteFee(id);
            toast.success('Fee deleted successfully');
            fetchFees();
        } catch { toast.error('Failed to delete fee'); }
        finally { setDeletingId(null); }
    };

    const years = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - 1 + i);

    return (
        <div className="page-container min-h-screen">
            <Navbar />
            <div className="content-container">
                <div className="flex items-center justify-between mb-8 animate-fade-in">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Fee Management</h1>
                        <p className="text-white/50 mt-1">Create and manage monthly mess fees</p>
                    </div>
                    <button onClick={openAdd} className="btn-primary flex items-center gap-2">
                        ➕ Add Fee
                    </button>
                </div>

                <div className="glass overflow-hidden animate-slide-up">
                    {loading ? (
                        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
                    ) : fees.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-5xl mb-3">📋</div>
                            <p className="text-white/50">No fees added yet. Click "Add Fee" to get started.</p>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="table-style">
                                <thead>
                                    <tr>
                                        <th>Month & Year</th>
                                        <th>Amount</th>
                                        <th>Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fees.map((fee) => (
                                        <tr key={fee._id}>
                                            <td>
                                                <span className="font-semibold text-white">{fee.month} {fee.year}</span>
                                            </td>
                                            <td>
                                                <span className="text-accent font-bold text-base">₹{fee.amount.toLocaleString('en-IN')}</span>
                                            </td>
                                            <td>
                                                <span className="text-white/50 text-sm">{new Date(fee.createdAt).toLocaleDateString('en-IN')}</span>
                                            </td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button onClick={() => openEdit(fee)} className="text-accent hover:text-hover text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all">
                                                        ✏️ Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(fee._id)}
                                                        disabled={deletingId === fee._id}
                                                        className="btn-danger text-sm px-3 py-1.5"
                                                    >
                                                        {deletingId === fee._id ? '⏳' : '🗑️ Delete'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Add/Edit Modal */}
                <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingFee ? 'Edit Fee' : 'Add Monthly Fee'}>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-white/70 text-sm mb-1.5">Month *</label>
                            <select name="month" value={form.month} onChange={handleChange} className="input-field" required>
                                {MONTHS.map((m) => <option key={m} value={m} className="bg-navy">{m}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-white/70 text-sm mb-1.5">Year *</label>
                            <select name="year" value={form.year} onChange={handleChange} className="input-field" required>
                                {years.map((y) => <option key={y} value={y} className="bg-navy">{y}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-white/70 text-sm mb-1.5">Amount (₹) *</label>
                            <input name="amount" type="number" value={form.amount} onChange={handleChange}
                                className="input-field" placeholder="e.g. 2500" min="1" step="0.01" required />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                                {saving ? <><Spinner size="sm" /> Saving...</> : editingFee ? '💾 Update Fee' : '➕ Create Fee'}
                            </button>
                            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
                        </div>
                    </form>
                </Modal>
            </div>
        </div>
    );
};

export default FeeManagement;
