
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X } from "lucide-react";

interface TrueFalseProps {
  statement: string;
  isCorrectAnswer: boolean;
  onComplete: (isCorrect: boolean) => void;
}

export function TrueFalse({ statement, isCorrectAnswer, onComplete }: TrueFalseProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  const handleSubmit = (answer: boolean) => {
    setSelectedAnswer(answer);
    const correct = answer === isCorrectAnswer;
    setIsCorrect(correct);
    setHasSubmitted(true);
    
    // Dar tiempo para ver la retroalimentación
    setTimeout(() => {
      onComplete(correct);
    }, 1500);
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-6">{statement}</h3>
        
        <div className="flex gap-4">
          <Button 
            variant={selectedAnswer === true ? "default" : "outline"}
            className={`flex-1 h-14 text-lg ${
              hasSubmitted && selectedAnswer === true ? 
              (isCorrect ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600") : ""
            }`}
            onClick={() => !hasSubmitted && handleSubmit(true)}
            disabled={hasSubmitted}
          >
            Verdadero
            {hasSubmitted && selectedAnswer === true && (
              isCorrect ? <Check className="ml-2 w-5 h-5" /> : <X className="ml-2 w-5 h-5" />
            )}
          </Button>
          
          <Button 
            variant={selectedAnswer === false ? "default" : "outline"}
            className={`flex-1 h-14 text-lg ${
              hasSubmitted && selectedAnswer === false ? 
              (isCorrect ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600") : ""
            }`}
            onClick={() => !hasSubmitted && handleSubmit(false)}
            disabled={hasSubmitted}
          >
            Falso
            {hasSubmitted && selectedAnswer === false && (
              isCorrect ? <Check className="ml-2 w-5 h-5" /> : <X className="ml-2 w-5 h-5" />
            )}
          </Button>
        </div>
        
        {hasSubmitted && (
          <div className={`mt-4 py-3 px-4 rounded-md ${
            isCorrect ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}>
            {isCorrect 
              ? "¡Correcto!" 
              : `Incorrecto. La respuesta es ${isCorrectAnswer ? "Verdadero" : "Falso"}.`
            }
          </div>
        )}
      </CardContent>
    </Card>
  );
}
