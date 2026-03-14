import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';

/**
 * ProtectedRoute – guards routes by authentication and optionally by role.
 * redirectTo defaults to /login.
 */
const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useAuth();

    if (loading) return <div className="flex items-center justify-center min-h-screen"><Spinner /></div>;

    if (!user) return <Navigate to="/login" replace />;

    if (role && user.role !== role) {
        return <Navigate to={user.role === 'student' ? '/student/dashboard' : '/contractor/dashboard'} replace />;
    }

    return children;
};

export default ProtectedRoute;
