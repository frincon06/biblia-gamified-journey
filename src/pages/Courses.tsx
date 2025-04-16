
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CourseCard } from "@/components/CourseCard";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Course } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

const Courses = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // In a real app, you would fetch courses from your database
        // For now, let's simulate that we're getting courses from local storage
        const savedCourses = localStorage.getItem('adminCourses');
        
        if (savedCourses) {
          const parsedCourses = JSON.parse(savedCourses);
          // Filter only active courses
          const activeCourses = parsedCourses.filter((course: Course) => course.isActive);
          setCourses(activeCourses);
        } else {
          // Fallback to empty array if no courses are found
          setCourses([]);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los cursos",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
    
    // Listen for changes in localStorage (when admin creates/edits courses)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'adminCourses') {
        fetchCourses();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  // Filtrar cursos según el término de búsqueda
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Para cada curso, calcular cuántas lecciones ha completado el usuario
  const coursesWithProgress = filteredCourses.map(course => {
    // En datos reales, esto se haría mediante una consulta a la base de datos
    // Aquí simulamos que el usuario ha completado algunas lecciones
    const completedCount = 0;
    
    return {
      ...course,
      completedCount
    };
  });
  
  return (
    <div className="container max-w-4xl mx-auto px-4 pt-16 pb-20 md:pt-24 md:pb-10 animate-fade-in">
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Cursos Bíblicos</h1>
        <p className="text-muted-foreground">Explora y aprende con nuestros cursos</p>
      </header>
      
      {/* Búsqueda */}
      <div className="relative mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input 
          type="text"
          placeholder="Buscar cursos..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Lista de cursos */}
      <div className="space-y-4">
        {loading ? (
          // Skeleton loader while courses are loading
          Array(3).fill(0).map((_, index) => (
            <div key={index} className="animate-pulse">
              <Skeleton className="h-32 w-full rounded-lg mb-4" />
            </div>
          ))
        ) : coursesWithProgress.length > 0 ? (
          coursesWithProgress.map((course, index) => (
            <div key={course.id} className="animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CourseCard
                id={course.id}
                title={course.title}
                description={course.description}
                lessonsCount={course.lessonsCount}
                completedCount={course.completedCount}
                image={course.coverImage}
              />
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-card/50 rounded-lg border border-border animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Info className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-lg font-semibold">No se encontraron cursos</p>
            <p className="text-muted-foreground mt-2">
              {searchTerm 
                ? "No hay cursos que coincidan con tu búsqueda." 
                : "Actualmente no hay cursos disponibles."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
