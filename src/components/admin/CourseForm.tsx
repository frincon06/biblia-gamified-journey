
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Course } from "@/types";

interface CourseFormProps {
  onAddCourse: (course: Omit<Course, 'id' | 'lessonsCount' | 'isActive' | 'order'>) => void;
  onCancel: () => void;
}

const CourseForm = ({ onAddCourse, onCancel }: CourseFormProps) => {
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    coverImage: ""
  });

  const handleAddCourse = () => {
    if (!newCourse.title || !newCourse.description) {
      toast({
        title: "Campos requeridos",
        description: "El título y la descripción son obligatorios",
        variant: "destructive"
      });
      return;
    }

    onAddCourse(newCourse);
    setNewCourse({ title: "", description: "", coverImage: "" });
  };

  return (
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
          <div className="flex gap-2">
            <Button onClick={handleAddCourse} className="flex-1">
              Crear Curso
            </Button>
            <Button onClick={onCancel} variant="outline" className="flex-1">
              Cancelar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseForm;
