
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CourseCard } from "@/components/CourseCard";
import { mockCourses, mockUser } from "@/data/mock-data";

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filtrar cursos según el término de búsqueda
  const filteredCourses = mockCourses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Para cada curso, calcular cuántas lecciones ha completado el usuario
  const coursesWithProgress = filteredCourses.map(course => {
    // En datos reales, esto se haría mediante una consulta a la base de datos
    // Aquí simulamos que el usuario ha completado algunas lecciones
    const completedCount = course.id === "course1" ? 4 : 
                           course.id === "course2" ? 2 : 0;
    
    return {
      ...course,
      completedCount
    };
  });
  
  return (
    <div className="container max-w-md mx-auto px-4 pt-6 pb-20">
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Cursos Bíblicos</h1>
        <p className="text-sagr-gray-600">Explora y aprende con nuestros cursos</p>
      </header>
      
      {/* Búsqueda */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sagr-gray-400" />
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
        {coursesWithProgress.length > 0 ? (
          coursesWithProgress.map(course => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              description={course.description}
              lessonsCount={course.lessonsCount}
              completedCount={course.completedCount}
              image={course.coverImage}
            />
          ))
        ) : (
          <div className="text-center py-6 text-sagr-gray-500">
            No se encontraron cursos que coincidan con tu búsqueda.
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
