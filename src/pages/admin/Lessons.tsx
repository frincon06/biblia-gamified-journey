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
  BookOpen,
  Save
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import AdminNavBar from "@/components/admin/AdminNavBar";

const AdminLessons = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(mockCourses.find(c => c.id === courseId));
  const [lessons, setLessons] = useState<any[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [lessonData, setLessonData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [newLesson, setNewLesson] = useState({
    title: "",
    summary: "",
    mainText: "",
    scripture: "",
    scriptureReference: "",
    type: "normal",
    position: 0 // Position for new lesson
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
    const courseLessons = mockLessons.filter(lesson => lesson.courseId === courseId);
    setLessons(courseLessons);
    
    if (courseLessons.length > 0 && !selectedLesson) {
      setSelectedLesson(courseLessons[0].id);
      setLessonData(courseLessons[0]);
    }
  }, [courseId, selectedLesson]);

  const selectLesson = (lessonId: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson) {
      setSelectedLesson(lessonId);
      setLessonData(lesson);
      setActiveTab("overview");
      setEditForm({
        title: lesson.title,
        summary: lesson.summary || "",
        mainText: lesson.mainText || "",
        scripture: lesson.scripture || "",
        scriptureReference: lesson.scriptureReference || "",
        type: lesson.type || "normal"
      });
    }
  };

  const handleAddLesson = () => {
    if (!newLesson.title || !newLesson.summary || !newLesson.mainText) {
      toast({
        title: "Campos requeridos",
        description: "El título, resumen y texto principal son obligatorios",
        variant: "destructive"
      });
      return;
    }

    const existingLessons = [...lessons];
    const position = Math.min(Math.max(newLesson.position, 0), existingLessons.length);
    
    existingLessons.forEach(lesson => {
      if (lesson.orderIndex >= position) {
        lesson.orderIndex += 1;
      }
    });

    const newLessonData = {
      id: `lesson-${Date.now()}`,
      courseId: courseId,
      title: newLesson.title,
      summary: newLesson.summary,
      mainText: newLesson.mainText,
      scripture: newLesson.scripture,
      scriptureReference: newLesson.scriptureReference,
      type: newLesson.type,
      orderIndex: position,
      exercises: []
    };

    const updatedLessons = [...existingLessons, newLessonData];
    
    setLessons(updatedLessons);
    setNewLesson({
      title: "",
      summary: "",
      mainText: "",
      scripture: "",
      scriptureReference: "",
      type: "normal",
      position: updatedLessons.length
    });
    setIsAddingLesson(false);
    
    setSelectedLesson(newLessonData.id);
    setLessonData(newLessonData);

    toast({
      title: "Lección creada",
      description: "La lección ha sido añadida exitosamente"
    });
  };

  const updateLessonContent = () => {
    if (!selectedLesson) return;

    if (!editForm.title || !editForm.summary || !editForm.mainText) {
      toast({
        title: "Campos requeridos",
        description: "El título, resumen y texto principal son obligatorios",
        variant: "destructive"
      });
      return;
    }

    const updatedLessons = lessons.map(lesson => {
      if (lesson.id === selectedLesson) {
        const updatedLesson = {
          ...lesson,
          title: editForm.title,
          summary: editForm.summary,
          mainText: editForm.mainText,
          scripture: editForm.scripture,
          scriptureReference: editForm.scriptureReference,
          type: editForm.type
        };
        setLessonData(updatedLesson);
        return updatedLesson;
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
    const updatedLessons = lessons.filter(lesson => lesson.id !== lessonId);
    
    const reorderedLessons = updatedLessons.map((lesson, index) => ({
      ...lesson,
      orderIndex: index
    }));
    
    setLessons(reorderedLessons);
    
    if (lessonId === selectedLesson) {
      if (reorderedLessons.length > 0) {
        setSelectedLesson(reorderedLessons[0].id);
        setLessonData(reorderedLessons[0]);
      } else {
        setSelectedLesson(null);
        setLessonData(null);
      }
    }

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

    const updatedLessons = newLessons.map((lesson, index) => ({
      ...lesson,
      orderIndex: index
    }));

    setLessons(updatedLessons);
  };

  const handleViewExercises = (lessonId: string) => {
    navigate(`/admin/lessons/${lessonId}/exercises`);
  };

  const renderLessonsList = () => (
    <div className="w-1/4 pr-6 border-r">
      <div className="mb-4 flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Lecciones del Curso</h2>
        <Button 
          onClick={() => {
            setIsAddingLesson(true);
            setSelectedLesson(null);
            setLessonData(null);
          }} 
          size="sm"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Nueva Lección
        </Button>
      </div>

      <div className="space-y-2 mt-4">
        {lessons
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((lesson, index) => (
            <div 
              key={lesson.id} 
              className={cn(
                "p-3 border rounded-md cursor-pointer transition-colors",
                selectedLesson === lesson.id ? "bg-blue-50 border-blue-300" : "hover:bg-gray-50"
              )}
              onClick={() => selectLesson(lesson.id)}
            >
              <div className="flex justify-between items-center">
                <div className="font-medium">{index + 1}. {lesson.title}</div>
                <div className="flex">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveLesson(lesson.id, 'up');
                    }}
                    disabled={index === 0}
                    className="h-6 w-6"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveLesson(lesson.id, 'down');
                    }}
                    disabled={index === lessons.length - 1}
                    className="h-6 w-6"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="text-sm text-gray-500 truncate">{lesson.summary}</div>
              <div className="flex gap-1 mt-1">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {lesson.type === "challenge" ? "Desafío" : "Normal"}
                </span>
              </div>
            </div>
          ))}
        {lessons.length === 0 && !isAddingLesson && (
          <div className="text-center py-6 text-gray-500">
            No hay lecciones para este curso. Crea una nueva lección.
          </div>
        )}
      </div>
    </div>
  );

  const renderCreateLessonForm = () => (
    <Card className="w-3/4">
      <CardHeader>
        <CardTitle>Crear Nueva Lección</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                Posición en el curso
              </label>
              <div className="flex items-center gap-2">
                <Input
                  id="position"
                  type="number"
                  min={1}
                  max={lessons.length + 1}
                  value={newLesson.position + 1}
                  onChange={(e) => setNewLesson({ ...newLesson, position: Math.max(0, parseInt(e.target.value) - 1 || 0) })}
                  className="w-20"
                />
                <span className="text-sm text-gray-500">de {lessons.length + 1}</span>
              </div>
            </div>
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
              rows={6}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="scripture" className="block text-sm font-medium text-gray-700 mb-1">
                Versículo (opcional)
              </label>
              <Textarea
                id="scripture"
                value={newLesson.scripture}
                onChange={(e) => setNewLesson({ ...newLesson, scripture: e.target.value })}
                placeholder="Pasaje bíblico relacionado"
                rows={3}
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
              <div className="mt-4">
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
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => {
              setIsAddingLesson(false);
              if (lessons.length > 0) {
                selectLesson(lessons[0].id);
              }
            }}>
              Cancelar
            </Button>
            <Button onClick={handleAddLesson}>
              Crear Lección
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderLessonDetail = () => {
    if (!lessonData) return null;

    return (
      <div className="w-3/4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 grid w-full grid-cols-3">
            <TabsTrigger value="overview">Información General</TabsTrigger>
            <TabsTrigger value="content">Contenido Pedagógico</TabsTrigger>
            <TabsTrigger value="exercises">Ejercicios ({lessonData.exercises?.length || 0})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-0">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Información de la lección</CardTitle>
                  <Button onClick={updateLessonContent}>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Cambios
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-1">
                      Título
                    </label>
                    <Input
                      id="edit-title"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-summary" className="block text-sm font-medium text-gray-700 mb-1">
                      Resumen
                    </label>
                    <Input
                      id="edit-summary"
                      value={editForm.summary}
                      onChange={(e) => setEditForm({ ...editForm, summary: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-type" className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Lección
                    </label>
                    <select
                      id="edit-type"
                      value={editForm.type}
                      onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                      className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3"
                    >
                      <option value="normal">Normal</option>
                      <option value="challenge">Desafío</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="content" className="mt-0">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Contenido de la lección</CardTitle>
                  <Button onClick={updateLessonContent}>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Cambios
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="edit-mainText" className="block text-sm font-medium text-gray-700 mb-1">
                      Texto Principal
                    </label>
                    <Textarea
                      id="edit-mainText"
                      value={editForm.mainText}
                      onChange={(e) => setEditForm({ ...editForm, mainText: e.target.value })}
                      rows={8}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="edit-scripture" className="block text-sm font-medium text-gray-700 mb-1">
                        Versículo (opcional)
                      </label>
                      <Textarea
                        id="edit-scripture"
                        value={editForm.scripture}
                        onChange={(e) => setEditForm({ ...editForm, scripture: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div>
                      <label htmlFor="edit-scriptureReference" className="block text-sm font-medium text-gray-700 mb-1">
                        Referencia Bíblica (opcional)
                      </label>
                      <Input
                        id="edit-scriptureReference"
                        value={editForm.scriptureReference}
                        onChange={(e) => setEditForm({ ...editForm, scriptureReference: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="exercises" className="mt-0">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Ejercicios y Actividades</CardTitle>
                  <Button onClick={() => handleViewExercises(lessonData.id)}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Gestionar Ejercicios
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {lessonData.exercises && lessonData.exercises.length > 0 ? (
                  <div className="space-y-4">
                    {lessonData.exercises.map((exercise: any, index: number) => (
                      <div key={exercise.id} className="border p-3 rounded-md">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
                              {index + 1}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                              {exercise.type === "multipleChoice" && "Selección múltiple"}
                              {exercise.type === "trueFalse" && "Verdadero o falso"}
                              {exercise.type === "fillBlank" && "Completar"}
                              {exercise.type === "reflection" && "Reflexión"}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {exercise.xpReward || 0} XP
                          </div>
                        </div>
                        <div className="mt-2">
                          {exercise.question && <div className="font-medium">{exercise.question}</div>}
                          {exercise.statement && <div className="font-medium">{exercise.statement}</div>}
                          {exercise.beforeText && (
                            <div>
                              {exercise.beforeText} <span className="bg-yellow-100 px-1">___</span> {exercise.afterText}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    No hay ejercicios para esta lección. Haz clic en "Gestionar Ejercicios" para añadir nuevos.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/admin/courses`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Cursos
          </Button>
          <Button 
            variant="destructive"
            onClick={() => handleDeleteLesson(lessonData.id)}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Eliminar Lección
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <AdminNavBar />
      <div className="container p-6">
        <div className="mb-6">
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

        <div className="flex gap-6">
          {renderLessonsList()}
          {isAddingLesson ? renderCreateLessonForm() : renderLessonDetail()}
        </div>
      </div>
    </div>
  );
};

export default AdminLessons;
