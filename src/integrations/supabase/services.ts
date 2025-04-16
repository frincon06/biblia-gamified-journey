import { supabase } from "./client";
import { Course, Lesson, Exercise, User, UserDecision } from "@/types";

/**
 * Servicios para cursos
 */
export const courseService = {
  // Obtener todos los cursos
  getAllCourses: async (): Promise<Course[]> => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }

    if (!data) return [];

    // Map database fields to our Course type
    return data.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      coverImage: course.cover_image || "https://via.placeholder.com/300",
      lessonsCount: course.lessons_count || 0,
      isActive: course.is_active || true,
      order: course.order_index
    }));
  },

  // Obtener un curso por ID
  getCourseById: async (courseId: string): Promise<Course | null> => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();

    if (error) {
      console.error("Error fetching course:", error);
      throw error;
    }

    if (!data) return null;

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      coverImage: data.cover_image || "https://via.placeholder.com/300",
      lessonsCount: data.lessons_count || 0,
      isActive: data.is_active || true,
      order: data.order_index
    };
  },

  // Crear un nuevo curso
  createCourse: async (course: Omit<Course, 'id' | 'lessonsCount' | 'isActive' | 'order'>): Promise<Course> => {
    // Calculate the next order index
    const { data: existingCourses } = await supabase
      .from('courses')
      .select('order_index')
      .order('order_index', { ascending: false })
      .limit(1);

    const nextOrderIndex = existingCourses && existingCourses.length > 0
      ? existingCourses[0].order_index + 1
      : 0;

    const { data, error } = await supabase
      .from('courses')
      .insert({
        title: course.title,
        description: course.description,
        cover_image: course.coverImage || "https://via.placeholder.com/300",
        is_active: true,
        lessons_count: 0,
        order_index: nextOrderIndex
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating course:", error);
      throw error;
    }

    if (!data) throw new Error("Failed to create course");

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      coverImage: data.cover_image || "https://via.placeholder.com/300",
      lessonsCount: data.lessons_count || 0,
      isActive: data.is_active || true,
      order: data.order_index
    };
  },

  // Actualizar un curso
  updateCourse: async (courseId: string, updates: Partial<Course>): Promise<void> => {
    const updateData: any = {};

    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.coverImage !== undefined) updateData.cover_image = updates.coverImage;
    if (updates.isActive !== undefined) updateData.is_active = updates.isActive;
    if (updates.order !== undefined) updateData.order_index = updates.order;

    const { error } = await supabase
      .from('courses')
      .update(updateData)
      .eq('id', courseId);

    if (error) {
      console.error("Error updating course:", error);
      throw error;
    }
  },

  // Eliminar un curso
  deleteCourse: async (courseId: string): Promise<void> => {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId);

    if (error) {
      console.error("Error deleting course:", error);
      throw error;
    }
  },

  // Actualizar contador de lecciones para un curso
  updateLessonCount: async (courseId: string): Promise<void> => {
    // Contar lecciones para este curso
    const { count, error: countError } = await supabase
      .from('lessons')
      .select('*', { count: 'exact', head: true })
      .eq('course_id', courseId);

    if (countError) {
      console.error("Error counting lessons:", countError);
      throw countError;
    }

    // Actualizar el contador en el curso
    const { error: updateError } = await supabase
      .from('courses')
      .update({ lessons_count: count || 0 })
      .eq('id', courseId);

    if (updateError) {
      console.error("Error updating lesson count:", updateError);
      throw updateError;
    }
  }
};

/**
 * Servicios para lecciones
 */
