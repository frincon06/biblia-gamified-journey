
import { Home, BookOpen, Award, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";

export function NavBar() {
  const location = useLocation();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };
    
    getUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  // Basic nav items always shown
  const baseNavItems = [
    { icon: Home, path: "/", label: "Inicio" },
    { icon: BookOpen, path: "/cursos", label: "Cursos" },
  ];
  
  // Nav items only shown when logged in
  const authNavItems = [
    { icon: Award, path: "/logros", label: "Logros" },
    { icon: User, path: "/perfil", label: "Perfil" }
  ];
  
  // Combine nav items based on authentication status
  const navItems = [...baseNavItems, ...(user ? authNavItems : [])];
  
  if (loading) return null;
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border py-2 px-4 flex justify-around md:top-0 md:bottom-auto md:border-b md:border-t-0 md:py-3 md:px-6 z-10">
      <div className="flex justify-around w-full max-w-screen-xl mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex flex-col items-center px-2 py-1 rounded-lg transition-all duration-300 hover:scale-105 ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              <item.icon className={`w-6 h-6 ${isActive ? "text-primary" : ""}`} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
