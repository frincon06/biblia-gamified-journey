
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

interface ReflectionActivityProps {
  scripture: string;
  question: string;
  onComplete: (reflection: string) => void;
}

export function ReflectionActivity({ scripture, question, onComplete }: ReflectionActivityProps) {
  const [reflection, setReflection] = useState("");
  
  const handleSubmit = () => {
    if (reflection.trim()) {
      onComplete(reflection);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-sagr-blue" />
          <span>Reflexión espiritual</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {scripture && (
          <div className="bg-sagr-gray-100 p-4 rounded-md mb-4 italic text-sagr-gray-700 border-l-4 border-sagr-gold">
            {scripture}
          </div>
        )}
        
        <p className="mb-4 text-sagr-gray-800">{question}</p>
        
        <Textarea 
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Escribe tu reflexión aquí..."
          className="min-h-[120px] mb-4"
        />
        
        <Button 
          onClick={handleSubmit}
          className="w-full" 
          disabled={!reflection.trim()}
        >
          Continuar
        </Button>
      </CardContent>
    </Card>
  );
}
