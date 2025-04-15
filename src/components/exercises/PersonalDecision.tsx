
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Check } from "lucide-react";

interface DecisionOption {
  id: string;
  text: string;
}

interface PersonalDecisionProps {
  title: string;
  description: string;
  options: DecisionOption[];
  onComplete: (selectedOption: string) => void;
}

export function PersonalDecision({ title, description, options, onComplete }: PersonalDecisionProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  
  const handleConfirm = () => {
    if (selectedOption) {
      setConfirmed(true);
      setTimeout(() => {
        onComplete(selectedOption);
      }, 1000);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          <span>Mi decisión</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-sagr-gray-600 mb-4">{description}</p>
        
        <div className="space-y-3 mb-6">
          {options.map((option) => (
            <div 
              key={option.id}
              onClick={() => !confirmed && setSelectedOption(option.id)}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                selectedOption === option.id 
                  ? "border-sagr-blue bg-blue-50" 
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${
                  selectedOption === option.id ? "bg-sagr-blue text-white" : "border border-gray-400"
                }`}>
                  {selectedOption === option.id && <Check className="w-3 h-3" />}
                </div>
                <span>{option.text}</span>
              </div>
            </div>
          ))}
        </div>
        
        {confirmed ? (
          <div className="bg-blue-50 p-4 rounded-lg text-center text-sagr-blue border border-blue-100">
            <p className="font-medium">¡Gracias por tu decisión!</p>
            <p className="text-sm mt-1">Que Dios te bendiga en este camino</p>
          </div>
        ) : (
          <Button 
            onClick={handleConfirm}
            className="w-full" 
            disabled={!selectedOption}
          >
            Confirmar mi decisión
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
