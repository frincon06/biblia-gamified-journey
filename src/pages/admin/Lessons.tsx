
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
import { Lesson } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import AdminNavBar from "@/components/admin/AdminNavBar";
import { supabase } from "@/integrations/supabase/client";

const AdminLessons = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<any>(null);
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
      fetchLessons();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    if (!courseId) return;
    
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();
      
      if (error) throw error;
      
      setCourse(data);
    } catch (error) {
      console.error("Error loading course:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar el curso",
        variant: "destructive"
      });
    }
  };

  const fetchLessons = async () => {
    if (!courseId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      
      setLessons(data || []);
      
      // Select the first lesson if there is one
      if (data && data.length > 0 && !selectedLesson) {
        setSelectedLesson(data[0].id);
        setLessonData(data[0]);
        setEditForm({
          title: data[0].title,
          summary: data[0].summary || "",
          mainText: data[0].main_text || "",
          scripture: data[0].scripture || "",
          scriptureReference: data[0].scripture_reference || "",
          type: data[0].type || "normal"
        });
      }
    } catch (error) {
      console.error("Error loading lessons:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las lecciones",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectLesson = (lessonId: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson) {
      setSelectedLesson(lessonId);
      setLessonData(lesson);
      setActiveTab("overview");
      setEditForm({
        title: lesson.title,
        summary: lesson.summary || "",
        mainText: lesson.main_text || "",
        scripture: lesson.scripture || "",
        scriptureReference: lesson.scripture_reference || "",
        type: lesson.type || "normal"
      });
    }
  };

  const handleAddLesson = async () => {
    if (!newLesson.title || !newLesson.summary || !newLesson.mainText) {
      toast({
        title: "Campos requeridos",
        description: "El título, resumen y texto principal son obligatorios",
        variant: "destructive"
      });
      return;
    }

    try {
      // Get the position based on user input
      const position = Math.min(Math.max(newLesson.position, 0), lessons.length);
      
      // Insert new lesson into database with the required description field
      const { data, error } = await supabase
        .from('lessons')
        .insert({
          course_id: courseId,
          title: newLesson.title,
          summary: newLesson.summary,
          description: newLesson.summary, // Use summary as description to satisfy the required field
          main_text: newLesson.mainText,
          scripture: newLesson.scripture || null,
          scripture_reference: newLesson.scriptureReference || null,
          type: newLesson.type,
          order_index: position
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Update order_index for other lessons if needed
      if (position < lessons.length) {
        // Get lessons that need their order_index updated
        const lessonsToUpdate = lessons
          .filter(lesson => lesson.order_index >= position)
          .map(lesson => ({
            id: lesson.id,
            order_index: lesson.order_index + 1
          }));
        
        // Update each lesson's order_index
        for (const lesson of lessonsToUpdate) {
          await supabase
            .from('lessons')
            .update({ order_index: lesson.order_index })
            .eq('id', lesson.id);
        }
      }
      
      // Update the lessons count in the course
      await supabase
        .from('courses')
        .update({ lessons_count: lessons.length + 1 })
        .eq('id', courseId);
      
      // Refresh lesson list
      await fetchLessons();
      
      // Clear form
      setNewLesson({
        title: "",
        summary: "",
        mainText: "",
        scripture: "",
        scriptureReference: "",
        type: "normal",
        position: lessons.length + 1
      });
      
      setIsAddingLesson(false);
      
      // Select the newly created lesson
      setSelectedLesson(data.id);
      setLessonData(data);
      
      toast({
        title: "Lección creada",
        description: "La lección ha sido añadida exitosamente"
      });
    } catch (error) {
      console.error("Error creating lesson:", error);
      toast({
        title: "Error",
        description: "No se pudo crear la lección",
        variant: "destructive"
      });
    }
  };

  const updateLessonContent = async () => {
    if (!selectedLesson) return;

    if (!editForm.title || !editForm.summary || !editForm.mainText) {
      toast({
        title: "Campos requeridos",
        description: "El título, resumen y texto principal son obligatorios",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('lessons')
        .update({
          title: editForm.title,
          summary: editForm.summary,
          main_text: editForm.mainText,
          scripture: editForm.scripture || null,
          scripture_reference: editForm.scriptureReference || null,
          type: editForm.type
        })
        .eq('id', selectedLesson);
      
      if (error) throw error;
      
      // Update local state
      const updatedLessons = lessons.map(lesson => {
        if (lesson.id === selectedLesson) {
          const updatedLesson = {
            ...lesson,
            title: editForm.title,
            summary: editForm.summary,
            main_text: editForm.mainText,
            scripture: editForm.scripture || null,
            scripture_reference: editForm.scriptureReference || null,
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
    } catch (error) {
      console.error("Error updating lesson:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la lección",
        variant: "destructive"
      });
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    try {
      // Delete the lesson
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonId);
      
      if (error) throw error;
      
      // Get remaining lessons to update order
      const remainingLessons = lessons.filter(l => l.id !== lessonId);
      
      // Update order_index for remaining lessons
      for (let i = 0; i < remainingLessons.length; i++) {
        const lesson = remainingLessons[i];
        if (lesson.order_index !== i) {
          await supabase
            .from('lessons')
            .update({ order_index: i })
            .eq('id', lesson.id);
        }
      }
      
      // Update course lessons count
      await supabase
        .from('courses')
        .update({ lessons_count: remainingLessons.length })
        .eq('id', courseId);
      
      // Refresh lessons
      await fetchLessons();
      
      // Clear selected lesson if it was deleted
      if (lessonId === selectedLesson) {
        if (remainingLessons.length > 0) {
          setSelectedLesson(remainingLessons[0].id);
          setLessonData(remainingLessons[0]);
        } else {
          setSelectedLesson(null);
          setLessonData(null);
        }
      }

      toast({
        title: "Lección eliminada",
        description: "La lección ha sido eliminada exitosamente"
      });
    } catch (error) {
      console.error("Error deleting lesson:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la lección",
        variant: "destructive"
      });
    }
  };

  const handleMoveLesson = async (lessonId: string, direction: 'up' | 'down') => {
    const currentIndex = lessons.findIndex(lesson => lesson.id === lessonId);
    if (
      (direction === 'up' && currentIndex === 0) || 
      (direction === 'down' && currentIndex === lessons.length - 1)
    ) {
      return;
    }

    try {
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      const lessonToMove = lessons[currentIndex];
      const otherLesson = lessons[newIndex];
      
      // Swap the order_index
      await supabase
        .from('lessons')
        .update({ order_index: newIndex })
        .eq('id', lessonId);
      
      await supabase
        .from('lessons')
        .update({ order_index: currentIndex })
        .eq('id', otherLesson.id);
      
      // Refresh lessons after the move
      await fetchLessons();
    } catch (error) {
      console.error("Error moving lesson:", error);
      toast({
        title: "Error",
        description: "No se pudo cambiar el orden de la lección",
        variant: "destructive"
      });
    }
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
        {isLoading ? (
          <div className="py-8 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
          </div>
        ) : (
          <>
            {lessons
              .sort((a, b) => a.order_index - b.order_index)
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
          </>
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
