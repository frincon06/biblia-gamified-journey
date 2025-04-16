
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { User } from "@/types";
import { LogOut, User as UserIcon } from "lucide-react";

// Mock function to fetch user data
const fetchUserProfile = async (): Promise<User> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("No user logged in");
  }
  
  return {
    id: user.id,
    email: user.email || "",
    name: user.user_metadata?.name || "Usuario",
    avatar: user.user_metadata?.avatar || "https://via.placeholder.com/150",
    xp: 1250,
    streak: 7,
    level: 3
  };
};

const Profile = () => {
  const [session, setSession] = useState(null);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Fix: Correct the useQuery implementation by removing onError
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["user-profile"],
    queryFn: fetchUserProfile,
    retry: false,
    enabled: !!session
  });

  // Handle error display with useEffect instead
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar el perfil",
        variant: "destructive"
      });
    }
  }, [error]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente"
    });
  };

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-[80vh]">
        <div className="animate-pulse text-lg">Cargando perfil...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 pb-20 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Mi Perfil</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="w-32 h-32 mb-4">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>
                <UserIcon className="w-12 h-12" />
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold mb-2">{user?.name}</h2>
            <p className="text-muted-foreground mb-4">{user?.email}</p>
            <Button variant="destructive" onClick={handleSignOut} className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Editar Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" defaultValue={user?.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue={user?.email} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar">URL del Avatar</Label>
                <Input id="avatar" defaultValue={user?.avatar} />
              </div>
              <Button type="submit">Guardar Cambios</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
