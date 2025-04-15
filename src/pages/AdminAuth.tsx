
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const schema = z.object({
  email: z.string().email("Ingresa un correo electrónico válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type AdminLoginValues = z.infer<typeof schema>;

const AdminAuth = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<AdminLoginValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleAdminLogin = async (values: AdminLoginValues) => {
    setLoading(true);
    try {
      // Verificar si el email y la contraseña coinciden con las predefinidas
      if (values.email === "admin@sagrapp.com" && values.password === "admin123") {
        // Almacenar en localStorage que es un admin
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("adminEmail", values.email);
        
        toast({
          title: "Inicio de sesión exitoso",
          description: "Bienvenido al panel de administración",
        });
        
        navigate("/admin/dashboard");
      } else {
        toast({
          title: "Error de autenticación",
          description: "Credenciales de administrador incorrectas",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error al iniciar sesión",
        description: error.message || "Inténtalo de nuevo más tarde",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Panel de Administración</h1>
          <p className="text-gray-600 mt-2">
            Accede con tus credenciales de administrador
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAdminLogin)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo Electrónico</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="admin@sagrapp.com" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Contraseña de administrador" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? "Verificando..." : "Acceder como Administrador"}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/auth")}
            className="text-blue-600 hover:underline"
          >
            Volver a inicio de sesión normal
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;
