
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  ArrowLeft,
  ArrowRight,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Course } from "@/types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AdminCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    coverImage: ""
  });
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

  const handleAddCourse = () => {
    if (!newCourse.title || !newCourse.description) {
      toast({
        title: "Campos requeridos",
        description: "El título y la descripción son obligatorios",
        variant: "destructive"
      });
      return;
    }

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
    setNewCourse({ title: "", description: "", coverImage: "" });
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

  const handleViewLessons = (courseId: string) => {
    navigate(`/admin/courses/${courseId}/lessons`);
  };

  return (
    <div className="container p-6 animate-fade-in">
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
        <Card className="mb-6 animate-fade-in">
          <CardHeader>
            <CardTitle>Crear Nuevo Curso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                  Título
                </label>
                <Input
                  id="title"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  placeholder="Título del curso"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Descripción
                </label>
                <Input
                  id="description"
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  placeholder="Descripción del curso"
                />
              </div>
              <div>
                <label htmlFor="coverImage" className="block text-sm font-medium mb-1">
                  URL de Imagen (opcional)
                </label>
                <Input
                  id="coverImage"
                  value={newCourse.coverImage}
                  onChange={(e) => setNewCourse({ ...newCourse, coverImage: e.target.value })}
                  placeholder="URL de la imagen de portada"
                />
              </div>
              <Button onClick={handleAddCourse} className="w-full">
                Crear Curso
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Lecciones</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id} className={!course.isActive ? 'opacity-60' : ''}>
                  <TableCell className="font-medium">
                    {editingCourse === course.id ? (
                      <Input
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      />
                    ) : (
                      course.title
                    )}
                  </TableCell>
                  <TableCell>
                    {editingCourse === course.id ? (
                      <Input
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      />
                    ) : (
                      <div className="max-w-xs truncate">{course.description}</div>
                    )}
                  </TableCell>
                  <TableCell>{course.lessonsCount || 0}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={course.isActive} 
                        onCheckedChange={() => handleToggleCourseStatus(course.id)}
                        id={`active-${course.id}`}
                      />
                      <Label htmlFor={`active-${course.id}`} className="text-sm">
                        {course.isActive ? 'Activo' : 'Inactivo'}
                      </Label>
                    </div>
                  </TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    {editingCourse === course.id ? (
                      <Button onClick={() => handleSaveEdit(course.id)} size="sm">
                        Guardar
                      </Button>
                    ) : (
                      <>
                        <Button 
                          onClick={() => handleViewLessons(course.id)} 
                          size="sm" 
                          className="bg-primary hover:bg-primary/90"
                        >
                          <ArrowRight className="h-4 w-4 mr-1" />
                          Lecciones
                        </Button>
                        <Button onClick={() => handleEditCourse(course.id)} size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => confirmDeleteCourse(course.id)} size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {courses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    No hay cursos disponibles. Crea el primero haciendo clic en "Nuevo Curso".
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el curso permanentemente. No podrás recuperarlo después.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCourse} className="bg-destructive text-destructive-foreground">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminCourses;
