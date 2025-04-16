
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Target, Flame, Award, Lock, BookOpen, Calendar, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";

const Achievements = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate("/auth");
        return;
      }
      setUser(data.user);
      setLoading(false);
    };
    
    getUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Achievement categories
  const achievementCategories = [
    {
      title: "Racha",
      icon: Flame,
      color: "text-orange-500",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      achievements: [
        { title: "Primera Racha", description: "Completa tu primer día de racha", completed: true, progress: 100 },
        { title: "Una Semana", description: "Mantén una racha de 7 días", completed: false, progress: 40 },
        { title: "Un Mes Constante", description: "Mantén una racha de 30 días", completed: false, progress: 10 },
      ]
    },
    {
      title: "Estudios",
      icon: BookOpen,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      achievements: [
        { title: "Primera Lección", description: "Completa tu primera lección", completed: true, progress: 100 },
        { title: "Cinco Lecciones", description: "Completa 5 lecciones", completed: false, progress: 60 },
        { title: "Experto", description: "Completa tu primer curso", completed: false, progress: 30 },
      ]
    },
    {
      title: "Tiempo",
      icon: Calendar,
      color: "text-green-500",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      achievements: [
        { title: "Bienvenido", description: "Una semana en la aplicación", completed: true, progress: 100 },
        { title: "Miembro", description: "Un mes en la aplicación", completed: false, progress: 50 },
        { title: "Veterano", description: "Un año en la aplicación", completed: false, progress: 5 },
      ]
    },
  ];

  return (
    <div className="container max-w-4xl mx-auto px-4 pt-16 pb-20 md:pt-24 md:pb-10 animate-fade-in">
      <header className="mb-8 text-center">
        <div className="inline-block p-4 rounded-full bg-secondary/10 mb-4">
          <Trophy className="w-10 h-10 text-secondary animate-pulse-slow" />
        </div>
        <h1 className="text-3xl font-bold">Mis Logros</h1>
        <p className="text-muted-foreground mt-2">
          Sigue progresando en tu camino espiritual
        </p>
      </header>
      
      <div className="space-y-8">
        {achievementCategories.map((category, index) => (
          <section key={index} className="animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="flex items-center gap-2 mb-4">
              <category.icon className={`w-6 h-6 ${category.color}`} />
              <h2 className="text-xl font-semibold">{category.title}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {category.achievements.map((achievement, idx) => (
                <Card 
                  key={idx} 
                  className={`overflow-hidden transition-transform duration-300 hover:scale-105 ${achievement.completed ? 'border-primary/50' : 'opacity-75'}`}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 rounded-full ${category.bgColor} flex items-center justify-center`}>
                        {achievement.completed ? (
                          <Star className={`w-6 h-6 ${category.color}`} />
                        ) : (
                          <Lock className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      {achievement.completed && (
                        <Award className="w-6 h-6 text-secondary" />
                      )}
                    </div>
                    
                    <h3 className="font-semibold mb-1">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {achievement.description}
                    </p>
                    
                    <Progress value={achievement.progress} className="h-2" />
                    <p className="text-xs text-right mt-1 text-muted-foreground">
                      {achievement.progress}%
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
