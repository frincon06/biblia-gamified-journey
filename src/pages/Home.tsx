
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, BookOpen, Award, Zap, Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StreakCounter } from "@/components/StreakCounter";
import { LevelBadge } from "@/components/LevelBadge";
import { XPCounter } from "@/components/XPCounter";
import { mockUser, mockCourses, mockLessons } from "@/data/mock-data";

const Home = () => {
  const [currentUser, setCurrentUser] = useState(mockUser);
  const [latestCourse, setLatestCourse] = useState(mockCourses[0]);
  const [nextLesson, setNextLesson] = useState(mockLessons[0]);
  
  // Calcular XP para el siguiente nivel
  const xpForNextLevel = currentUser.level * 100;
  const xpProgress = Math.min(100, (currentUser.xp / xpForNextLevel) * 100);
  
  return (
    <div className="container max-w-md mx-auto px-4 pt-6 pb-20">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">¡Hola, {currentUser.name.split(' ')[0]}!</h1>
          <p className="text-sagr-gray-600">Continúa tu camino espiritual</p>
        </div>
        <LevelBadge level={currentUser.level} />
      </header>
      
      {/* Sección de racha diaria */}
      <section className="mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-medium flex items-center">
                <Flame className="w-5 h-5 text-streak mr-2" />
                Tu racha espiritual
              </h2>
              <StreakCounter days={currentUser.streak} />
            </div>
            
            <p className="text-sm text-sagr-gray-600 mb-3">
              Mantén tu estudio diario para crecer espiritualmente
            </p>
            
            <Button className="w-full">
              Comenzar la lección del día
            </Button>
          </CardContent>
        </Card>
      </section>
      
      {/* Sección de progreso del usuario */}
      <section className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <Zap className="w-5 h-5 text-xp mr-2" />
            <h2 className="font-medium">Tu progreso</h2>
          </div>
          <XPCounter amount={currentUser.xp} />
        </div>
        
        <div className="bg-sagr-gray-100 rounded-full h-2 mb-1">
          <div 
            className="bg-gradient-to-r from-xp to-sagr-blue h-full rounded-full" 
            style={{ width: `${xpProgress}%` }}
          ></div>
        </div>
        
        <div className="text-xs text-sagr-gray-600 flex justify-between">
          <span>Nivel {currentUser.level}</span>
          <span>{currentUser.xp}/{xpForNextLevel} XP para nivel {currentUser.level + 1}</span>
        </div>
      </section>
      
      {/* Sección de continuar curso */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium">Continúa tu curso</h2>
        </div>
        
        <Link to={`/cursos/${latestCourse.id}`} className="block">
          <Card className="overflow-hidden border-2 border-sagr-gray-200 transition-all hover:border-sagr-blue">
            <div className="h-20 bg-gradient-to-r from-sagr-blue/20 to-sagr-blue/5 relative">
              {latestCourse.coverImage && (
                <img 
                  src={latestCourse.coverImage} 
                  alt={latestCourse.title} 
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
              )}
              <div className="absolute inset-0 flex items-center justify-start p-4">
                <BookOpen className="w-10 h-10 text-sagr-blue mr-3" />
                <div className="text-left">
                  <h3 className="font-semibold text-sagr-gray-900">{latestCourse.title}</h3>
                  <p className="text-xs text-sagr-gray-700">Continuar aprendiendo</p>
                </div>
              </div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <ChevronRight className="w-5 h-5 text-sagr-gray-700" />
              </div>
            </div>
          </Card>
        </Link>
      </section>
      
      {/* Sección de todos los cursos */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium">Explora todos los cursos</h2>
          <Link to="/cursos" className="text-sm text-sagr-blue">Ver todos</Link>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {mockCourses.slice(0, 4).map((course) => (
            <Link key={course.id} to={`/cursos/${course.id}`} className="block">
              <Card className="border border-sagr-gray-200 hover:border-sagr-blue transition-all">
                <CardContent className="p-3">
                  <div className="w-10 h-10 bg-sagr-blue/10 rounded-full flex items-center justify-center mb-2">
                    <BookOpen className="w-5 h-5 text-sagr-blue" />
                  </div>
                  <h3 className="font-medium text-sm mb-1 line-clamp-1">{course.title}</h3>
                  <p className="text-xs text-sagr-gray-600 line-clamp-1">{course.lessonsCount} lecciones</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
