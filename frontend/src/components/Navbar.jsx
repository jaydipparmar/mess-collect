import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const studentLinks = [
    { to: '/student/dashboard', label: 'Dashboard' },
    { to: '/student/profile', label: 'Profile' },
];

const contractorLinks = [
    { to: '/contractor/dashboard', label: 'Dashboard' },
    { to: '/contractor/fees', label: 'Fee Management' },
    { to: '/contractor/students', label: 'Students' },
    { to: '/contractor/profile', label: 'Profile' },
];

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const links = user?.role === 'student' ? studentLinks : contractorLinks;

    const handleLogout = () => {
        logout();
        toast.info('Logged out successfully');
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-40 glass border-b border-white/10 rounded-none">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <span className="text-2xl">🍽️</span>
                        <span className="text-xl font-bold text-accent group-hover:text-hover transition-colors">
                            Mess Collect
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {links.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(link.to)
                                        ? 'bg-accent text-navy'
                                        : 'text-white/70 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Section */}
                    <div className="hidden md:flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-sm font-medium text-white">{user?.name}</p>
                            <p className="text-xs text-white/50 capitalize">{user?.role}</p>
                        </div>
                        <button onClick={handleLogout} className="btn-secondary text-sm py-2 px-4">
                            Logout
                        </button>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {menuOpen
                                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            }
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden pb-4 animate-slide-up">
                        <div className="flex flex-col gap-1">
                            {links.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setMenuOpen(false)}
                                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive(link.to)
                                            ? 'bg-accent text-navy'
                                            : 'text-white/70 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="mt-2 pt-2 border-t border-white/10">
                                <p className="text-sm text-white/50 px-4 mb-2">{user?.name} ({user?.role})</p>
                                <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-400 hover:bg-white/10 rounded-lg text-sm transition-colors">
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
