import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="page-container flex flex-col min-h-screen">
            {/* Navigation Bar */}
            <nav className="w-full glass-light px-6 py-4 fixed top-0 z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        {/* Logo Icon */}
                        <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xl font-bold tracking-wide text-white">Mess<span className="text-accent">Collect</span></span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="btn-secondary py-2 px-5 text-sm hidden sm:block">
                            Sign In
                        </Link>
                        <Link to="/signup" className="btn-primary py-2 px-5 text-sm">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col justify-center items-center px-4 pt-24 pb-12 relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] -z-10 animate-fade-in" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] -z-10 animate-fade-in" />

                <div className="max-w-4xl w-full text-center space-y-8 animate-slide-up">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
                        Smart Mess Fee <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-hover">
                            Management System
                        </span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                        Streamline hostel mess fee collections, automate receipts with QR verifications, and track pending dues with an elegant glassmorphic experience.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link to="/signup" className="btn-primary w-full sm:w-auto text-lg px-8 py-4 flex items-center justify-center gap-2 group">
                            Start for Free
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                        <a href="#features" className="btn-secondary w-full sm:w-auto text-lg px-8 py-4">
                            Explore Features
                        </a>
                    </div>
                </div>
            </main>

            {/* Features Section */}
            <section id="features" className="w-full max-w-7xl mx-auto px-6 py-24 z-10">
                <div className="text-center mb-16 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <h2 className="text-3xl font-bold mb-4">Why choose MessCollect?</h2>
                    <p className="text-white/70 max-w-2xl mx-auto">Everything you need to manage your hostel mess operations seamlessly for both students and contractors.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="glass p-8 hover:bg-white/10 transition-colors duration-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center mb-6">
                            <svg className="w-7 h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Student Dashboard</h3>
                        <p className="text-white/60 leading-relaxed">View pending dues, make instant payments via Razorpay, and download verified digital receipts anytime.</p>
                    </div>

                    {/* Feature 2 */}
                    <div className="glass p-8 hover:bg-white/10 transition-colors duration-300 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6">
                            <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Contractor Analytics</h3>
                        <p className="text-white/60 leading-relaxed">Track overall collection metrics, manage student records, and send automated email reminders for pending fees.</p>
                    </div>

                    {/* Feature 3 */}
                    <div className="glass p-8 hover:bg-white/10 transition-colors duration-300 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                        <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center mb-6">
                            <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Secure & Verified</h3>
                        <p className="text-white/60 leading-relaxed">OTP-based authentication, role-based strict protected routes, and cryptographic QR signatures for receipts.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full glass-light border-x-0 border-b-0 py-8 text-center mt-auto">
                <p className="text-white/50 text-sm">
                    © {new Date().getFullYear()} MessCollect. Designed with <span className="text-red-500">♥</span> for hassle-free messes.
                </p>
            </footer>
        </div>
    );
};

export default Home;
