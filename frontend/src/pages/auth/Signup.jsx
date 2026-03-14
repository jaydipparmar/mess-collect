import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signup } from '../../services/authService';
import Spinner from '../../components/Spinner';

const Signup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        collegeName: '', name: '', phone: '', email: '',
        password: '', confirmPassword: '', role: 'student',
        age: '', address: '',
    });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            const res = await signup({ ...form, age: form.age ? parseInt(form.age) : undefined });
            toast.success(res.data.message);
            navigate('/verify-otp', { state: { email: form.email } });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-navy-gradient flex items-center justify-center p-4 py-10">
            <div className="w-full max-w-lg animate-slide-up">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="text-5xl mb-3">🍽️</div>
                    <h1 className="text-3xl font-bold text-accent">Mess Collect</h1>
                    <p className="text-white/50 text-sm mt-1">Hostel Mess Fee Management</p>
                </div>

                <div className="glass p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Create Account</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Role Selection */}
                        <div className="flex gap-3 p-1 bg-white/5 rounded-xl">
                            {['student', 'contractor'].map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setForm({ ...form, role: r })}
                                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all duration-200 ${form.role === r
                                            ? 'bg-accent text-navy shadow-lg'
                                            : 'text-white/60 hover:text-white'
                                        }`}
                                >
                                    {r === 'student' ? '🎓 Student' : '👔 Mess Contractor'}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white/70 text-sm mb-1.5">Full Name *</label>
                                <input name="name" value={form.name} onChange={handleChange} required
                                    className="input-field" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-white/70 text-sm mb-1.5">Phone Number *</label>
                                <input name="phone" value={form.phone} onChange={handleChange} required
                                    className="input-field" placeholder="10-digit number" maxLength={10} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-white/70 text-sm mb-1.5">College Name *</label>
                            <input name="collegeName" value={form.collegeName} onChange={handleChange} required
                                className="input-field" placeholder="e.g. ABC Engineering College" />
                        </div>

                        <div>
                            <label className="block text-white/70 text-sm mb-1.5">Email Address *</label>
                            <input name="email" type="email" value={form.email} onChange={handleChange} required
                                className="input-field" placeholder="you@example.com" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white/70 text-sm mb-1.5">Age</label>
                                <input name="age" type="number" value={form.age} onChange={handleChange}
                                    className="input-field" placeholder="e.g. 20" min={10} max={100} />
                            </div>
                            <div>
                                <label className="block text-white/70 text-sm mb-1.5">Address</label>
                                <input name="address" value={form.address} onChange={handleChange}
                                    className="input-field" placeholder="Your address" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white/70 text-sm mb-1.5">Password *</label>
                                <input name="password" type="password" value={form.password} onChange={handleChange} required
                                    className="input-field" placeholder="Min 6 characters" minLength={6} />
                            </div>
                            <div>
                                <label className="block text-white/70 text-sm mb-1.5">Confirm Password *</label>
                                <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required
                                    className="input-field" placeholder="Repeat password" />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
                            {loading ? <><Spinner size="sm" /> Creating Account...</> : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-center text-white/50 text-sm mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-accent hover:text-hover font-medium transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
