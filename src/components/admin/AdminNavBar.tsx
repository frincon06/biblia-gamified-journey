
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  BarChart3, 
  ChevronLeft,
  LogOut
} from "lucide-react";
import { 
  NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  NavigationMenuTrigger 
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

const AdminNavBar = () => {
  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminEmail");
    window.location.href = "/admin";
  };

  return (
    <div className="bg-sidebar border-b border-sidebar-border py-2 px-4 flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <Link to="/admin/dashboard" className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="font-semibold">Panel Admin</span>
        </Link>
        
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/admin/dashboard">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <BookOpen className="w-4 h-4 mr-2" />
                Cursos
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-1 p-2">
                  <li>
                    <Link to="/admin/courses" className="block select-none rounded-md p-2 hover:bg-accent hover:text-accent-foreground">
                      Gestionar Cursos
                    </Link>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/admin/users">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <Users className="w-4 h-4 mr-2" />
                  Usuarios
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/admin/stats">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Estadísticas
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      
      <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center">
        <LogOut className="w-4 h-4 mr-2" />
        Cerrar sesión
      </Button>
    </div>
  );
};

export default AdminNavBar;
