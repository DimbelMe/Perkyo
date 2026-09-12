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
import ClientesList from "./Admin/ClientesList";
import MaterialesList from "./Admin/MaterialesList";
import PedidosList from "./Admin/PedidosList";
import StockList from "./Admin/StockList";

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
          <Route
            path="/panel/clientes"
            element={
              <ProtectedRoute>
                <ClientesList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/panel/materiales"
            element={
              <ProtectedRoute>
                <MaterialesList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/panel/pedidos"
            element={
              <ProtectedRoute>
                <PedidosList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/panel/stock"
            element={
              <ProtectedRoute>
                <StockList />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
