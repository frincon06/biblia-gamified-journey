
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  ArrowUp, 
  ArrowDown,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { mockLessons, mockCourses } from "@/data/mock-data";
import { Lesson } from "@/types";

const AdminLessons = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(mockCourses.find(c => c.id === courseId));
  const [lessons, setLessons] = useState<any[]>([]);
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [newLesson, setNewLesson] = useState({
    title: "",
    summary: "",
    mainText: "",
    scripture: "",
    scriptureReference: "",
    type: "normal"
  });
  const [editingLesson, setEditingLesson] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    summary: "",
    mainText: "",
    scripture: "",
    scriptureReference: "",
    type: "normal"
  });

  useEffect(() => {
    // En una aplicación real, cargaríamos las lecciones del curso desde la API
    // Aquí simulamos con datos mock
    setLessons(mockLessons.filter(lesson => lesson.courseId === courseId));
  }, [courseId]);

  const handleAddLesson = () => {
    if (!newLesson.title || !newLesson.summary || !newLesson.mainText) {
      toast({
        title: "Campos requeridos",
        description: "El título, resumen y texto principal son obligatorios",
        variant: "destructive"
      });
      return;
    }

    // En una aplicación real, esto sería una llamada a la API
    const newLessonData = {
      id: `lesson-${Date.now()}`,
      courseId: courseId,
      title: newLesson.title,
      summary: newLesson.summary,
      mainText: newLesson.mainText,
      scripture: newLesson.scripture,
      scriptureReference: newLesson.scriptureReference,
      type: newLesson.type,
      orderIndex: lessons.length
    };

    setLessons([...lessons, newLessonData]);
    setNewLesson({
      title: "",
      summary: "",
      mainText: "",
      scripture: "",
      scriptureReference: "",
      type: "normal"
    });
    setIsAddingLesson(false);

    toast({
      title: "Lección creada",
      description: "La lección ha sido añadida exitosamente"
    });
  };

  const handleEditLesson = (lessonId: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) return;

    setEditingLesson(lessonId);
    setEditForm({
      title: lesson.title,
      summary: lesson.summary || "",
      mainText: lesson.mainText || "",
      scripture: lesson.scripture || "",
      scriptureReference: lesson.scriptureReference || "",
      type: lesson.type || "normal"
    });
  };

  const handleSaveEdit = (lessonId: string) => {
    if (!editForm.title || !editForm.summary || !editForm.mainText) {
      toast({
        title: "Campos requeridos",
        description: "El título, resumen y texto principal son obligatorios",
        variant: "destructive"
      });
      return;
    }

    // En una aplicación real, esto sería una llamada a la API
    const updatedLessons = lessons.map(lesson => {
      if (lesson.id === lessonId) {
        return {
          ...lesson,
          title: editForm.title,
          summary: editForm.summary,
          mainText: editForm.mainText,
          scripture: editForm.scripture,
          scriptureReference: editForm.scriptureReference,
          type: editForm.type
        };
      }
      return lesson;
    });

    setLessons(updatedLessons);
    setEditingLesson(null);

    toast({
      title: "Lección actualizada",
      description: "La lección ha sido modificada exitosamente"
    });
  };

  const handleDeleteLesson = (lessonId: string) => {
    // En una aplicación real, deberíamos mostrar una confirmación
    const updatedLessons = lessons.filter(lesson => lesson.id !== lessonId);
    setLessons(updatedLessons);

    toast({
      title: "Lección eliminada",
      description: "La lección ha sido eliminada exitosamente"
    });
  };

  const handleMoveLesson = (lessonId: string, direction: 'up' | 'down') => {
    const currentIndex = lessons.findIndex(lesson => lesson.id === lessonId);
    if (
      (direction === 'up' && currentIndex === 0) || 
      (direction === 'down' && currentIndex === lessons.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const newLessons = [...lessons];
    const [movedLesson] = newLessons.splice(currentIndex, 1);
    newLessons.splice(newIndex, 0, movedLesson);

    // Actualizar orderIndex
    const updatedLessons = newLessons.map((lesson, index) => ({
      ...lesson,
      orderIndex: index
    }));

    setLessons(updatedLessons);
  };

  const handleViewExercises = (lessonId: string) => {
    navigate(`/admin/lessons/${lessonId}/exercises`);
  };

  return (
    <div className="container p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link 
            to="/admin/courses" 
            className="flex items-center text-sm text-gray-600 mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver a cursos
          </Link>
          <h1 className="text-2xl font-bold">
            Lecciones del curso: {course?.title}
          </h1>
        </div>
        <Button onClick={() => setIsAddingLesson(!isAddingLesson)}>
          {isAddingLesson ? "Cancelar" : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nueva Lección
            </>
          )}
        </Button>
      </div>

      {isAddingLesson && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Crear Nueva Lección</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <Input
                  id="title"
                  value={newLesson.title}
                  onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                  placeholder="Título de la lección"
                />
              </div>
              <div>
                <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
                  Resumen
                </label>
                <Input
                  id="summary"
                  value={newLesson.summary}
                  onChange={(e) => setNewLesson({ ...newLesson, summary: e.target.value })}
                  placeholder="Breve resumen de la lección"
                />
              </div>
              <div>
                <label htmlFor="mainText" className="block text-sm font-medium text-gray-700 mb-1">
                  Texto Principal
                </label>
                <Textarea
                  id="mainText"
                  value={newLesson.mainText}
                  onChange={(e) => setNewLesson({ ...newLesson, mainText: e.target.value })}
                  placeholder="Contenido principal de la lección"
                  rows={4}
                />
              </div>
              <div>
                <label htmlFor="scripture" className="block text-sm font-medium text-gray-700 mb-1">
                  Versículo (opcional)
                </label>
                <Textarea
                  id="scripture"
                  value={newLesson.scripture}
                  onChange={(e) => setNewLesson({ ...newLesson, scripture: e.target.value })}
                  placeholder="Pasaje bíblico relacionado"
                  rows={2}
                />
              </div>
              <div>
                <label htmlFor="scriptureReference" className="block text-sm font-medium text-gray-700 mb-1">
                  Referencia Bíblica (opcional)
                </label>
                <Input
                  id="scriptureReference"
                  value={newLesson.scriptureReference}
                  onChange={(e) => setNewLesson({ ...newLesson, scriptureReference: e.target.value })}
                  placeholder="Ej. Juan 3:16"
                />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Lección
                </label>
                <select
                  id="type"
                  value={newLesson.type}
                  onChange={(e) => setNewLesson({ ...newLesson, type: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3"
                >
                  <option value="normal">Normal</option>
                  <option value="challenge">Desafío</option>
                </select>
              </div>
              <Button onClick={handleAddLesson} className="w-full">
                Crear Lección
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Orden</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Resumen</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lessons.sort((a, b) => a.orderIndex - b.orderIndex).map((lesson) => (
                <TableRow key={lesson.id}>
                  <TableCell className="w-24">
                    <div className="flex items-center space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleMoveLesson(lesson.id, 'up')}
                        disabled={lesson.orderIndex === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <span>{lesson.orderIndex + 1}</span>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleMoveLesson(lesson.id, 'down')}
                        disabled={lesson.orderIndex === lessons.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {editingLesson === lesson.id ? (
                      <Input
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      />
                    ) : (
                      lesson.title
                    )}
                  </TableCell>
                  <TableCell>
                    {editingLesson === lesson.id ? (
                      <select
                        value={editForm.type}
                        onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                        className="block w-full rounded-md border-gray-300 shadow-sm py-1 px-2"
                      >
                        <option value="normal">Normal</option>
                        <option value="challenge">Desafío</option>
                      </select>
                    ) : (
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {lesson.type === "challenge" ? "Desafío" : "Normal"}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingLesson === lesson.id ? (
                      <Input
                        value={editForm.summary}
                        onChange={(e) => setEditForm({ ...editForm, summary: e.target.value })}
                      />
                    ) : (
                      <div className="max-w-xs truncate">{lesson.summary}</div>
                    )}
                  </TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    {editingLesson === lesson.id ? (
                      <Button onClick={() => handleSaveEdit(lesson.id)} size="sm">
                        Guardar
                      </Button>
                    ) : (
                      <>
                        <Button onClick={() => handleViewExercises(lesson.id)} size="sm" variant="outline">
                          <BookOpen className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => handleEditLesson(lesson.id)} size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => handleDeleteLesson(lesson.id)} size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLessons;
