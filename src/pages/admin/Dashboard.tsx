
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  GraduationCap,  
  Users, 
  BarChart3, 
  LogOut,
  Book
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  
  useEffect(() => {
    const email = localStorage.getItem("adminEmail");
    setAdminEmail(email);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminEmail");
    window.location.href = "/admin";
  };

  return (
    <div className="container mx-auto p-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <p className="text-gray-600">Bienvenido, {adminEmail || "administrador"}</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Cerrar sesión
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Cursos</CardTitle>
            <CardDescription>Total de cursos disponibles</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">5</p>
          </CardContent>
          <CardFooter>
            <Link to="/admin/courses" className="text-blue-600 hover:underline text-sm">
              Ver todos los cursos
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Lecciones</CardTitle>
            <CardDescription>Total de lecciones</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">24</p>
          </CardContent>
          <CardFooter>
            <Link to="/admin/courses" className="text-blue-600 hover:underline text-sm">
              Gestionar lecciones
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Usuarios</CardTitle>
            <CardDescription>Total de usuarios registrados</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">152</p>
          </CardContent>
          <CardFooter>
            <Link to="/admin/users" className="text-blue-600 hover:underline text-sm">
              Ver todos los usuarios
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Completadas</CardTitle>
            <CardDescription>Lecciones completadas por usuarios</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">487</p>
          </CardContent>
          <CardFooter>
            <Link to="/admin/stats" className="text-blue-600 hover:underline text-sm">
              Ver estadísticas
            </Link>
          </CardFooter>
        </Card>
      </div>

      <h2 className="text-xl font-bold mb-4">Acciones rápidas</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/admin/courses">
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer h-full">
            <CardContent className="flex flex-col items-center justify-center py-6">
              <BookOpen className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="font-medium text-center">Gestionar Cursos</h3>
              <p className="text-gray-500 text-sm text-center mt-1">
                Crear, editar o eliminar cursos
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/courses">
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer h-full">
            <CardContent className="flex flex-col items-center justify-center py-6">
              <Book className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="font-medium text-center">Gestionar Lecciones</h3>
              <p className="text-gray-500 text-sm text-center mt-1">
                Administrar contenido de lecciones
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/users">
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer h-full">
            <CardContent className="flex flex-col items-center justify-center py-6">
              <Users className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="font-medium text-center">Gestionar Usuarios</h3>
              <p className="text-gray-500 text-sm text-center mt-1">
                Ver progreso y datos de usuarios
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/stats">
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer h-full">
            <CardContent className="flex flex-col items-center justify-center py-6">
              <BarChart3 className="h-12 w-12 text-amber-600 mb-4" />
              <h3 className="font-medium text-center">Estadísticas</h3>
              <p className="text-gray-500 text-sm text-center mt-1">
                Analizar datos de uso de la plataforma
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
