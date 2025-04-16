import { Home, BookOpen, Award, User, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";

export function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();

  // Basic nav items always shown
  const baseNavItems = [
    { icon: Home, path: "/home", label: "Inicio" },
    { icon: BookOpen, path: "/cursos", label: "Cursos" },
  ];

  // Nav items only shown when logged in
  const authNavItems = [
    { icon: Award, path: "/logros", label: "Logros" },
    { icon: User, path: "/perfil", label: "Perfil" }
  ];

  // Combine nav items based on authentication status
  const navItems = [...baseNavItems, ...(user ? authNavItems : [])];

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente"
      });
      navigate("/auth");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (loading) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 flex justify-around md:top-0 md:bottom-auto md:border-b md:border-t-0 md:py-3 md:px-6 z-10 shadow-sm">
      <div className="flex justify-around w-full max-w-screen-xl mx-auto items-center">
        {/* Navegación */}
        <div className="flex justify-center space-x-2 md:space-x-6 flex-grow">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path ||
                           (item.path === "/home" && location.pathname === "/");
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center px-2 py-1 rounded-lg transition-all duration-300 hover:scale-105 ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                <item.icon className={`w-6 h-6 ${isActive ? "text-blue-600" : ""}`} />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Botón de logout si el usuario está autenticado */}
        {user && (
          <div className="hidden md:block">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-1 text-gray-600 hover:text-red-600"
            >
              <LogOut className="w-4 h-4" />
              <span>Salir</span>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
