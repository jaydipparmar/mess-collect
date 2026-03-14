import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import Spinner from '../../components/Spinner';
import { getAnalytics } from '../../services/paymentService';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const StatCard = ({ icon, label, value, color, delay }) => (
    <div className="glass p-6 animate-slide-up" style={{ animationDelay: delay }}>
        <div className={`text-3xl mb-3 w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
            {icon}
        </div>
        <p className="text-white/50 text-sm">{label}</p>
        <p className="text-3xl font-bold text-white mt-1">{value}</p>
    </div>
);

const ContractorDashboard = () => {
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getAnalytics();
                setAnalytics(res.data.analytics);
            } catch {
                toast.error('Failed to load analytics');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const quickLinks = [
        { to: '/contractor/fees', icon: '💰', label: 'Manage Fees', desc: 'Add, edit, or delete monthly mess fees' },
        { to: '/contractor/students', icon: '👥', label: 'Manage Students', desc: 'View, add, edit, or remove students' },
        { to: '/contractor/profile', icon: '👤', label: 'My Profile', desc: 'View and update your profile' },
    ];

    return (
        <div className="page-container min-h-screen">
            <Navbar />
            <div className="content-container">
                {/* Header */}
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-3xl font-bold text-white">
                        Welcome, <span className="text-accent">{user?.name}!</span>
                    </h1>
                    <p className="text-white/50 mt-1">{user?.collegeName} — Mess Contractor</p>
                </div>

                {/* Analytics */}
                {loading ? (
                    <div className="flex justify-center py-12"><Spinner size="lg" /></div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                        <StatCard icon="👥" label="Total Students" value={analytics?.totalStudents ?? 0} color="bg-blue-500/20 text-blue-400" delay="0s" />
                        <StatCard icon="✅" label="Payments Received" value={analytics?.totalPaid ?? 0} color="bg-green-500/20 text-green-400" delay="0.1s" />
                        <StatCard icon="⏳" label="Pending Payments" value={analytics?.totalPending ?? 0} color="bg-yellow-500/20 text-yellow-400" delay="0.2s" />
                        <StatCard
                            icon="💰"
                            label="Total Collected"
                            value={`₹${(analytics?.totalCollected ?? 0).toLocaleString('en-IN')}`}
                            color="bg-accent/20 text-accent"
                            delay="0.3s"
                        />
                    </div>
                )}

                {/* Quick Links */}
                <h2 className="text-xl font-semibold text-white/70 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {quickLinks.map((link) => (
                        <Link key={link.to} to={link.to} className="glass p-6 hover:bg-white/10 transition-all duration-200 group block animate-slide-up">
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">{link.icon}</div>
                            <h3 className="text-lg font-semibold text-white group-hover:text-accent transition-colors">{link.label}</h3>
                            <p className="text-white/40 text-sm mt-1">{link.desc}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ContractorDashboard;
