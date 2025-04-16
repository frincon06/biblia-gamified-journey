
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { ArrowRight, BookOpen, Calendar, Target, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-24 px-4 bg-gradient-to-b from-background to-card">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 animate-fade-in">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
            <BookOpen className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Bienvenido a <span className="text-primary">SagrApp</span>
          </h1>
          <p className="text-xl mb-8 text-muted-foreground max-w-2xl mx-auto">
            Una plataforma para aprender y profundizar en la Palabra de Dios.
          </p>
        </div>
        
        {user ? (
          <div className="grid gap-6 md:grid-cols-2 max-w-xl mx-auto animate-slide-in">
            <Button 
              onClick={() => navigate("/cursos")}
              className="py-6 text-lg group"
              size="lg"
            >
              Explorar Cursos
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              onClick={() => navigate("/home")}
              className="py-6 text-lg"
              variant="secondary"
              size="lg"
            >
              Ir al Inicio
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 max-w-xl mx-auto animate-slide-in">
            <Button 
              onClick={() => navigate("/auth")}
              className="py-6 text-lg group"
              size="lg"
            >
              Iniciar Sesión
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              onClick={() => navigate("/auth?tab=signup")}
              className="py-6 text-lg"
              variant="outline"
              size="lg"
            >
              Registrarse
            </Button>
          </div>
        )}

        <div className="mt-16 p-8 rounded-xl bg-card/50 backdrop-blur-sm border border-border animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-2xl font-semibold mb-6 text-center">
            ¿Qué puedes hacer en SagrApp?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card/50 backdrop-blur-sm border border-border hover:shadow-lg transition-all duration-300 hover:scale-105 staggered-item">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="font-semibold mb-2">Estudiar la Biblia</h3>
                <p className="text-sm text-muted-foreground">Accede a cursos bíblicos con explicaciones detalladas y ejercicios interactivos.</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border border-border hover:shadow-lg transition-all duration-300 hover:scale-105 staggered-item">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="font-semibold mb-2">Crecer espiritualmente</h3>
                <p className="text-sm text-muted-foreground">Reflexiona sobre lo aprendido y toma decisiones personales con "Mi Decisión".</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border border-border hover:shadow-lg transition-all duration-300 hover:scale-105 staggered-item">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-semibold mb-2">Seguir tu progreso</h3>
                <p className="text-sm text-muted-foreground">Mantén un registro de tus logros y avances en los diferentes cursos.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
