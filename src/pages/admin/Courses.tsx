
import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Course } from "@/types";
import CourseForm from "@/components/admin/CourseForm";
import CourseList from "@/components/admin/CourseList";
import DeleteCourseDialog from "@/components/admin/DeleteCourseDialog";
import AdminNavBar from "@/components/admin/AdminNavBar";
import { supabase } from "@/integrations/supabase/client";

const AdminCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [editingCourse, setEditingCourse] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    coverImage: ""
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load courses from Supabase on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) {
        throw error;
      }

      if (data) {
        // Map database fields to our Course type
        const formattedCourses: Course[] = data.map(course => ({
          id: course.id,
          title: course.title,
          description: course.description,
          coverImage: course.cover_image || "https://via.placeholder.com/300",
          lessonsCount: course.lessons_count || 0,
          isActive: course.is_active || true,
          order: course.order_index
        }));
        
        setCourses(formattedCourses);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast({
        title: "Error al cargar cursos",
        description: "No se pudieron cargar los cursos",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCourse = async (newCourse: Omit<Course, 'id' | 'lessonsCount' | 'isActive' | 'order'>) => {
    try {
      // Calculate the next order index
      const nextOrderIndex = courses.length;

      // Insert the new course into Supabase
      const { data, error } = await supabase
        .from('courses')
        .insert({
          title: newCourse.title,
          description: newCourse.description,
          cover_image: newCourse.coverImage || "https://via.placeholder.com/300",
          is_active: true,
          lessons_count: 0,
          order_index: nextOrderIndex
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        const newCourseData: Course = {
          id: data.id,
          title: data.title,
          description: data.description,
          coverImage: data.cover_image || "https://via.placeholder.com/300",
          lessonsCount: data.lessons_count || 0,
          isActive: data.is_active || true,
          order: data.order_index
        };

        setCourses([...courses, newCourseData]);
        setIsAddingCourse(false);

        toast({
          title: "Curso creado",
          description: "El curso ha sido añadido exitosamente"
        });
      }
    } catch (error) {
      console.error("Error adding course:", error);
      toast({
        title: "Error al crear curso",
        description: "No se pudo crear el curso",
        variant: "destructive"
      });
    }
  };

  const handleEditCourse = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    setEditingCourse(courseId);
    setEditForm({
      title: course.title,
      description: course.description,
      coverImage: course.coverImage || ""
    });
  };

  const handleSaveEdit = async (courseId: string) => {
    if (!editForm.title || !editForm.description) {
      toast({
        title: "Campos requeridos",
        description: "El título y la descripción son obligatorios",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('courses')
        .update({
          title: editForm.title,
          description: editForm.description,
          cover_image: editForm.coverImage || null
        })
        .eq('id', courseId);

      if (error) {
        throw error;
      }

      const updatedCourses = courses.map(course => {
        if (course.id === courseId) {
          return {
            ...course,
            title: editForm.title,
            description: editForm.description,
            coverImage: editForm.coverImage || course.coverImage
          };
        }
        return course;
      });

      setCourses(updatedCourses);
      setEditingCourse(null);

      toast({
        title: "Curso actualizado",
        description: "El curso ha sido modificado exitosamente"
      });
      
    } catch (error) {
      console.error("Error updating course:", error);
      toast({
        title: "Error al actualizar curso",
        description: "No se pudo actualizar el curso",
        variant: "destructive"
      });
    }
  };

  const handleToggleCourseStatus = async (courseId: string) => {
    try {
      // Find the course to toggle
      const courseToToggle = courses.find(c => c.id === courseId);
      if (!courseToToggle) return;
      
      const newStatus = !courseToToggle.isActive;
      
      // Update in Supabase
      const { error } = await supabase
        .from('courses')
        .update({ is_active: newStatus })
        .eq('id', courseId);

      if (error) {
        throw error;
      }

      // Update local state
      const updatedCourses = courses.map(course => {
        if (course.id === courseId) {
          return {
            ...course,
            isActive: newStatus
          };
        }
        return course;
      });

      setCourses(updatedCourses);
      
      toast({
        title: "Estado actualizado",
        description: "El estado del curso ha sido actualizado"
      });
      
    } catch (error) {
      console.error("Error toggling course status:", error);
      toast({
        title: "Error al actualizar estado",
        description: "No se pudo actualizar el estado del curso",
        variant: "destructive"
      });
    }
  };

  const confirmDeleteCourse = (courseId: string) => {
    setCourseToDelete(courseId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;
    
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseToDelete);

      if (error) {
        throw error;
      }

      // Remove from local state
      const updatedCourses = courses.filter(course => course.id !== courseToDelete);
      
      // Update order_index for remaining courses
      for (let i = 0; i < updatedCourses.length; i++) {
        const course = updatedCourses[i];
        if (course.order !== i) {
          // Update order in Supabase
          await supabase
            .from('courses')
            .update({ order_index: i })
            .eq('id', course.id);
            
          // Update local state
          course.order = i;
        }
      }
      
      setCourses(updatedCourses);
      
      toast({
        title: "Curso eliminado",
        description: "El curso ha sido eliminado exitosamente"
      });
      
      setDeleteDialogOpen(false);
      setCourseToDelete(null);
      
    } catch (error) {
      console.error("Error deleting course:", error);
      toast({
        title: "Error al eliminar curso",
        description: "No se pudo eliminar el curso",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="animate-fade-in">
      <AdminNavBar />
      
      <div className="container p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Gestión de Cursos</h1>
            <p className="text-muted-foreground mt-1">
              Selecciona un curso para gestionar sus lecciones o crea uno nuevo
            </p>
          </div>
          <Button onClick={() => setIsAddingCourse(!isAddingCourse)} 
            className="transition-all duration-300 hover:scale-105">
            {isAddingCourse ? "Cancelar" : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nuevo Curso
              </>
            )}
          </Button>
        </div>

        {isAddingCourse && (
          <CourseForm 
            onAddCourse={handleAddCourse} 
            onCancel={() => setIsAddingCourse(false)} 
          />
        )}

        <Card className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="py-12 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-2">Cargando cursos...</p>
              </div>
            ) : (
              <CourseList 
                courses={courses}
                onToggleCourseStatus={handleToggleCourseStatus}
                onEditCourse={handleEditCourse}
                onSaveEdit={handleSaveEdit}
                onDeleteCourse={confirmDeleteCourse}
                editingCourse={editingCourse}
                editForm={editForm}
                setEditForm={setEditForm}
              />
            )}
          </CardContent>
        </Card>
        
        <DeleteCourseDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirmDelete={handleDeleteCourse}
        />
      </div>
    </div>
  );
};

export default AdminCourses;
