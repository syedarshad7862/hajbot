import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  // Still checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span>Checking authentication…</span>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Authenticated
  return children;
};

export default ProtectedRoute;
