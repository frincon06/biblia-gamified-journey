
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Book,
  Users, 
  BarChart3, 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import AdminNavBar from "@/components/admin/AdminNavBar";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [stats, setStats] = useState({
    coursesCount: 0,
    lessonsCount: 0,
    usersCount: 0,
    completedLessonsCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const email = localStorage.getItem("adminEmail");
    setAdminEmail(email);
    
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      // Get courses count
      const { count: coursesCount, error: coursesError } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true });
      
      if (coursesError) throw coursesError;
      
      // Get lessons count
      const { count: lessonsCount, error: lessonsError } = await supabase
        .from('lessons')
        .select('*', { count: 'exact', head: true });
      
      if (lessonsError) throw lessonsError;
      
      // Get users count (simplified - would normally be from auth.users)
      const { count: usersCount, error: usersError } = await supabase
        .from('user_progress')
        .select('*', { count: 'exact', head: true });
      
      if (usersError) throw usersError;
      
      // Get completed lessons count
      const { count: completedLessonsCount, error: completedError } = await supabase
        .from('completed_lessons')
        .select('*', { count: 'exact', head: true });
      
      if (completedError) throw completedError;
      
      setStats({
        coursesCount: coursesCount || 0,
        lessonsCount: lessonsCount || 0,
        usersCount: usersCount || 0,
        completedLessonsCount: completedLessonsCount || 0
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <AdminNavBar />

      <div className="container mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <p className="text-muted-foreground">Bienvenido, {adminEmail || "administrador"}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Cursos</CardTitle>
              <CardDescription>Total de cursos disponibles</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <p className="text-3xl font-bold">{stats.coursesCount}</p>
              )}
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
              {isLoading ? (
                <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <p className="text-3xl font-bold">{stats.lessonsCount}</p>
              )}
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
              {isLoading ? (
                <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <p className="text-3xl font-bold">{stats.usersCount}</p>
              )}
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
              {isLoading ? (
                <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <p className="text-3xl font-bold">{stats.completedLessonsCount}</p>
              )}
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
            <Card className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center py-6">
                <BookOpen className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="font-medium text-center">Gestionar Cursos</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm text-center mt-1">
                  Crear, editar o eliminar cursos
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/courses">
            <Card className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center py-6">
                <Book className="h-12 w-12 text-green-600 mb-4" />
                <h3 className="font-medium text-center">Gestionar Lecciones</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm text-center mt-1">
                  Administrar contenido de lecciones
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/users">
            <Card className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center py-6">
                <Users className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="font-medium text-center">Gestionar Usuarios</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm text-center mt-1">
                  Ver progreso y datos de usuarios
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/stats">
            <Card className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center py-6">
                <BarChart3 className="h-12 w-12 text-amber-600 mb-4" />
                <h3 className="font-medium text-center">Estadísticas</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm text-center mt-1">
                  Analizar datos de uso de la plataforma
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
