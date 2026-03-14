import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/Spinner';

const Login = () => {
    const navigate = useNavigate();
    const { login: authLogin } = useAuth();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ emailOrPhone: '', password: '', role: 'student' });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await login(form);
            authLogin(res.data.user, res.data.token);
            toast.success(`Welcome back, ${res.data.user.name}! 👋`);
            navigate(res.data.user.role === 'student' ? '/student/dashboard' : '/contractor/dashboard');
        } catch (err) {
            const msg = err.response?.data?.message || 'Login failed';
            if (err.response?.data?.email) {
                toast.error(msg);
                navigate('/verify-otp', { state: { email: err.response.data.email } });
            } else {
                toast.error(msg);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-navy-gradient flex items-center justify-center p-4">
            <div className="w-full max-w-md animate-slide-up">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="text-5xl mb-3">🍽️</div>
                    <h1 className="text-3xl font-bold text-accent">Mess Collect</h1>
                    <p className="text-white/50 text-sm mt-1">Hostel Mess Fee Management</p>
                </div>

                <div className="glass p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Welcome Back</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Role Selection */}
                        <div className="flex gap-3 p-1 bg-white/5 rounded-xl">
                            {['student', 'contractor'].map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setForm({ ...form, role: r })}
                                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all duration-200 ${form.role === r ? 'bg-accent text-navy shadow-lg' : 'text-white/60 hover:text-white'
                                        }`}
                                >
                                    {r === 'student' ? '🎓 Student' : '👔 Contractor'}
                                </button>
                            ))}
                        </div>

                        <div>
                            <label className="block text-white/70 text-sm mb-1.5">Email or Phone *</label>
                            <input
                                name="emailOrPhone"
                                value={form.emailOrPhone}
                                onChange={handleChange}
                                required
                                className="input-field"
                                placeholder="Email or 10-digit phone"
                            />
                        </div>

                        <div>
                            <label className="block text-white/70 text-sm mb-1.5">Password *</label>
                            <input
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                className="input-field"
                                placeholder="Your password"
                            />
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                            {loading ? <><Spinner size="sm" /> Signing In...</> : 'Sign In'}
                        </button>
                    </form>

                    <p className="text-center text-white/50 text-sm mt-6">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-accent hover:text-hover font-medium transition-colors">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
