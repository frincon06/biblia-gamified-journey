
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";

const Welcome = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };
    
    getUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-24 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-6">
          Bienvenido a SagrApp
        </h1>
        
        {user ? (
          <>
            <p className="text-xl mb-8">
              Hola, {user.email}! Estamos felices de verte de nuevo.
            </p>
            <div className="grid gap-4 md:grid-cols-2 max-w-md mx-auto">
              <Button 
                onClick={() => navigate("/cursos")}
                className="py-6 text-lg"
                size="lg"
              >
                Explorar Cursos
              </Button>
              <Button 
                onClick={handleLogout}
                className="py-6 text-lg"
                variant="outline"
                size="lg"
              >
                Cerrar Sesión
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-xl mb-8">
              Una plataforma para aprender y profundizar en la Palabra de Dios.
            </p>
            <div className="grid gap-4 md:grid-cols-2 max-w-md mx-auto">
              <Button 
                onClick={() => navigate("/auth")}
                className="py-6 text-lg"
                size="lg"
              >
                Iniciar Sesión
              </Button>
              <Button 
                onClick={() => navigate("/auth")}
                className="py-6 text-lg"
                variant="outline"
                size="lg"
              >
                Registrarse
              </Button>
            </div>
          </>
        )}

        <div className="mt-12 p-6 bg-blue-50 rounded-xl">
          <h2 className="text-2xl font-semibold mb-4">
            ¿Qué puedes hacer en SagrApp?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4">
              <h3 className="font-semibold mb-2">Estudiar la Biblia</h3>
              <p>Accede a cursos bíblicos con explicaciones detalladas y ejercicios interactivos.</p>
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">Crecer espiritualmente</h3>
              <p>Reflexiona sobre lo aprendido y toma decisiones personales con "Mi Decisión".</p>
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">Seguir tu progreso</h3>
              <p>Mantén un registro de tus logros y avances en los diferentes cursos.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
