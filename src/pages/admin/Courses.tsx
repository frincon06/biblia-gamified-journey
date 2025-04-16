
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

  // Load courses from localStorage on component mount
  useEffect(() => {
    const savedCourses = localStorage.getItem('adminCourses');
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    }
  }, []);

  // Save courses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('adminCourses', JSON.stringify(courses));
  }, [courses]);

  const handleAddCourse = (newCourse: Omit<Course, 'id' | 'lessonsCount' | 'isActive' | 'order'>) => {
    const newCourseData: Course = {
      id: `course-${Date.now()}`,
      title: newCourse.title,
      description: newCourse.description,
      coverImage: newCourse.coverImage || "https://via.placeholder.com/300",
      lessonsCount: 0,
      isActive: true,
      order: courses.length // Assign next order number
    };

    setCourses([...courses, newCourseData]);
    setIsAddingCourse(false);

    toast({
      title: "Curso creado",
      description: "El curso ha sido añadido exitosamente"
    });
    
    // Trigger a storage event to notify other tabs/windows
    window.dispatchEvent(new Event('storage'));
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

  const handleSaveEdit = (courseId: string) => {
    if (!editForm.title || !editForm.description) {
      toast({
        title: "Campos requeridos",
        description: "El título y la descripción son obligatorios",
        variant: "destructive"
      });
      return;
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
    
    // Trigger a storage event to notify other tabs/windows
    window.dispatchEvent(new Event('storage'));
  };

  const handleToggleCourseStatus = (courseId: string) => {
    const updatedCourses = courses.map(course => {
      if (course.id === courseId) {
        return {
          ...course,
          isActive: !course.isActive
        };
      }
      return course;
    });

    setCourses(updatedCourses);
    
    toast({
      title: "Estado actualizado",
      description: "El estado del curso ha sido actualizado"
    });
    
    // Trigger a storage event to notify other tabs/windows
    window.dispatchEvent(new Event('storage'));
  };

  const confirmDeleteCourse = (courseId: string) => {
    setCourseToDelete(courseId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCourse = () => {
    if (!courseToDelete) return;
    
    const updatedCourses = courses.filter(course => course.id !== courseToDelete);
    setCourses(updatedCourses);
    
    toast({
      title: "Curso eliminado",
      description: "El curso ha sido eliminado exitosamente"
    });
    
    setDeleteDialogOpen(false);
    setCourseToDelete(null);
    
    // Trigger a storage event to notify other tabs/windows
    window.dispatchEvent(new Event('storage'));
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
