import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api";
import { useAuth } from "./AuthContext";
import "../Style/panel.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await apiRequest("/login", {
        method: "POST",
        body: { email, password },
      });
      login(data.token);
      navigate("/panel");
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.message === "UNAUTHORIZED" ? "Credenciales inválidas" : `Error: ${err.message}`
      );
    }
  };

  return (
    <div className="panel-login">
      <div className="panel-login__card">
        <h1 className="panel-login__wordmark">Panel de gestión</h1>
        <p className="panel-login__tagline">PERKYO</p>

        <form onSubmit={handleSubmit}>
          <div className="panel-field">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="panel-field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="panel-error">{error}</p>}

          <button type="submit" className="panel-submit">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}