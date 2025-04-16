import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAdmin, loading } = useAuth();

  // Mientras verifica, mostrar un spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Si no es admin, redirigir a la página de autenticación de administrador
  if (!isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  // Si es admin, mostrar el contenido protegido
  return <>{children}</>;
};

export default AdminRoute;
