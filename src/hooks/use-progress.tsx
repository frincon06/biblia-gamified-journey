import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '@/integrations/supabase/services';
import { useAuth } from './use-auth';

interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  lastActivity: Date | null;
  completedLessons: string[];
  isLoading: boolean;
}

interface ProgressContextValue extends UserProgress {
  completeLesson: (lessonId: string, earnedXp: number) => Promise<void>;
  refreshProgress: () => Promise<void>;
  isLessonCompleted: (lessonId: string) => boolean;
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

export const ProgressProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress>({
    xp: 0,
    level: 1,
    streak: 0,
    lastActivity: null,
    completedLessons: [],
    isLoading: true
  });

  // Cargar progreso del usuario cuando el usuario cambie
  useEffect(() => {
    if (user) {
      refreshProgress();
    } else {
      // Reset progress when logged out
      setProgress({
        xp: 0,
        level: 1,
        streak: 0,
        lastActivity: null,
        completedLessons: [],
        isLoading: false
      });
    }
  }, [user]);

  // Función para refrescar el progreso del usuario
  const refreshProgress = async () => {
    if (!user) return;

    setProgress(prev => ({ ...prev, isLoading: true }));

    try {
      // Obtener progreso básico (XP, nivel, racha)
      const userProgress = await apiService.users.getUserProgress(user.id);

      // Obtener lecciones completadas
      const completedLessons = await apiService.users.getCompletedLessons(user.id);

      setProgress({
        xp: userProgress?.xp || 0,
        level: userProgress?.level || 1,
        streak: userProgress?.streak || 0,
        lastActivity: userProgress?.lastActivity || null,
        completedLessons,
        isLoading: false
      });
    } catch (error) {
      console.error('Error fetching user progress:', error);
      setProgress(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Función para marcar una lección como completada
  const completeLesson = async (lessonId: string, earnedXp: number) => {
    if (!user) return;

    try {
      await apiService.users.completeLesson(user.id, lessonId, earnedXp);

      // Actualizar el estado local
      setProgress(prev => ({
        ...prev,
        xp: prev.xp + earnedXp,
        level: Math.floor((prev.xp + earnedXp) / 100) + 1,
        streak: prev.streak + 1, // Simplificado, el backend calcula la racha real
        completedLessons: [...prev.completedLessons, lessonId],
        lastActivity: new Date()
      }));
    } catch (error) {
      console.error('Error completing lesson:', error);
    }
  };

  // Función para verificar si una lección está completada
  const isLessonCompleted = (lessonId: string): boolean => {
    return progress.completedLessons.includes(lessonId);
  };

  const value: ProgressContextValue = {
    ...progress,
    completeLesson,
    refreshProgress,
    isLessonCompleted
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

// Hook para usar el progreso
export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress debe usarse dentro de un ProgressProvider');
  }
  return context;
};
