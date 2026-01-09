import { useAuth } from '../authResource/useAuth';
import { Navigate } from 'react-router';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { session, userRole, isLoading, roleLoading } = useAuth();

    if (isLoading || roleLoading) {
        return <div>Loading...</div>;
    }

    if (!session) {
        return <Navigate to="/" />;
    }

    if (requiredRole && userRole?.toLowerCase() !== requiredRole?.toLowerCase()) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;