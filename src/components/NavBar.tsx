
import { Home, BookOpen, Award, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function NavBar() {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, path: "/", label: "Inicio" },
    { icon: BookOpen, path: "/cursos", label: "Cursos" },
    { icon: Award, path: "/logros", label: "Logros" },
    { icon: User, path: "/perfil", label: "Perfil" }
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 flex justify-around">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link 
            key={item.path} 
            to={item.path}
            className={`flex flex-col items-center px-2 py-1 rounded-lg ${
              isActive ? "text-sagr-blue" : "text-sagr-gray-500 hover:text-sagr-blue"
            }`}
          >
            <item.icon className={`w-6 h-6 ${isActive ? "text-sagr-blue" : ""}`} />
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
