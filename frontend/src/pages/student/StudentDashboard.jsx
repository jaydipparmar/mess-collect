import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import Spinner from '../../components/Spinner';
import { getStudentFees } from '../../services/feeService';
import { createOrder, verifyPayment } from '../../services/paymentService';
import { generateReceiptPdf } from '../../utils/generatePdf';
import { useAuth } from '../../context/AuthContext';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTH_ORDER = Object.fromEntries(MONTHS.map((m, i) => [m, i]));

const StudentDashboard = () => {
    const { user } = useAuth();
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(null);
    const [activeTab, setActiveTab] = useState('pending');

    const fetchFees = async () => {
        try {
            const res = await getStudentFees();
            setFees(res.data.fees);
        } catch {
            toast.error('Failed to load fees');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchFees(); }, []);

    const pendingFees = fees.filter((f) => !f.payment || f.payment.status === 'pending')
        .sort((a, b) => b.year - a.year || MONTH_ORDER[a.month] - MONTH_ORDER[b.month]);
    const paidFees = fees.filter((f) => f.payment?.status === 'paid')
        .sort((a, b) => new Date(b.payment.paidAt) - new Date(a.payment.paidAt));

    const totalPaid = paidFees.reduce((sum, f) => sum + f.amount, 0);

    const handlePayNow = async (fee) => {
        if (!fee.payment?._id) { toast.error('Payment record not found'); return; }
        setPaying(fee._id);
        try {
            // Call createOrder to initiate dummy generation on backend
            await createOrder(fee.payment._id);

            // --- DUMMY PAYMENT SYSTEM ---
            // Directly call verifyPayment bypassing the Razorpay UI completely
            await verifyPayment({
                paymentId: fee.payment._id,
            });

            toast.success('🎉 Dummy payment successful! Receipt sent to your email.');
            fetchFees();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to initiate dummy payment');
        } finally {
            setPaying(null);
        }
    };

    const handleDownloadReceipt = (fee) => {
        generateReceiptPdf({
            studentName: user.name,
            collegeName: user.collegeName,
            email: user.email,
            month: fee.month,
            year: fee.year,
            amount: fee.amount,
            transactionId: fee.payment.transactionId,
            paidAt: fee.payment.paidAt,
        });
        toast.success('Receipt downloaded!');
    };

    const tabs = [
        { id: 'pending', label: `Pending (${pendingFees.length})`, icon: '⏳' },
        { id: 'paid', label: `Paid (${paidFees.length})`, icon: '✅' },
        { id: 'receipts', label: 'Receipts', icon: '📄' },
    ];

    return (
        <div className="page-container min-h-screen">
            <Navbar />
            <div className="content-container">
                {/* Welcome Header */}
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-3xl font-bold text-white">
                        Welcome, <span className="text-accent">{user?.name}!</span>
                    </h1>
                    <p className="text-white/50 mt-1">{user?.collegeName}</p>
                </div>

                {/* Analytics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="glass p-5 animate-slide-up">
                        <p className="text-white/50 text-sm">Pending Dues</p>
                        <p className="text-3xl font-bold text-yellow-400 mt-1">{pendingFees.length}</p>
                        <p className="text-white/30 text-xs mt-1">months unpaid</p>
                    </div>
                    <div className="glass p-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <p className="text-white/50 text-sm">Paid Months</p>
                        <p className="text-3xl font-bold text-green-400 mt-1">{paidFees.length}</p>
                        <p className="text-white/30 text-xs mt-1">months cleared</p>
                    </div>
                    <div className="glass p-5 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <p className="text-white/50 text-sm">Total Paid</p>
                        <p className="text-3xl font-bold text-accent mt-1">₹{totalPaid.toLocaleString('en-IN')}</p>
                        <p className="text-white/30 text-xs mt-1">overall amount</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="glass p-6">
                    <div className="flex gap-2 mb-6 bg-white/5 p-1 rounded-xl overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${activeTab === tab.id ? 'bg-accent text-navy' : 'text-white/60 hover:text-white'
                                    }`}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
                    ) : (
                        <>
                            {/* Pending Tab */}
                            {activeTab === 'pending' && (
                                <div className="space-y-3">
                                    {pendingFees.length === 0 ? (
                                        <div className="text-center py-16">
                                            <div className="text-5xl mb-3">🎉</div>
                                            <p className="text-white/50">All fees paid! You're up to date.</p>
                                        </div>
                                    ) : (
                                        pendingFees.map((fee) => (
                                            <div key={fee._id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-yellow-500/20 hover:border-yellow-500/40 transition-colors">
                                                <div>
                                                    <p className="font-semibold text-white">{fee.month} {fee.year}</p>
                                                    <p className="text-xl font-bold text-accent mt-0.5">₹{fee.amount.toLocaleString('en-IN')}</p>
                                                    <span className="badge-pending mt-1">⏳ Pending</span>
                                                </div>
                                                <button
                                                    onClick={() => handlePayNow(fee)}
                                                    disabled={paying === fee._id}
                                                    className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2"
                                                >
                                                    {paying === fee._id ? <><Spinner size="sm" /> Processing...</> : '💳 Pay Now'}
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* Paid Tab */}
                            {activeTab === 'paid' && (
                                <div className="space-y-3">
                                    {paidFees.length === 0 ? (
                                        <div className="text-center py-16">
                                            <div className="text-5xl mb-3">💸</div>
                                            <p className="text-white/50">No payments made yet.</p>
                                        </div>
                                    ) : (
                                        paidFees.map((fee) => (
                                            <div key={fee._id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-green-500/20">
                                                <div>
                                                    <p className="font-semibold text-white">{fee.month} {fee.year}</p>
                                                    <p className="text-xl font-bold text-accent mt-0.5">₹{fee.amount.toLocaleString('en-IN')}</p>
                                                    <span className="badge-paid mt-1">✅ Paid</span>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-white/40 text-xs">Paid on</p>
                                                    <p className="text-white/70 text-sm">{new Date(fee.payment.paidAt).toLocaleDateString('en-IN')}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* Receipts Tab */}
                            {activeTab === 'receipts' && (
                                <div className="space-y-3">
                                    {paidFees.length === 0 ? (
                                        <div className="text-center py-16">
                                            <div className="text-5xl mb-3">📄</div>
                                            <p className="text-white/50">No receipts available yet.</p>
                                        </div>
                                    ) : (
                                        paidFees.map((fee) => (
                                            <div key={fee._id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                                                <div>
                                                    <p className="font-semibold text-white">{fee.month} {fee.year}</p>
                                                    <p className="text-accent font-bold">₹{fee.amount.toLocaleString('en-IN')}</p>
                                                    <p className="text-white/30 text-xs font-mono mt-0.5">
                                                        TXN: {fee.payment.transactionId?.slice(0, 20)}...
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleDownloadReceipt(fee)}
                                                    className="btn-secondary text-sm flex items-center gap-2 px-4 py-2"
                                                >
                                                    📥 Download PDF
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
