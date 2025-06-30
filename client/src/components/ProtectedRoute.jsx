import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, role }) {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) {
    return <Navigate to="/login" />;
  }

  if (role && userInfo.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
}
