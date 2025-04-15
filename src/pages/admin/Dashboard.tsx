
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, BookOpen, Users, Award } from "lucide-react";
import { Line } from "recharts";

interface StatsType {
  coursesCount: number;
  lessonsCount: number;
  usersCount: number;
  completedLessonsCount: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<StatsType>({
    coursesCount: 0,
    lessonsCount: 0,
    usersCount: 0,
    completedLessonsCount: 0,
  });
  
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("adminEmail");
    if (email) {
      setAdminEmail(email);
    }
    
    const fetchStats = async () => {
      try {
        // Obtener conteo de cursos
        const { count: coursesCount } = await supabase
          .from("courses")
          .select("*", { count: 'exact', head: true });
        
        // Obtener conteo de lecciones
        const { count: lessonsCount } = await supabase
          .from("lessons")
          .select("*", { count: 'exact', head: true });
        
        // Obtener conteo de usuarios
        const { count: usersCount } = await supabase
          .from("user_progress")
          .select("*", { count: 'exact', head: true });
        
        // Obtener conteo de lecciones completadas
        const { count: completedLessonsCount } = await supabase
          .from("completed_lessons")
          .select("*", { count: 'exact', head: true });
        
        setStats({
          coursesCount: coursesCount || 0,
          lessonsCount: lessonsCount || 0,
          usersCount: usersCount || 0,
          completedLessonsCount: completedLessonsCount || 0,
        });
      } catch (error) {
        console.error("Error al obtener estadísticas:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminEmail");
    window.location.href = "/admin";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Panel de Administración</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">{adminEmail}</span>
          <button 
            onClick={handleLogout}
            className="text-red-600 hover:text-red-800"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
        
        {loading ? (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    Total de Cursos
                  </CardTitle>
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.coursesCount}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Cursos disponibles en la plataforma
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    Total de Lecciones
                  </CardTitle>
                  <Award className="h-5 w-5 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.lessonsCount}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Lecciones disponibles en todos los cursos
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    Total de Usuarios
                  </CardTitle>
                  <Users className="h-5 w-5 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.usersCount}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Usuarios registrados en la plataforma
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    Lecciones Completadas
                  </CardTitle>
                  <BarChart className="h-5 w-5 text-amber-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.completedLessonsCount}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total de lecciones completadas por usuarios
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Accesos rápidos</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <Link 
                    to="/admin/courses" 
                    className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg"
                  >
                    <BookOpen className="h-5 w-5 mr-3 text-blue-600" />
                    <span>Gestionar Cursos</span>
                  </Link>
                  
                  <Link 
                    to="/admin/lessons" 
                    className="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg"
                  >
                    <Award className="h-5 w-5 mr-3 text-green-600" />
                    <span>Gestionar Lecciones</span>
                  </Link>
                  
                  <Link 
                    to="/admin/users" 
                    className="flex items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg"
                  >
                    <Users className="h-5 w-5 mr-3 text-purple-600" />
                    <span>Ver Progreso de Usuarios</span>
                  </Link>
                  
                  <Link 
                    to="/admin/stats" 
                    className="flex items-center p-4 bg-amber-50 hover:bg-amber-100 rounded-lg"
                  >
                    <BarChart className="h-5 w-5 mr-3 text-amber-600" />
                    <span>Ver Estadísticas</span>
                  </Link>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Instrucciones</CardTitle>
                </CardHeader>
                <CardContent className="prose">
                  <p>Bienvenido al panel de administración de SagrApp. Desde aquí podrás:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Crear y gestionar cursos bíblicos</li>
                    <li>Añadir lecciones con contenido educativo</li>
                    <li>Crear ejercicios interactivos de diferentes tipos</li>
                    <li>Configurar decisiones personales para los usuarios</li>
                    <li>Ver el progreso de los usuarios en la plataforma</li>
                    <li>Analizar estadísticas de uso y participación</li>
                  </ul>
                  <p className="mt-4">Utiliza las opciones del menú para navegar por las diferentes secciones.</p>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
