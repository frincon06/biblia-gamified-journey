
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X } from "lucide-react";

interface FillInTheBlankProps {
  beforeText?: string;
  afterText?: string;
  correctAnswer: string;
  caseSensitive?: boolean;
  onComplete: (isCorrect: boolean) => void;
}

export function FillInTheBlank({
  beforeText = "",
  afterText = "",
  correctAnswer,
  caseSensitive = false,
  onComplete
}: FillInTheBlankProps) {
  const [userAnswer, setUserAnswer] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  const handleSubmit = () => {
    if (!userAnswer.trim()) return;
    
    // Comprobar la respuesta
    const correct = caseSensitive
      ? userAnswer.trim() === correctAnswer
      : userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase();
    
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
        <div className="text-lg mb-6">
          {beforeText && <span>{beforeText} </span>}
          <Input 
            type="text"
            ref={inputRef}
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="inline-block w-auto min-w-[120px] font-medium"
            placeholder="..."
            disabled={hasSubmitted}
          />
          {afterText && <span> {afterText}</span>}
        </div>
        
        {!hasSubmitted ? (
          <Button 
            onClick={handleSubmit}
            className="w-full" 
            disabled={!userAnswer.trim()}
          >
            Comprobar
          </Button>
        ) : (
          <div className={`mt-4 py-3 px-4 rounded-md ${
            isCorrect ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}>
            {isCorrect ? (
              <div className="flex items-center">
                <Check className="mr-2 w-5 h-5" />
                <span>¡Correcto!</span>
              </div>
            ) : (
              <div>
                <div className="flex items-center">
                  <X className="mr-2 w-5 h-5" />
                  <span>Incorrecto.</span>
                </div>
                <p className="mt-2">La respuesta correcta es: <strong>{correctAnswer}</strong></p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
