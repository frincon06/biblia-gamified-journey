
import { useState } from "react";
import { Award, Book, BookOpen, Calendar, Flame, Medal, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { StreakCounter } from "@/components/StreakCounter";
import { LevelBadge } from "@/components/LevelBadge";
import { mockUser, mockCourses } from "@/data/mock-data";

const Profile = () => {
  const [user, setUser] = useState(mockUser);
  
  // Calcular XP para el siguiente nivel
  const xpForNextLevel = user.level * 100;
  const xpProgress = Math.min(100, (user.xp / xpForNextLevel) * 100);
  
  // Calcular estadísticas
  const coursesStarted = mockCourses.length;
  const coursesCompleted = user.completedCourses.length;
  const lessonsCompleted = user.completedLessons.length;
  
  return (
    <div className="container max-w-md mx-auto px-4 pt-6 pb-20">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Mi perfil</h1>
      </header>
      
      {/* Perfil del usuario */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-sagr-blue/10 flex items-center justify-center mr-4">
              <User className="w-8 h-8 text-sagr-blue" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-sagr-gray-600">{user.email}</p>
              <div className="mt-1 flex items-center gap-2">
                <LevelBadge level={user.level} />
                <StreakCounter days={user.streak} className="!bg-orange-50" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Progreso del nivel */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium flex items-center gap-2">
              <Award className="w-5 h-5 text-sagr-gold" />
              Progreso del nivel
            </h3>
            <span className="text-sm text-sagr-gray-600">
              {user.xp}/{xpForNextLevel} XP
            </span>
          </div>
          
          <Progress value={xpProgress} className="h-2 mb-2" />
          
          <div className="text-xs text-sagr-gray-600 flex justify-between">
            <span>Nivel {user.level}</span>
            <span>Nivel {user.level + 1}</span>
          </div>
        </CardContent>
      </Card>
      
      {/* Estadísticas */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <h3 className="font-medium mb-4">Mis estadísticas</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center p-3 bg-sagr-gray-100 rounded-lg">
              <Flame className="w-6 h-6 text-streak mb-1" />
              <span className="text-xl font-semibold">{user.streak}</span>
              <span className="text-xs text-sagr-gray-600">Días de racha</span>
            </div>
            
            <div className="flex flex-col items-center p-3 bg-sagr-gray-100 rounded-lg">
              <Book className="w-6 h-6 text-sagr-blue mb-1" />
              <span className="text-xl font-semibold">{lessonsCompleted}</span>
              <span className="text-xs text-sagr-gray-600">Lecciones completadas</span>
            </div>
            
            <div className="flex flex-col items-center p-3 bg-sagr-gray-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-sagr-blue mb-1" />
              <span className="text-xl font-semibold">{coursesStarted}</span>
              <span className="text-xs text-sagr-gray-600">Cursos iniciados</span>
            </div>
            
            <div className="flex flex-col items-center p-3 bg-sagr-gray-100 rounded-lg">
              <Medal className="w-6 h-6 text-sagr-gold mb-1" />
              <span className="text-xl font-semibold">{coursesCompleted}</span>
              <span className="text-xs text-sagr-gray-600">Cursos completados</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Últimas decisiones */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-4">Mis decisiones espirituales</h3>
          
          {user.decisions.length > 0 ? (
            <div className="space-y-3">
              {user.decisions.map((decision, index) => (
                <div key={index} className="bg-sagr-gray-100 p-3 rounded-lg">
                  <p className="text-sm font-medium">
                    Me comprometo a leer la Biblia diariamente
                  </p>
                  <p className="text-xs text-sagr-gray-600 mt-1">
                    {new Date(decision.timestamp).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sagr-gray-500 py-4">
              Aún no has tomado decisiones espirituales
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
