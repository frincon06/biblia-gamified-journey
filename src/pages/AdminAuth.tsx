import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
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
  const { adminSignIn, loading } = useAuth();
  const navigate = useNavigate();

  const form = useForm<AdminLoginValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleAdminLogin = async (values: AdminLoginValues) => {
    try {
      const { success, error } = await adminSignIn(values.email, values.password);

      if (!success) {
        if (error?.name === 'not_admin') {
          toast({
            title: "Acceso denegado",
            description: "No tienes permisos de administrador",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido al panel de administración",
      });

      navigate("/admin/dashboard");
    } catch (error: any) {
      toast({
        title: "Error de autenticación",
        description: error.message || "Credenciales incorrectas",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-white">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Panel de Administración</h1>
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
                      className="h-11"
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
                      className="h-11"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-11 mt-4 bg-slate-800 hover:bg-slate-700"
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
