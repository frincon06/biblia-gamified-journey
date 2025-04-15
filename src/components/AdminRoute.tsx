
import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    // Verificar si el usuario es administrador
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(adminStatus);
  }, []);

  // Mientras verifica, mostrar nada o un spinner
  if (isAdmin === null) {
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
