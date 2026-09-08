import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import "./Style/login.css";
import Catalogo from "./Components/Catalogo";
import Footer from "./Components/Footer";

import { AuthProvider } from "./Admin/AuthContext";
import Login from "./Admin/Login";
import ProtectedRoute from "./Admin/ProtectedRoute";
import AdminDashboard from "./Admin/AdminDashboard.jsx";

function PublicSite() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");

  return (
    <>
      <Navbar />
      <Hero
        categoriaSeleccionada={categoriaSeleccionada}
        setCategoriaSeleccionada={setCategoriaSeleccionada}
      />
      <section className="Main-Container">
        <Catalogo categoriaSeleccionada={categoriaSeleccionada} />
      </section>
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<PublicSite />} />
          <Route path="/panel/login" element={<Login />} />
          <Route
            path="/panel"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;