export const lessonService = {
  // Obtener todas las lecciones de un curso
  getLessonsByCourse: async (courseId: string): Promise<Lesson[]> => {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true });

    if (error) {
      console.error("Error fetching lessons:", error);
      throw error;
    }

    if (!data) return [];

    return data.map(lesson => ({
      id: lesson.id,
      courseId: lesson.course_id,
      title: lesson.title,
      description: lesson.description,
      order: lesson.order_index,
      type: lesson.type as "normal" | "challenge",
      xpReward: lesson.xp_reward || 0,
      content: {
        mainText: lesson.main_text,
        summary: lesson.summary,
        scripture: lesson.scripture || undefined,
        scriptureReference: lesson.scripture_reference || undefined,
        keyVerse: lesson.key_verse || undefined
      },
      exercises: [], // Se cargarán por separado
      completed: false // Se determinará por el progreso del usuario
    }));
  },

  // Obtener una lección por ID
  getLessonById: async (lessonId: string): Promise<Lesson | null> => {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .single();

    if (error) {
      console.error("Error fetching lesson:", error);
      throw error;
    }

    if (!data) return null;

    return {
      id: data.id,
      courseId: data.course_id,
      title: data.title,
      description: data.description,
      order: data.order_index,
      type: data.type as "normal" | "challenge",
      xpReward: data.xp_reward || 0,
      content: {
        mainText: data.main_text,
        summary: data.summary,
        scripture: data.scripture || undefined,
        scriptureReference: data.scripture_reference || undefined,
        keyVerse: data.key_verse || undefined
      },
      exercises: [], // Se cargarán por separado
      completed: false // Se determinará por el progreso del usuario
    };
  },

  // Crear una nueva lección
  createLesson: async (lesson: Omit<Lesson, 'id' | 'exercises' | 'completed'>): Promise<Lesson> => {
    // Calculate the next order index
    const { data: existingLessons } = await supabase
      .from('lessons')
      .select('order_index')
      .eq('course_id', lesson.courseId)
      .order('order_index', { ascending: false })
      .limit(1);

    const nextOrderIndex = existingLessons && existingLessons.length > 0
      ? existingLessons[0].order_index + 1
      : 0;

    const { data, error } = await supabase
      .from('lessons')
      .insert({
        course_id: lesson.courseId,
        title: lesson.title,
        description: lesson.description,
        order_index: lesson.order || nextOrderIndex,
        type: lesson.type,
        xp_reward: lesson.xpReward,
        main_text: lesson.content.mainText,
        summary: lesson.content.summary,
        scripture: lesson.content.scripture || null,
        scripture_reference: lesson.content.scriptureReference || null,
        key_verse: lesson.content.keyVerse || null
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating lesson:", error);
      throw error;
    }

    if (!data) throw new Error("Failed to create lesson");

    // Actualizar contador de lecciones del curso
    await courseService.updateLessonCount(lesson.courseId);

    return {
      id: data.id,
      courseId: data.course_id,
      title: data.title,
      description: data.description,
      order: data.order_index,
      type: data.type as "normal" | "challenge",
      xpReward: data.xp_reward || 0,
      content: {
        mainText: data.main_text,
        summary: data.summary,
        scripture: data.scripture || undefined,
        scriptureReference: data.scripture_reference || undefined,
        keyVerse: data.key_verse || undefined
      },
      exercises: [],
      completed: false
    };
  },

  // Actualizar una lección
  updateLesson: async (lessonId: string, updates: Partial<Lesson>): Promise<void> => {
    const updateData: any = {};

    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.order !== undefined) updateData.order_index = updates.order;
    if (updates.type !== undefined) updateData.type = updates.type;
    if (updates.xpReward !== undefined) updateData.xp_reward = updates.xpReward;

    if (updates.content) {
      if (updates.content.mainText !== undefined) updateData.main_text = updates.content.mainText;
      if (updates.content.summary !== undefined) updateData.summary = updates.content.summary;
      if (updates.content.scripture !== undefined) updateData.scripture = updates.content.scripture;
      if (updates.content.scriptureReference !== undefined) updateData.scripture_reference = updates.content.scriptureReference;
      if (updates.content.keyVerse !== undefined) updateData.key_verse = updates.content.keyVerse;
    }

    const { error } = await supabase
      .from('lessons')
      .update(updateData)
      .eq('id', lessonId);

    if (error) {
      console.error("Error updating lesson:", error);
      throw error;
    }
  },

  // Eliminar una lección
  deleteLesson: async (lessonId: string, courseId: string): Promise<void> => {
    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', lessonId);

    if (error) {
      console.error("Error deleting lesson:", error);
      throw error;
    }

    // Actualizar contador de lecciones del curso
    await courseService.updateLessonCount(courseId);
  }
};

/**
 * Servicios para ejercicios
 */
