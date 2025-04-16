import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session, User, AuthError } from '@supabase/supabase-js';
import { apiService } from '@/integrations/supabase/services';

// Definimos la interfaz para el contexto de autenticación
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error: AuthError | null }>;
  signOut: () => Promise<void>;
  adminSignIn: (email: string, password: string) => Promise<{ success: boolean; error: AuthError | null }>;
  isAdmin: boolean;
}

// Creamos el contexto
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Establecer la sesión actual al cargar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user || null);
      setLoading(false);
    });

    // Suscribirse a cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Función para registrar un nuevo usuario
  const signUp = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (data.user && !error) {
      // Inicializar el progreso del usuario
      try {
        await apiService.users.updateUserProgress(data.user.id, {
          level: 1,
          xp: 0,
          streak: 1
        });
      } catch (e) {
        console.error("Error initializing user progress:", e);
      }
    }

    setLoading(false);
    return { success: !error, error };
  };

  // Función para iniciar sesión
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);
    return { success: !error, error };
  };

  // Función para cerrar sesión
  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setIsAdmin(false);
    setLoading(false);
  };

  // Función para iniciar sesión como administrador
  const adminSignIn = async (email: string, password: string) => {
    setLoading(true);

    // Iniciar sesión con credenciales
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      setLoading(false);
      return { success: false, error };
    }

    // Verificar si el usuario es admin
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .single();

    if (adminError || !adminData) {
      // No es admin, cerramos sesión
      await supabase.auth.signOut();
      setLoading(false);
      return {
        success: false,
        error: {
          name: 'not_admin',
          message: 'El usuario no tiene permisos de administrador'
        } as AuthError
      };
    }

    // Es admin
    setIsAdmin(true);
    setLoading(false);
    return { success: true, error: null };
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    adminSignIn,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook para usar la autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
