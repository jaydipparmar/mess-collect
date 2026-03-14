import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context & Components
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import OtpVerify from './pages/auth/OtpVerify';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';

// Contractor Pages
import ContractorDashboard from './pages/contractor/ContractorDashboard';
import FeeManagement from './pages/contractor/FeeManagement';
import StudentManagement from './pages/contractor/StudentManagement';
import ContractorProfile from './pages/contractor/ContractorProfile';

function App() {
    return (
        <AuthProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                {/* React Toastify configuration matching our custom theme */}
                <ToastContainer
                    position="top-right"
                    autoClose={4000}
                    hideProgressBar={false}
                    newestOnTop={true}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                    toastStyle={{ backgroundColor: '#002d5a', color: '#E6E6E6', border: '1px solid rgba(255,255,255,0.1)' }}
                />

                <Routes>
                    {/* Default Redirect */}
                    <Route path="/" element={<Navigate to="/login" replace />} />

                    {/* Public Auth Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/verify-otp" element={<OtpVerify />} />

                    {/* ─── Student Protected Routes ──────────────────────────────── */}
                    <Route
                        path="/student/dashboard"
                        element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>}
                    />
                    <Route
                        path="/student/profile"
                        element={<ProtectedRoute role="student"><StudentProfile /></ProtectedRoute>}
                    />

                    {/* ─── Contractor Protected Routes ───────────────────────────── */}
                    <Route
                        path="/contractor/dashboard"
                        element={<ProtectedRoute role="contractor"><ContractorDashboard /></ProtectedRoute>}
                    />
                    <Route
                        path="/contractor/fees"
                        element={<ProtectedRoute role="contractor"><FeeManagement /></ProtectedRoute>}
                    />
                    <Route
                        path="/contractor/students"
                        element={<ProtectedRoute role="contractor"><StudentManagement /></ProtectedRoute>}
                    />
                    <Route
                        path="/contractor/profile"
                        element={<ProtectedRoute role="contractor"><ContractorProfile /></ProtectedRoute>}
                    />

                    {/* Catch-all 404 */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