export const exerciseService = {
  // Obtener todos los ejercicios de una lección
  getExercisesByLesson: async (lessonId: string): Promise<Exercise[]> => {
    const { data, error } = await supabase
      .from('exercises')
      .select('*, exercise_choices(*)')
      .eq('lesson_id', lessonId)
      .order('order_index', { ascending: true });

    if (error) {
      console.error("Error fetching exercises:", error);
      throw error;
    }

    if (!data) return [];

    return data.map(exercise => {
      // Base del ejercicio
      const baseExercise = {
        id: exercise.id,
        order: exercise.order_index,
        xpReward: exercise.xp_reward || 0,
      };

      // Dependiendo del tipo, creamos un ejercicio específico
      switch (exercise.type) {
        case 'multipleChoice':
          return {
            ...baseExercise,
            type: 'multipleChoice',
            question: exercise.question || '',
            choices: exercise.exercise_choices?.map((choice: any) => ({
              id: choice.id,
              text: choice.text,
              isCorrect: choice.is_correct
            })) || []
          };
        case 'trueFalse':
          return {
            ...baseExercise,
            type: 'trueFalse',
            statement: exercise.statement || '',
            isCorrectAnswer: exercise.is_correct_answer || false
          };
        case 'fillBlank':
          return {
            ...baseExercise,
            type: 'fillBlank',
            beforeText: exercise.before_text || '',
            afterText: exercise.after_text || '',
            correctAnswer: exercise.correct_answer || ''
          };
        case 'reflection':
          return {
            ...baseExercise,
            type: 'reflection',
            scripture: exercise.scripture || '',
            question: exercise.question || ''
          };
        default:
          throw new Error(`Unknown exercise type: ${exercise.type}`);
      }
    }) as Exercise[];
  },

  // Crear un nuevo ejercicio
  createExercise: async (exercise: Omit<Exercise, 'id'>, lessonId: string): Promise<Exercise> => {
    // Preparamos los datos base del ejercicio
    const baseExerciseData = {
      lesson_id: lessonId,
      order_index: exercise.order,
      xp_reward: exercise.xpReward,
      type: exercise.type
    };

    // Añadimos datos específicos según el tipo
    let exerciseData: any = { ...baseExerciseData };

    switch (exercise.type) {
      case 'multipleChoice':
        exerciseData = {
          ...exerciseData,
          question: (exercise as any).question
        };
        break;
      case 'trueFalse':
        exerciseData = {
          ...exerciseData,
          statement: (exercise as any).statement,
          is_correct_answer: (exercise as any).isCorrectAnswer
        };
        break;
      case 'fillBlank':
        exerciseData = {
          ...exerciseData,
          before_text: (exercise as any).beforeText,
          after_text: (exercise as any).afterText,
          correct_answer: (exercise as any).correctAnswer
        };
        break;
      case 'reflection':
        exerciseData = {
          ...exerciseData,
          question: (exercise as any).question,
          scripture: (exercise as any).scripture
        };
        break;
    }

    // Insertar el ejercicio
    const { data, error } = await supabase
      .from('exercises')
      .insert(exerciseData)
      .select()
      .single();

    if (error) {
      console.error("Error creating exercise:", error);
      throw error;
    }

    if (!data) throw new Error("Failed to create exercise");

    // Si es un ejercicio de selección múltiple, insertar las opciones
    if (exercise.type === 'multipleChoice') {
      const choices = (exercise as any).choices;
      if (choices && choices.length > 0) {
        const choicesData = choices.map((choice: any) => ({
          exercise_id: data.id,
          text: choice.text,
          is_correct: choice.isCorrect
        }));

        const { error: choicesError } = await supabase
          .from('exercise_choices')
          .insert(choicesData);

        if (choicesError) {
          console.error("Error creating exercise choices:", choicesError);
          throw choicesError;
        }
      }
    }

    // Retornar el ejercicio creado con el ID asignado
    return {
      ...exercise,
      id: data.id
    };
  },

  // Actualizar un ejercicio
  updateExercise: async (exerciseId: string, updates: Partial<Exercise>): Promise<void> => {
    const updateData: any = {};

    if (updates.order !== undefined) updateData.order_index = updates.order;
    if (updates.xpReward !== undefined) updateData.xp_reward = updates.xpReward;

    // Actualizar datos específicos según el tipo
    switch (updates.type) {
      case 'multipleChoice':
        if ((updates as any).question !== undefined) updateData.question = (updates as any).question;
        break;
      case 'trueFalse':
        if ((updates as any).statement !== undefined) updateData.statement = (updates as any).statement;
        if ((updates as any).isCorrectAnswer !== undefined) updateData.is_correct_answer = (updates as any).isCorrectAnswer;
        break;
      case 'fillBlank':
        if ((updates as any).beforeText !== undefined) updateData.before_text = (updates as any).beforeText;
        if ((updates as any).afterText !== undefined) updateData.after_text = (updates as any).afterText;
        if ((updates as any).correctAnswer !== undefined) updateData.correct_answer = (updates as any).correctAnswer;
        break;
      case 'reflection':
        if ((updates as any).question !== undefined) updateData.question = (updates as any).question;
        if ((updates as any).scripture !== undefined) updateData.scripture = (updates as any).scripture;
        break;
    }

    // Solo actualizar si hay datos para actualizar
    if (Object.keys(updateData).length > 0) {
      const { error } = await supabase
        .from('exercises')
        .update(updateData)
        .eq('id', exerciseId);

      if (error) {
        console.error("Error updating exercise:", error);
        throw error;
      }
    }

    // Si es multiple choice y hay updates para choices
    if (updates.type === 'multipleChoice' && (updates as any).choices) {
      const choices = (updates as any).choices;

      // Primero eliminamos todas las opciones antiguas
      const { error: deleteError } = await supabase
        .from('exercise_choices')
        .delete()
        .eq('exercise_id', exerciseId);

      if (deleteError) {
        console.error("Error deleting exercise choices:", deleteError);
        throw deleteError;
      }

      // Luego insertamos las nuevas
      if (choices && choices.length > 0) {
        const choicesData = choices.map((choice: any) => ({
          exercise_id: exerciseId,
          text: choice.text,
          is_correct: choice.isCorrect
        }));

        const { error: choicesError } = await supabase
          .from('exercise_choices')
          .insert(choicesData);

        if (choicesError) {
          console.error("Error updating exercise choices:", choicesError);
          throw choicesError;
        }
      }
    }
  },

  // Eliminar un ejercicio
  deleteExercise: async (exerciseId: string): Promise<void> => {
    // Primero eliminamos las opciones asociadas si existen
    const { error: choicesError } = await supabase
      .from('exercise_choices')
      .delete()
      .eq('exercise_id', exerciseId);

    if (choicesError) {
      console.error("Error deleting exercise choices:", choicesError);
      throw choicesError;
    }

    // Luego eliminamos el ejercicio
    const { error } = await supabase
      .from('exercises')
      .delete()
      .eq('id', exerciseId);

    if (error) {
      console.error("Error deleting exercise:", error);
      throw error;
    }
  }
};

