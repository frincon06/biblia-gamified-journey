import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  BookOpen,
  Zap,
  Target,
  Calendar,
  ChevronRight,
  Users,
  MessageSquareQuote,
  Heart,
  Check
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleStart = () => {
    if (isAuthenticated) {
      navigate("/home");
    } else {
      navigate("/auth");
    }
  };

  const features = [
    {
      icon: <BookOpen className="h-6 w-6 text-blue-500" />,
      title: "Lecciones Bíblicas",
      description: "Aprende de manera estructurada con lecciones interactivas basadas en la Biblia."
    },
    {
      icon: <Target className="h-6 w-6 text-green-500" />,
      title: "Progreso Gamificado",
      description: "Gana XP, desbloquea niveles y obtén medallas a medida que avanzas en tu viaje espiritual."
    },
    {
      icon: <Calendar className="h-6 w-6 text-orange-500" />,
      title: "Racha Espiritual",
      description: "Mantén una racha diaria para establecer un hábito constante de estudio bíblico."
    },
    {
      icon: <Heart className="h-6 w-6 text-red-500" />,
      title: "Crecimiento Personal",
      description: "Reflexiona sobre lo aprendido y toma decisiones que impacten tu vida de fe."
    }
  ];

  const testimonials = [
    {
      text: "SagrApp ha transformado mi manera de estudiar la Biblia. Las lecciones son profundas pero fáciles de entender.",
      author: "María G."
    },
    {
      text: "Como líder de jóvenes, recomiendo esta app a todos. La gamificación hace que el aprendizaje bíblico sea divertido y envolvente.",
      author: "Pastor Juan C."
    },
    {
      text: "Desde que comencé a usar esta aplicación, he mantenido un estudio bíblico diario. Las rachas me mantienen motivado.",
      author: "Daniel R."
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Hero Section */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 md:py-32">
        <div className="container mx-auto px-6 text-center">
          <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse-slow">
            <BookOpen className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            SagrApp
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-10 text-blue-100">
            Tu viaje interactivo a través de la Palabra de Dios
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-8 py-6 h-auto"
              onClick={handleStart}
            >
              {isAuthenticated ? "Ir a mi Dashboard" : "Comenzar Ahora"}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 text-lg px-8 py-6 h-auto"
              onClick={() => navigate("/welcome")}
            >
              Conocer Más
            </Button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Características Principales
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              SagrApp combina el aprendizaje bíblico con elementos de gamificación para crear una experiencia única y envolvente.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-5">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Aprende a tu ritmo
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                SagrApp te permite avanzar a tu propio ritmo, con cursos que abarcan diferentes temas bíblicos y niveles de profundidad. Todo el contenido está diseñado para ser accesible pero profundo, ideal tanto para nuevos creyentes como para aquellos con años de estudio bíblico.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <span>Cursos estructurados por temas y niveles</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <span>Ejercicios interactivos que refuerzan el aprendizaje</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <span>Sigue tu progreso y gana recompensas virtuales</span>
                </li>
              </ul>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-xl">
              <div className="aspect-[9/16] rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                <div className="text-center p-6">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Vista previa de la aplicación</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Lo que dicen nuestros usuarios
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Únete a una comunidad creciente de personas que están profundizando su conocimiento bíblico con SagrApp.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-none shadow-lg">
                <CardContent className="p-8">
                  <MessageSquareQuote className="h-8 w-8 text-blue-400 mb-4" />
                  <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                      <Users className="h-5 w-5 text-gray-500" />
                    </div>
                    <span className="font-medium">{testimonial.author}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-700 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Comienza tu viaje bíblico hoy mismo
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
            Únete a miles de personas que están transformando su estudio bíblico con SagrApp. Es completamente gratuito.
          </p>
          <Button
            size="lg"
            className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-8 py-6 h-auto"
            onClick={handleStart}
          >
            {isAuthenticated ? "Ir a mi Dashboard" : "Crear una cuenta gratuita"}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-blue-400 mr-3" />
                <span className="text-xl font-bold text-white">SagrApp</span>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                © {new Date().getFullYear()} SagrApp. Todos los derechos reservados.
              </p>
            </div>
            <div className="flex gap-6">
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white"
                onClick={() => navigate("/auth")}
              >
                Iniciar Sesión
              </Button>
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white"
                onClick={() => navigate("/auth?tab=signup")}
              >
                Registrarse
              </Button>
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white"
                onClick={() => navigate("/admin")}
              >
                Admin
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
