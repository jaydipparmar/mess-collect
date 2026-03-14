import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { verifyOtp, resendOtp } from '../../services/authService';
import Spinner from '../../components/Spinner';

const OtpVerify = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';

    const [otp, setOtp] = useState(Array(6).fill(''));
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const inputsRef = useRef([]);

    useEffect(() => {
        inputsRef.current[0]?.focus();
    }, []);

    useEffect(() => {
        if (resendTimer > 0) {
            const t = setTimeout(() => setResendTimer((v) => v - 1), 1000);
            return () => clearTimeout(t);
        }
    }, [resendTimer]);

    const handleChange = (value, index) => {
        if (!/^\d*$/.test(value)) return; // only digits
        const updated = [...otp];
        updated[index] = value.slice(-1);
        setOtp(updated);
        if (value && index < 5) inputsRef.current[index + 1]?.focus();
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const updated = [...otp];
        paste.split('').forEach((char, i) => { updated[i] = char; });
        setOtp(updated);
        inputsRef.current[Math.min(paste.length, 5)]?.focus();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const code = otp.join('');
        if (code.length < 6) { toast.error('Please enter all 6 digits'); return; }
        setLoading(true);
        try {
            const res = await verifyOtp({ email, otp: code });
            toast.success(res.data.message);
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendTimer > 0) return;
        setResendLoading(true);
        try {
            await resendOtp(email);
            toast.success('New OTP sent!');
            setResendTimer(60);
            setOtp(Array(6).fill(''));
            inputsRef.current[0]?.focus();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to resend OTP');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-navy-gradient flex items-center justify-center p-4">
            <div className="w-full max-w-md animate-slide-up">
                <div className="text-center mb-8">
                    <div className="text-5xl mb-3">📧</div>
                    <h1 className="text-3xl font-bold text-accent">Verify Your Email</h1>
                    <p className="text-white/50 text-sm mt-2">
                        Enter the 6-digit OTP sent to <span className="text-accent font-medium">{email || 'your email'}</span>
                    </p>
                </div>

                <div className="glass p-8">
                    <form onSubmit={handleSubmit}>
                        {/* OTP Input Boxes */}
                        <div className="flex gap-3 justify-center mb-8" onPaste={handlePaste}>
                            {otp.map((digit, i) => (
                                <input
                                    key={i}
                                    ref={(el) => (inputsRef.current[i] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(e.target.value, i)}
                                    onKeyDown={(e) => handleKeyDown(e, i)}
                                    className="otp-input"
                                    aria-label={`OTP digit ${i + 1}`}
                                />
                            ))}
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                            {loading ? <><Spinner size="sm" /> Verifying...</> : 'Verify OTP'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-white/50 text-sm mb-2">Didn't receive the code?</p>
                        <button
                            onClick={handleResend}
                            disabled={resendLoading || resendTimer > 0}
                            className="text-accent hover:text-hover font-medium text-sm transition-colors disabled:opacity-50"
                        >
                            {resendLoading ? 'Sending...' : resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                        </button>
                    </div>

                    <p className="text-center text-white/30 text-xs mt-4">
                        OTP expires in 5 minutes
                    </p>

                    <div className="mt-4 text-center">
                        <Link to="/signup" className="text-white/40 hover:text-white/70 text-sm transition-colors">
                            ← Back to Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OtpVerify;
