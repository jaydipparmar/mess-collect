import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import Spinner from '../../components/Spinner';
import { useAuth } from '../../context/AuthContext';
import { getProfile, updateProfile } from '../../services/studentService';

const StudentProfile = () => {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ name: '', age: '', address: '', phone: '' });

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || '',
                age: user.age || '',
                address: user.address || '',
                phone: user.phone || '',
            });
        }
    }, [user]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { ...form, age: form.age ? parseInt(form.age) : undefined };
            const res = await updateProfile(payload);
            updateUser({ ...user, ...res.data.user });
            toast.success('Profile updated successfully!');
            setEditing(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { label: 'Full Name', name: 'name', type: 'text', placeholder: 'Your full name' },
        { label: 'Age', name: 'age', type: 'number', placeholder: 'Your age' },
        { label: 'Phone Number', name: 'phone', type: 'text', placeholder: '10-digit number' },
        { label: 'Address', name: 'address', type: 'text', placeholder: 'Your address' },
    ];

    return (
        <div className="page-container min-h-screen">
            <Navbar />
            <div className="content-container max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8 animate-fade-in">My Profile</h1>

                <div className="glass p-8 animate-slide-up">
                    {/* Avatar */}
                    <div className="flex items-center gap-5 mb-8 pb-8 border-b border-white/10">
                        <div className="w-20 h-20 rounded-2xl bg-accent/20 border-2 border-accent/30 flex items-center justify-center text-4xl">
                            🎓
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
                            <p className="text-white/50">{user?.email}</p>
                            <p className="text-white/30 text-sm mt-0.5">{user?.collegeName}</p>
                        </div>
                    </div>

                    {/* Non-editable fields */}
                    <div className="space-y-4 mb-6">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Email</p>
                            <p className="text-white font-medium">{user?.email}</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-white/40 text-xs uppercase tracking-wider mb-1">College</p>
                            <p className="text-white font-medium">{user?.collegeName}</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Role</p>
                            <p className="text-white font-medium capitalize">{user?.role}</p>
                        </div>
                    </div>

                    {/* Editable form */}
                    {editing ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {fields.map((f) => (
                                <div key={f.name}>
                                    <label className="block text-white/70 text-sm mb-1.5">{f.label}</label>
                                    <input
                                        name={f.name}
                                        type={f.type}
                                        value={form[f.name]}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder={f.placeholder}
                                    />
                                </div>
                            ))}
                            <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                                    {loading ? <><Spinner size="sm" /> Saving...</> : '💾 Save Changes'}
                                </button>
                                <button type="button" onClick={() => setEditing(false)} className="btn-secondary flex-1">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <div className="space-y-4 mb-6">
                                {fields.map((f) => (
                                    <div key={f.name} className="p-4 bg-white/5 rounded-xl border border-white/10">
                                        <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{f.label}</p>
                                        <p className="text-white font-medium">{form[f.name] || '—'}</p>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => setEditing(true)} className="btn-primary w-full">
                                ✏️ Edit Profile
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
