
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Welcome from "./pages/Welcome";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import LessonDetail from "./pages/LessonDetail";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import AdminAuth from "./pages/AdminAuth";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminRoute from "./components/AdminRoute";
import { NavBar } from "./components/NavBar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen pb-16">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Welcome />} />
            <Route path="/home" element={<Home />} />
            <Route path="/cursos" element={<Courses />} />
            <Route path="/cursos/:courseId" element={<CourseDetail />} />
            <Route path="/cursos/:courseId/lecciones/:lessonId" element={<LessonDetail />} />
            <Route path="/logros" element={<div className="p-6 text-center">Página de Logros en desarrollo</div>} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Rutas de administración */}
            <Route path="/admin" element={<AdminAuth />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/courses" 
              element={
                <AdminRoute>
                  <div className="p-6">Gestión de Cursos en desarrollo...</div>
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/lessons" 
              element={
                <AdminRoute>
                  <div className="p-6">Gestión de Lecciones en desarrollo...</div>
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <AdminRoute>
                  <div className="p-6">Gestión de Usuarios en desarrollo...</div>
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/stats" 
              element={
                <AdminRoute>
                  <div className="p-6">Estadísticas en desarrollo...</div>
                </AdminRoute>
              } 
            />

            {/* Ruta 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* Mostrar la barra de navegación solo en rutas que no sean de administración */}
          <Routes>
            <Route path="/admin/*" element={null} />
            <Route path="*" element={<NavBar />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
