
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Welcome from "./pages/Welcome";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import LessonDetail from "./pages/LessonDetail";
import Profile from "./pages/Profile";
import Achievements from "./pages/Achievements";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import AdminAuth from "./pages/AdminAuth";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminRoute from "./components/AdminRoute";
import AdminCourses from "./pages/admin/Courses";
import AdminLessons from "./pages/admin/Lessons";
import AdminExercises from "./pages/admin/Exercises";
import { NavBar } from "./components/NavBar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen pb-16 md:pb-0 md:pt-16">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Welcome />} />
            <Route path="/home" element={<Home />} />
            <Route path="/cursos" element={<Courses />} />
            <Route path="/cursos/:courseId" element={<CourseDetail />} />
            <Route path="/cursos/:courseId/lecciones/:lessonId" element={<LessonDetail />} />
            <Route path="/logros" element={<Achievements />} />
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
                  <AdminCourses />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/courses/:courseId/lessons" 
              element={
                <AdminRoute>
                  <AdminLessons />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/lessons/:lessonId/exercises" 
              element={
                <AdminRoute>
                  <AdminExercises />
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
