
import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface Choice {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface MultipleChoiceProps {
  question: string;
  choices: Choice[];
  onComplete: (isCorrect: boolean) => void;
}

export function MultipleChoice({ question, choices, onComplete }: MultipleChoiceProps) {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  const handleSubmit = () => {
    if (!selectedChoice) return;
    
    const correctChoice = choices.find(choice => choice.isCorrect);
    const selectedIsCorrect = choices.find(choice => choice.id === selectedChoice)?.isCorrect || false;
    
    setIsCorrect(selectedIsCorrect);
    setHasSubmitted(true);
    
    // Dar tiempo al usuario para ver la retroalimentación antes de continuar
    setTimeout(() => {
      onComplete(selectedIsCorrect);
    }, 1500);
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">{question}</h3>
        
        <RadioGroup 
          value={selectedChoice || ""} 
          onValueChange={setSelectedChoice}
          className="space-y-3"
          disabled={hasSubmitted}
        >
          {choices.map((choice) => {
            const isSelected = selectedChoice === choice.id;
            const showCorrect = hasSubmitted && choice.isCorrect;
            const showIncorrect = hasSubmitted && isSelected && !choice.isCorrect;
            
            return (
              <div 
                key={choice.id} 
                className={`relative flex items-center border rounded-lg p-3 transition-all ${
                  isSelected ? "border-sagr-blue bg-blue-50" : "border-gray-200"
                } ${showCorrect ? "bg-green-50 border-green-400" : ""}
                ${showIncorrect ? "bg-red-50 border-red-400" : ""}`}
              >
                <RadioGroupItem 
                  value={choice.id} 
                  id={choice.id} 
                  className="mr-3"
                />
                <Label 
                  htmlFor={choice.id} 
                  className="flex-1 cursor-pointer py-1"
                >
                  {choice.text}
                </Label>
                
                {showCorrect && (
                  <Check className="w-5 h-5 text-green-500 ml-2" />
                )}
                {showIncorrect && (
                  <X className="w-5 h-5 text-red-500 ml-2" />
                )}
              </div>
            );
          })}
        </RadioGroup>
        
        <div className="mt-6">
          {hasSubmitted ? (
            <div className={`py-3 px-4 rounded-md ${
              isCorrect ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}>
              {isCorrect ? "¡Correcto!" : "Incorrecto. Inténtalo de nuevo."}
            </div>
          ) : (
            <Button 
              onClick={handleSubmit} 
              className="w-full" 
              disabled={!selectedChoice}
            >
              Comprobar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