/**
 * Servicios para usuarios y progreso
 */
export const userService = {
  // Obtener datos de progreso de un usuario
  getUserProgress: async (userId: string): Promise<{
    level: number;
    xp: number;
    streak: number;
    lastActivity: Date | null;
  } | null> => {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // Not found
        return null;
      }
      console.error("Error fetching user progress:", error);
      throw error;
    }

    if (!data) return null;

    return {
      level: data.level || 1,
      xp: data.xp || 0,
      streak: data.streak || 0,
      lastActivity: data.last_activity ? new Date(data.last_activity) : null
    };
  },

  // Crear o actualizar el progreso de un usuario
  updateUserProgress: async (
    userId: string,
    updates: {
      xp?: number;
      level?: number;
      streak?: number;
      incrementXp?: number;
    }
  ): Promise<void> => {
    // Obtener progreso actual
    const currentProgress = await userService.getUserProgress(userId);

    // Preparar datos a actualizar
    const updateData: any = {};

    if (updates.xp !== undefined) updateData.xp = updates.xp;
    if (updates.level !== undefined) updateData.level = updates.level;
    if (updates.streak !== undefined) updateData.streak = updates.streak;

    // Si se especifica incrementXp, calculamos el nuevo valor
    if (updates.incrementXp && currentProgress) {
      updateData.xp = (currentProgress.xp || 0) + updates.incrementXp;

      // Calcular nuevo nivel si es necesario (cada 100 XP sube un nivel)
      const newTotalXp = updateData.xp;
      const newLevel = Math.floor(newTotalXp / 100) + 1;

      if (newLevel > (currentProgress.level || 1)) {
        updateData.level = newLevel;
      }
    }

    // Actualizar la fecha de última actividad
    updateData.last_activity = new Date().toISOString();

    // Si no existe un registro para este usuario, lo creamos
    if (!currentProgress) {
      const { error } = await supabase
        .from('user_progress')
        .insert({
          user_id: userId,
          xp: updates.xp || updates.incrementXp || 0,
          level: updates.level || 1,
          streak: updates.streak || 1,
          last_activity: updateData.last_activity,
          joined_at: new Date().toISOString()
        });

      if (error) {
        console.error("Error creating user progress:", error);
        throw error;
      }

      return;
    }

    // Actualizar el registro existente
    const { error } = await supabase
      .from('user_progress')
      .update(updateData)
      .eq('user_id', userId);

    if (error) {
      console.error("Error updating user progress:", error);
      throw error;
    }
  },

  // Marcar una lección como completada
  completeLesson: async (userId: string, lessonId: string, earnedXp: number): Promise<void> => {
    // Insertar registro de lección completada
    const { error } = await supabase
      .from('completed_lessons')
      .insert({
        user_id: userId,
        lesson_id: lessonId,
        completed_at: new Date().toISOString()
      });

    if (error) {
      console.error("Error marking lesson as completed:", error);
      throw error;
    }

    // Actualizar XP y streak del usuario
    await userService.updateUserProgress(userId, {
      incrementXp: earnedXp,
      streak: await userService.calculateCurrentStreak(userId)
    });
  },

  // Obtener lecciones completadas por un usuario
  getCompletedLessons: async (userId: string): Promise<string[]> => {
    const { data, error } = await supabase
      .from('completed_lessons')
      .select('lesson_id')
      .eq('user_id', userId);

    if (error) {
      console.error("Error fetching completed lessons:", error);
      throw error;
    }

    return data?.map(item => item.lesson_id) || [];
  },

  // Calcular racha actual del usuario
  calculateCurrentStreak: async (userId: string): Promise<number> => {
    // Obtener el progreso actual
    const progress = await userService.getUserProgress(userId);

    if (!progress) return 1; // Usuario nuevo, comienza con racha de 1

    const today = new Date();
    const lastActivity = progress.lastActivity;

    // Si no hay actividad previa o la última actividad fue hace más de 48h, la racha vuelve a 1
    if (!lastActivity) return 1;

    const diffTime = today.getTime() - lastActivity.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    // Si la última actividad fue hoy, mantenemos la racha actual
    if (diffDays < 1) return progress.streak;

    // Si la última actividad fue ayer, aumentamos la racha
    if (diffDays < 2) return progress.streak + 1;

    // Si la última actividad fue hace más de 48h, la racha vuelve a 1
    return 1;
  },

  // Guardar decisión del usuario
  saveUserDecision: async (
    userId: string,
    lessonId: string,
    decisionId: string,
    optionId: string
  ): Promise<void> => {
    const { error } = await supabase
      .from('user_decisions')
      .insert({
        user_id: userId,
        lesson_id: lessonId,
        decision_id: decisionId,
        option_id: optionId
      });

    if (error) {
      console.error("Error saving user decision:", error);
      throw error;
    }
  },

  // Obtener decisiones del usuario
  getUserDecisions: async (userId: string): Promise<UserDecision[]> => {
    const { data, error } = await supabase
      .from('user_decisions')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error("Error fetching user decisions:", error);
      throw error;
    }

    return data?.map(decision => ({
      lessonId: decision.lesson_id,
      decisionId: decision.decision_id,
      optionId: decision.option_id,
      timestamp: new Date(decision.created_at)
    })) || [];
  }
};

