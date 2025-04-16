
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Award, Book, BookOpen, Calendar, Flame, LogOut, Medal, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { StreakCounter } from "@/components/StreakCounter";
import { LevelBadge } from "@/components/LevelBadge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User as UserType } from "@/types";
import { useQuery } from "@tanstack/react-query";

const Profile = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserType | null>(null);
  
  // Fetch the authenticated user
  const { isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: authData } = await supabase.auth.getUser();
      
      if (!authData.user) {
        navigate("/auth");
        return null;
      }
      
      // In a real app, you'd fetch the user profile from your database
      // For now, we'll create a mock profile based on the auth user
      const mockProfile: UserType = {
        id: authData.user.id,
        name: authData.user.email?.split('@')[0] || 'Usuario',
        email: authData.user.email || '',
        level: 3,
        xp: 250,
        streak: 4,
        joinedAt: new Date(),
        completedLessons: [],
        completedCourses: [],
        decisions: []
      };
      
      return mockProfile;
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo cargar el perfil",
        variant: "destructive",
      });
      navigate("/auth");
    }
  });

  useEffect(() => {
    // Set the user profile after the query completes
    if (!isLoading && !error && userProfile === null) {
      setUserProfile({
        id: "user-1",
        name: "Usuario",
        email: "usuario@ejemplo.com",
        level: 3,
        xp: 250,
        streak: 4,
        joinedAt: new Date(),
        completedLessons: [],
        completedCourses: [],
        decisions: []
      });
    }
  }, [isLoading, error, userProfile]);
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente"
    });
    navigate("/");
  };
  
  if (isLoading || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Calcular XP para el siguiente nivel
  const xpForNextLevel = userProfile.level * 100;
  const xpProgress = Math.min(100, (userProfile.xp / xpForNextLevel) * 100);
  
  // Calcular estadísticas
  const lessonsCompleted = userProfile.completedLessons.length;
  const coursesCompleted = userProfile.completedCourses.length;
  const coursesStarted = 2; // This would normally be calculated from real data
  
  return (
    <div className="container max-w-4xl mx-auto px-4 pt-16 pb-20 md:pt-24 md:pb-10 animate-fade-in">
      <header className="mb-6 flex justify-between items-start">
        <h1 className="text-2xl font-bold">Mi perfil</h1>
        <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </Button>
      </header>
      
      {/* Perfil del usuario */}
      <Card className="mb-6 hover:shadow-lg transition-shadow duration-300 animate-fade-in">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mr-6 mb-4 md:mb-0">
              <User className="w-10 h-10 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold">{userProfile.name}</h2>
              <p className="text-muted-foreground">{userProfile.email}</p>
              <div className="mt-2 flex items-center gap-3 flex-wrap">
                <LevelBadge level={userProfile.level} />
                <StreakCounter days={userProfile.streak} className="!bg-orange-900/20" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Progreso del nivel */}
      <Card className="mb-6 hover:shadow-lg transition-shadow duration-300 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium flex items-center gap-2">
              <Award className="w-5 h-5 text-secondary" />
              Progreso del nivel
            </h3>
            <span className="text-sm text-muted-foreground">
              {userProfile.xp}/{xpForNextLevel} XP
            </span>
          </div>
          
          <Progress value={xpProgress} className="h-2 mb-2" />
          
          <div className="text-xs text-muted-foreground flex justify-between">
            <span>Nivel {userProfile.level}</span>
            <span>Nivel {userProfile.level + 1}</span>
          </div>
        </CardContent>
      </Card>
      
      {/* Estadísticas */}
      <Card className="mb-6 hover:shadow-lg transition-shadow duration-300 animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <CardContent className="p-6">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Medal className="w-5 h-5 text-primary" />
            Mis estadísticas
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center p-4 bg-card rounded-lg border border-border">
              <Flame className="w-8 h-8 text-orange-500 mb-2 animate-pulse-slow" />
              <span className="text-2xl font-semibold">{userProfile.streak}</span>
              <span className="text-xs text-muted-foreground">Días de racha</span>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-card rounded-lg border border-border">
              <Book className="w-8 h-8 text-primary mb-2" />
              <span className="text-2xl font-semibold">{lessonsCompleted}</span>
              <span className="text-xs text-muted-foreground">Lecciones completadas</span>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-card rounded-lg border border-border">
              <BookOpen className="w-8 h-8 text-primary mb-2" />
              <span className="text-2xl font-semibold">{coursesStarted}</span>
              <span className="text-xs text-muted-foreground">Cursos iniciados</span>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-card rounded-lg border border-border">
              <Medal className="w-8 h-8 text-secondary mb-2" />
              <span className="text-2xl font-semibold">{coursesCompleted}</span>
              <span className="text-xs text-muted-foreground">Cursos completados</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Últimas decisiones */}
      <Card className="hover:shadow-lg transition-shadow duration-300 animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <CardContent className="p-6">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Mis decisiones espirituales
          </h3>
          
          {userProfile.decisions && userProfile.decisions.length > 0 ? (
            <div className="space-y-3">
              {userProfile.decisions.map((decision, index) => (
                <div key={index} className="bg-accent/10 p-4 rounded-lg staggered-item">
                  <p className="text-sm font-medium">
                    Me comprometo a leer la Biblia diariamente
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(decision.timestamp).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground bg-accent/5 rounded-lg border border-border">
              <Calendar className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p>Aún no has tomado decisiones espirituales</p>
              <p className="text-sm mt-2">Completa lecciones para registrar tus compromisos</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
