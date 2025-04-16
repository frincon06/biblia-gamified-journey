
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Course } from "@/types";

interface CourseListProps {
  courses: Course[];
  onToggleCourseStatus: (courseId: string) => void;
  onEditCourse: (courseId: string) => void;
  onSaveEdit: (courseId: string) => void;
  onDeleteCourse: (courseId: string) => void;
  editingCourse: string | null;
  editForm: {
    title: string;
    description: string;
    coverImage: string;
  };
  setEditForm: React.Dispatch<React.SetStateAction<{
    title: string;
    description: string;
    coverImage: string;
  }>>;
}

const CourseList = ({
  courses,
  onToggleCourseStatus,
  onEditCourse,
  onSaveEdit,
  onDeleteCourse,
  editingCourse,
  editForm,
  setEditForm
}: CourseListProps) => {
  const navigate = useNavigate();

  const handleViewLessons = (courseId: string) => {
    navigate(`/admin/courses/${courseId}/lessons`);
  };

  return (
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
                  onCheckedChange={() => onToggleCourseStatus(course.id)}
                  id={`active-${course.id}`}
                />
                <Label htmlFor={`active-${course.id}`} className="text-sm">
                  {course.isActive ? 'Activo' : 'Inactivo'}
                </Label>
              </div>
            </TableCell>
            <TableCell className="text-right flex justify-end gap-2">
              {editingCourse === course.id ? (
                <Button onClick={() => onSaveEdit(course.id)} size="sm">
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
                  <Button onClick={() => onEditCourse(course.id)} size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => onDeleteCourse(course.id)} size="sm" variant="destructive">
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
  );
};

export default CourseList;