/**
 * Servicios para decisiones
 */
export const decisionService = {
  // Obtener la decisión de una lección
  getLessonDecision: async (lessonId: string) => {
    // Obtener decisión principal
    const { data: decisionData, error: decisionError } = await supabase
      .from('decisions')
      .select('*')
      .eq('lesson_id', lessonId)
      .single();

    if (decisionError) {
      if (decisionError.code === 'PGRST116') { // Not found
        return null;
      }
      console.error("Error fetching decision:", decisionError);
      throw decisionError;
    }

    if (!decisionData) return null;

    // Obtener opciones de la decisión
    const { data: optionsData, error: optionsError } = await supabase
      .from('decision_options')
      .select('*')
      .eq('decision_id', decisionData.id);

    if (optionsError) {
      console.error("Error fetching decision options:", optionsError);
      throw optionsError;
    }

    const options = optionsData?.map(option => ({
      id: option.id,
      text: option.text
    })) || [];

    return {
      id: decisionData.id,
      title: decisionData.title,
      description: decisionData.description,
      options
    };
  },

  // Crear una nueva decisión para una lección
  createDecision: async (
    lessonId: string,
    decision: {
      title: string;
      description: string;
      options: { text: string }[]
    }
  ) => {
    // Insertar la decisión principal
    const { data: decisionData, error: decisionError } = await supabase
      .from('decisions')
      .insert({
        lesson_id: lessonId,
        title: decision.title,
        description: decision.description
      })
      .select()
      .single();

    if (decisionError) {
      console.error("Error creating decision:", decisionError);
      throw decisionError;
    }

    if (!decisionData) throw new Error("Failed to create decision");

    // Insertar las opciones
    if (decision.options.length > 0) {
      const optionsData = decision.options.map(option => ({
        decision_id: decisionData.id,
        text: option.text
      }));

      const { error: optionsError } = await supabase
        .from('decision_options')
        .insert(optionsData);

      if (optionsError) {
        console.error("Error creating decision options:", optionsError);
        throw optionsError;
      }
    }

    return {
      id: decisionData.id,
      title: decisionData.title,
      description: decisionData.description
    };
  }
};

// Exportar todos los servicios
export const apiService = {
  courses: courseService,
  lessons: lessonService,
  exercises: exerciseService,
  users: userService,
  decisions: decisionService
};
