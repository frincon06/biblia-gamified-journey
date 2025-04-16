
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Extend the User type to include avatar
interface ExtendedUser extends User {
  avatar_url?: string;
}

const Profile = () => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      
      if (data.user) {
        // Default avatar if none exists
        const userWithAvatar = {
          ...data.user,
          avatar_url: data.user.user_metadata?.avatar_url || "https://api.dicebear.com/7.x/bottts/svg?seed=" + data.user.id
        };
        setUser(userWithAvatar);
        setUsername(data.user.user_metadata?.username || data.user.email?.split('@')[0] || "");
        setAvatarUrl(userWithAvatar.avatar_url || "");
      }
      
      setLoading(false);
    };
    
    getUser();
  }, []);
  
  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setUpdating(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          username,
          avatar_url: avatarUrl
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Update the local user object
      setUser({
        ...user,
        user_metadata: {
          ...user.user_metadata,
          username,
          avatar_url: avatarUrl
        },
        avatar_url: avatarUrl
      });
      
      toast({
        title: "Perfil actualizado",
        description: "Tu perfil ha sido actualizado correctamente."
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>No has iniciado sesión</CardTitle>
            <CardDescription>Inicia sesión para ver tu perfil</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => (window.location.href = "/auth")}>
              Iniciar sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="shadow-lg animate-fade-in">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Avatar className="h-20 w-20 mx-auto">
              <AvatarImage src={user.avatar_url} alt={username} />
              <AvatarFallback>{username.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-2xl">Tu perfil</CardTitle>
          <CardDescription>Administra tu información personal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input id="email" value={user.email || ""} readOnly />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username">Nombre de usuario</Label>
            <Input 
              id="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="avatar">URL del avatar (opcional)</Label>
            <Input 
              id="avatar" 
              value={avatarUrl} 
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg" 
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              onClick={handleUpdateProfile} 
              disabled={updating}
              className="w-full"
            >
              {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Actualizar perfil
            </Button>
            <Button 
              variant="outline" 
              onClick={handleLogout} 
              className="w-full"
            >
              Cerrar sesión
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
