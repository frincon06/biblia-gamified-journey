import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PlusCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Lesson } from "@/types";
import AdminNavBar from "@/components/admin/AdminNavBar";
import { supabase } from "@/integrations/supabase/client";

const AdminLessons = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [newLesson, setNewLesson] = useState({
    title: "",
    summary: "",
    mainText: "",
    scripture: "",
    scriptureReference: "",
    type: "normal",
    position: lessons.length
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!courseId) {
      toast({
        title: "Error",
        description: "ID del curso no válido",
        variant: "destructive"
      });
      return;
    }
    fetchLessons();
  }, [courseId]);

  const fetchLessons = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (error) {
        throw error;
      }

      if (data) {
        const formattedLessons: Lesson[] = data.map(lesson => ({
          id: lesson.id,
          title: lesson.title,
          summary: lesson.summary,
          description: lesson.description,
          mainText: lesson.main_text,
          scripture: lesson.scripture || "",
          scriptureReference: lesson.scripture_reference || "",
          type: lesson.type || "normal",
          exercisesCount: 0,
          completed: false,
          order: lesson.order_index
        }));
        setLessons(formattedLessons);
      }
    } catch (error) {
      console.error("Error fetching lessons:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las lecciones",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle creating a new lesson
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
      setIsCreating(false);
      
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

      if (error) {
        console.error("Error adding lesson:", error);
        throw error;
      }

      if (data) {
        // Format lesson for React state
        const formattedLesson: Lesson = {
          id: data.id,
          title: data.title,
          summary: data.summary,
          description: data.description,
          mainText: data.main_text,
          scripture: data.scripture || "",
          scriptureReference: data.scripture_reference || "",
          type: data.type || "normal",
          exercisesCount: 0,
          completed: false,
          order: data.order_index
        };
        
        toast({
          title: "Lección creada",
          description: "La lección ha sido creada exitosamente"
        });
        
        // Update lessons list
        fetchLessons();
        
        // Reset form state
        setNewLesson({
          title: "",
          summary: "",
          mainText: "",
          scripture: "",
          scriptureReference: "",
          type: "normal",
          position: lessons.length  // Default to end of list
        });
      }
    } catch (error) {
      console.error("Error creating lesson:", error);
      toast({
        title: "Error al crear la lección",
        description: "No se pudo crear la lección",
        variant: "destructive"
      });
    }
  };

  const handleViewExercises = (lessonId: string) => {
    navigate(`/admin/lessons/${lessonId}/exercises`);
  };

  return (
    <div className="animate-fade-in">
      <AdminNavBar />

      <div className="container p-6">
        <Button onClick={() => navigate("/admin/courses")} variant="ghost" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Cursos
        </Button>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Lecciones del Curso</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona las lecciones de este curso
            </p>
          </div>
          <Button onClick={() => setIsCreating(!isCreating)} className="transition-all duration-300 hover:scale-105">
            {isCreating ? "Cancelar" : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nueva Lección
              </>
            )}
          </Button>
        </div>

        {isCreating && (
          <Card className="mb-6 animate-fade-in">
            <CardContent className="p-6">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={newLesson.title}
                    onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="summary">Resumen</Label>
                  <Input
                    id="summary"
                    value={newLesson.summary}
                    onChange={(e) => setNewLesson({ ...newLesson, summary: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="mainText">Texto Principal</Label>
                  <Input
                    id="mainText"
                    value={newLesson.mainText}
                    onChange={(e) => setNewLesson({ ...newLesson, mainText: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="scripture">Escritura</Label>
                  <Input
                    id="scripture"
                    value={newLesson.scripture}
                    onChange={(e) => setNewLesson({ ...newLesson, scripture: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="scriptureReference">Referencia de Escritura</Label>
                  <Input
                    id="scriptureReference"
                    value={newLesson.scriptureReference}
                    onChange={(e) => setNewLesson({ ...newLesson, scriptureReference: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Tipo</Label>
                  <Select onValueChange={(value) => setNewLesson({ ...newLesson, type: value })}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un tipo" defaultValue={newLesson.type} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="decision">Decisión</SelectItem>
                      <SelectItem value="exercise">Ejercicio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="position">Posición</Label>
                  <Input
                    type="number"
                    id="position"
                    value={newLesson.position}
                    onChange={(e) => setNewLesson({
                      ...newLesson,
                      position: parseInt(e.target.value) || 0
                    })}
                  />
                </div>
                <Button onClick={handleAddLesson}>Crear Lección</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="py-12 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-2">Cargando lecciones...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Título
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Resumen
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {lessons.map((lesson) => (
                      <tr key={lesson.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {lesson.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lesson.summary}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lesson.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button onClick={() => handleViewExercises(lesson.id)} size="sm">
                            Ver Ejercicios
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLessons;
