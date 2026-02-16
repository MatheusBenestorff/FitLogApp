import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { MainLayout } from "./layouts/MainLayout"; 
import { Workouts } from "./pages/Workouts";
import type { JSX } from "react";

const Dashboard = () => <h1 className="text-2xl font-bold text-gray-800">Feed Principal</h1>;
const Exercises = () => <h1 className="text-2xl font-bold text-gray-800">Lista de Exercícios</h1>;

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* --- ROTAS PÚBLICAS --- */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* --- ROTAS PROTEGIDAS --- */}
          <Route
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/exercises" element={<Exercises />} />
          </Route>

          {/* Rota 404 - Redireciona para login ou dashboard */}
          <Route path="*" element={<Navigate to="/" />} />
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;