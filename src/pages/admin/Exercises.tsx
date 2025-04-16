import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  ArrowLeft, 
  ArrowUp, 
  ArrowDown,
  Check,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { mockLessons } from "@/data/mock-data";
import { Exercise } from "@/types";
import AdminNavBar from "@/components/admin/AdminNavBar";

const AdminExercises = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  
  const [lesson, setLesson] = useState(mockLessons.find(l => l.id === lessonId));
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [exerciseType, setExerciseType] = useState<string>("multipleChoice");
  const [newExercise, setNewExercise] = useState<any>({
    type: "multipleChoice",
    question: "",
    choices: [
      { id: "1", text: "", isCorrect: false },
      { id: "2", text: "", isCorrect: false },
      { id: "3", text: "", isCorrect: false }
    ],
    xpReward: 5
  });
  const [editingExercise, setEditingExercise] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({
    type: "multipleChoice",
    question: "",
    choices: [],
    xpReward: 5
  });

  useEffect(() => {
    const lessonData = mockLessons.find(l => l.id === lessonId);
    setExercises(lessonData?.exercises || []);
  }, [lessonId]);

  const handleExerciseTypeChange = (type: string) => {
    setExerciseType(type);
    
    if (type === "multipleChoice") {
      setNewExercise({
        type,
        question: "",
        choices: [
          { id: "1", text: "", isCorrect: false },
          { id: "2", text: "", isCorrect: false },
          { id: "3", text: "", isCorrect: false }
        ],
        xpReward: 5
      });
    } else if (type === "trueFalse") {
      setNewExercise({
        type,
        statement: "",
        isCorrectAnswer: true,
        xpReward: 3
      });
    } else if (type === "fillBlank") {
      setNewExercise({
        type,
        beforeText: "",
        afterText: "",
        correctAnswer: "",
        xpReward: 5
      });
    } else if (type === "reflection") {
      setNewExercise({
        type,
        scripture: "",
        question: "",
        xpReward: 5
      });
    }
  };

  const handleAddChoice = () => {
    const newChoices = [...newExercise.choices, { 
      id: `${newExercise.choices.length + 1}`, 
      text: "", 
      isCorrect: false 
    }];
    setNewExercise({ ...newExercise, choices: newChoices });
  };

  const handleChoiceChange = (index: number, text: string) => {
    const newChoices = [...newExercise.choices];
    newChoices[index].text = text;
    setNewExercise({ ...newExercise, choices: newChoices });
  };

  const handleCorrectChange = (index: number) => {
    const newChoices = [...newExercise.choices].map((choice, i) => ({
      ...choice,
      isCorrect: i === index
    }));
    setNewExercise({ ...newExercise, choices: newChoices });
  };

  const handleAddExercise = () => {
    if (validateExercise()) {
      const newExerciseData = {
        ...newExercise,
        id: `exercise-${Date.now()}`,
        order: exercises.length
      };

      setExercises([...exercises, newExerciseData]);
      setIsAddingExercise(false);
      resetExerciseForm();

      toast({
        title: "Ejercicio creado",
        description: "El ejercicio ha sido añadido exitosamente"
      });
    }
  };

  const validateExercise = (): boolean => {
    if (exerciseType === "multipleChoice") {
      if (!newExercise.question) {
        toast({
          title: "Campo requerido",
          description: "La pregunta es obligatoria",
          variant: "destructive"
        });
        return false;
      }
      
      const emptyChoices = newExercise.choices.filter((c: any) => !c.text);
      if (emptyChoices.length > 0) {
        toast({
          title: "Campos requeridos",
          description: "Todas las opciones deben tener texto",
          variant: "destructive"
        });
        return false;
      }
      
      const hasCorrectAnswer = newExercise.choices.some((c: any) => c.isCorrect);
      if (!hasCorrectAnswer) {
        toast({
          title: "Respuesta correcta requerida",
          description: "Debes marcar al menos una opción como correcta",
          variant: "destructive"
        });
        return false;
      }
    } else if (exerciseType === "trueFalse") {
      if (!newExercise.statement) {
        toast({
          title: "Campo requerido",
          description: "La afirmación es obligatoria",
          variant: "destructive"
        });
        return false;
      }
    } else if (exerciseType === "fillBlank") {
      if (!newExercise.beforeText || !newExercise.afterText || !newExercise.correctAnswer) {
        toast({
          title: "Campos requeridos",
          description: "Todos los campos son obligatorios",
          variant: "destructive"
        });
        return false;
      }
    } else if (exerciseType === "reflection") {
      if (!newExercise.question) {
        toast({
          title: "Campo requerido",
          description: "La pregunta de reflexión es obligatoria",
          variant: "destructive"
        });
        return false;
      }
    }
    
    return true;
  };

  const resetExerciseForm = () => {
    setExerciseType("multipleChoice");
    setNewExercise({
      type: "multipleChoice",
      question: "",
      choices: [
        { id: "1", text: "", isCorrect: false },
        { id: "2", text: "", isCorrect: false },
        { id: "3", text: "", isCorrect: false }
      ],
      xpReward: 5
    });
  };

  const handleEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise.id);
    setEditForm({
      ...exercise
    });
  };

  const handleSaveEdit = (exerciseId: string) => {
    const updatedExercises = exercises.map(exercise => {
      if (exercise.id === exerciseId) {
        return {
          ...editForm,
          id: exerciseId
        };
      }
      return exercise;
    });

    setExercises(updatedExercises);
    setEditingExercise(null);

    toast({
      title: "Ejercicio actualizado",
      description: "El ejercicio ha sido modificado exitosamente"
    });
  };

  const handleDeleteExercise = (exerciseId: string) => {
    const updatedExercises = exercises.filter(exercise => exercise.id !== exerciseId);
    
    const reorderedExercises = updatedExercises.map((exercise, index) => ({
      ...exercise,
      order: index
    }));
    
    setExercises(reorderedExercises);

    toast({
      title: "Ejercicio eliminado",
      description: "El ejercicio ha sido eliminado exitosamente"
    });
  };

  const handleMoveExercise = (exerciseId: string, direction: 'up' | 'down') => {
    const currentIndex = exercises.findIndex(exercise => exercise.id === exerciseId);
    if (
      (direction === 'up' && currentIndex === 0) || 
      (direction === 'down' && currentIndex === exercises.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const newExercises = [...exercises];
    const [movedExercise] = newExercises.splice(currentIndex, 1);
    newExercises.splice(newIndex, 0, movedExercise);

    const updatedExercises = newExercises.map((exercise, index) => ({
      ...exercise,
      order: index
    }));

    setExercises(updatedExercises);
  };

  const renderExerciseForm = () => {
    if (exerciseType === "multipleChoice") {
      return (
        <div className="space-y-4">
          <div>
            <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
              Pregunta
            </label>
            <Input
              id="question"
              value={newExercise.question}
              onChange={(e) => setNewExercise({ ...newExercise, question: e.target.value })}
              placeholder="¿Cuál es la pregunta de selección múltiple?"
            />
          </div>
          
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Opciones</label>
            {newExercise.choices.map((choice: any, index: number) => (
              <div key={choice.id} className="flex space-x-2">
                <Input
                  value={choice.text}
                  onChange={(e) => handleChoiceChange(index, e.target.value)}
                  placeholder={`Opción ${index + 1}`}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant={choice.isCorrect ? "default" : "outline"}
                  onClick={() => handleCorrectChange(index)}
                  className="w-20"
                >
                  {choice.isCorrect ? <Check className="h-4 w-4" /> : "Correcta"}
                </Button>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={handleAddChoice}
              className="mt-2"
            >
              + Añadir opción
            </Button>
          </div>
        </div>
      );
    } else if (exerciseType === "trueFalse") {
      return (
        <div className="space-y-4">
          <div>
            <label htmlFor="statement" className="block text-sm font-medium text-gray-700 mb-1">
              Afirmación
            </label>
            <Input
              id="statement"
              value={newExercise.statement}
              onChange={(e) => setNewExercise({ ...newExercise, statement: e.target.value })}
              placeholder="Escribe una afirmación de verdadero o falso"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Respuesta correcta
            </label>
            <div className="flex space-x-4">
              <Button
                type="button"
                variant={newExercise.isCorrectAnswer ? "default" : "outline"}
                onClick={() => setNewExercise({ ...newExercise, isCorrectAnswer: true })}
              >
                Verdadero
              </Button>
              <Button
                type="button"
                variant={!newExercise.isCorrectAnswer ? "default" : "outline"}
                onClick={() => setNewExercise({ ...newExercise, isCorrectAnswer: false })}
              >
                Falso
              </Button>
            </div>
          </div>
        </div>
      );
    } else if (exerciseType === "fillBlank") {
      return (
        <div className="space-y-4">
          <div>
            <label htmlFor="beforeText" className="block text-sm font-medium text-gray-700 mb-1">
              Texto antes del espacio
            </label>
            <Input
              id="beforeText"
              value={newExercise.beforeText}
              onChange={(e) => setNewExercise({ ...newExercise, beforeText: e.target.value })}
              placeholder="Texto que aparece antes del espacio en blanco"
            />
          </div>
          
          <div>
            <label htmlFor="correctAnswer" className="block text-sm font-medium text-gray-700 mb-1">
              Respuesta correcta
            </label>
            <Input
              id="correctAnswer"
              value={newExercise.correctAnswer}
              onChange={(e) => setNewExercise({ ...newExercise, correctAnswer: e.target.value })}
              placeholder="Palabra o frase que va en el espacio"
            />
          </div>
          
          <div>
            <label htmlFor="afterText" className="block text-sm font-medium text-gray-700 mb-1">
              Texto después del espacio
            </label>
            <Input
              id="afterText"
              value={newExercise.afterText}
              onChange={(e) => setNewExercise({ ...newExercise, afterText: e.target.value })}
              placeholder="Texto que aparece después del espacio en blanco"
            />
          </div>
        </div>
      );
    } else if (exerciseType === "reflection") {
      return (
        <div className="space-y-4">
          <div>
            <label htmlFor="scripture" className="block text-sm font-medium text-gray-700 mb-1">
              Pasaje bíblico (opcional)
            </label>
            <Textarea
              id="scripture"
              value={newExercise.scripture}
              onChange={(e) => setNewExercise({ ...newExercise, scripture: e.target.value })}
              placeholder="Versículo o pasaje bíblico para reflexionar"
              rows={3}
            />
          </div>
          
          <div>
            <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
              Pregunta de reflexión
            </label>
            <Input
              id="question"
              value={newExercise.question}
              onChange={(e) => setNewExercise({ ...newExercise, question: e.target.value })}
              placeholder="Pregunta para que el usuario reflexione"
            />
          </div>
        </div>
      );
    }
    
    return null;
  };

  const getExerciseTypeLabel = (type: string): string => {
    switch (type) {
      case "multipleChoice": return "Selección múltiple";
      case "trueFalse": return "Verdadero o falso";
      case "fillBlank": return "Completar espacio";
      case "reflection": return "Reflexión";
      default: return type;
    }
  };

  const getExerciseSummary = (exercise: Exercise): string => {
    switch (exercise.type) {
      case "multipleChoice": 
        return exercise.question || "Sin pregunta";
      case "trueFalse": 
        return exercise.statement || "Sin afirmación";
      case "fillBlank": 
        return `${exercise.beforeText || "..."} [${exercise.correctAnswer || "___"}] ${exercise.afterText || "..."}`;
      case "reflection": 
        return exercise.question || "Sin pregunta de reflexión";
      default: 
        return "Ejercicio sin contenido";
    }
  };

  return (
    <div>
      <AdminNavBar />
      <div className="container p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Link 
              to={`/admin/courses/${lesson?.courseId}/lessons`}
              className="flex items-center text-sm text-gray-600 mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver a lecciones
            </Link>
            <h1 className="text-2xl font-bold">
              Ejercicios de la lección: {lesson?.title}
            </h1>
          </div>
          <Button onClick={() => setIsAddingExercise(!isAddingExercise)}>
            {isAddingExercise ? "Cancelar" : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nuevo Ejercicio
              </>
            )}
          </Button>
        </div>

        {isAddingExercise && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Crear Nuevo Ejercicio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de ejercicio
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      type="button"
                      variant={exerciseType === "multipleChoice" ? "default" : "outline"}
                      onClick={() => handleExerciseTypeChange("multipleChoice")}
                    >
                      Selección múltiple
                    </Button>
                    <Button 
                      type="button"
                      variant={exerciseType === "trueFalse" ? "default" : "outline"}
                      onClick={() => handleExerciseTypeChange("trueFalse")}
                    >
                      Verdadero o falso
                    </Button>
                    <Button 
                      type="button"
                      variant={exerciseType === "fillBlank" ? "default" : "outline"}
                      onClick={() => handleExerciseTypeChange("fillBlank")}
                    >
                      Completar
                    </Button>
                    <Button 
                      type="button"
                      variant={exerciseType === "reflection" ? "default" : "outline"}
                      onClick={() => handleExerciseTypeChange("reflection")}
                    >
                      Reflexión
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="xpReward" className="block text-sm font-medium text-gray-700 mb-1">
                    Recompensa de XP
                  </label>
                  <Input
                    id="xpReward"
                    type="number"
                    value={newExercise.xpReward}
                    onChange={(e) => setNewExercise({ ...newExercise, xpReward: parseInt(e.target.value) || 0 })}
                    min="1"
                    max="20"
                    className="max-w-[200px]"
                  />
                </div>
                
                {renderExerciseForm()}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleAddExercise} className="w-full">
                Crear Ejercicio
              </Button>
            </CardFooter>
          </Card>
        )}

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Orden</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Contenido</TableHead>
                  <TableHead>XP</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exercises.sort((a, b) => (a.order || 0) - (b.order || 0)).map((exercise) => (
                  <TableRow key={exercise.id}>
                    <TableCell className="w-24">
                      <div className="flex items-center space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleMoveExercise(exercise.id, 'up')}
                          disabled={exercise.order === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <span>{(exercise.order || 0) + 1}</span>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleMoveExercise(exercise.id, 'down')}
                          disabled={(exercise.order || 0) === exercises.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getExerciseTypeLabel(exercise.type)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">
                        {getExerciseSummary(exercise)}
                      </div>
                    </TableCell>
                    <TableCell>{exercise.xpReward || 0} XP</TableCell>
                    <TableCell className="text-right flex justify-end gap-2">
                      <Button onClick={() => handleEditExercise(exercise)} size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => handleDeleteExercise(exercise.id)} size="sm" variant="destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {exercises.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No hay ejercicios para esta lección. Crea el primero haciendo clic en "Nuevo Ejercicio".
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminExercises;
