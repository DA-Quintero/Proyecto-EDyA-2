import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginWithGoogle } from "../store/thunks/loginGoogle";
import { loginWithEmailAndPassword } from "../store/thunks/loginAuth";
import { useNavigate, Link } from "react-router-dom";
import "../App.scss";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginWithEmailAndPassword(email, password));
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message || "Error al iniciar sesión");
    }

  };

 const handleGoogleLogin = async () => {
    const result = await dispatch(loginWithGoogle());
    if (result.success) {
      navigate("/profile");
    } else {
      setError(result.message || "Error al iniciar con Google");
    }
  };

  return (
    <div className="authWrapper">
      <div className="authCard">
        <div className="authHeader">
          <h2 className="authTitle">Iniciar sesión</h2>
          <p className="authSubtitle">Bienvenido de vuelta a BiblioTech</p>
        </div>

        <form onSubmit={handleEmailLogin} className="authForm">
          <div className="authFormGroup">
            <label className="authLabel" htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              className="authInput"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="authFormGroup">
            <label className="authLabel" htmlFor="password">Contraseña</label>
            <input
              id="password"
              className="authInput"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="authPrimaryBtn">Entrar</button>
        </form>

        <button type="button" onClick={handleGoogleLogin} className="authGoogleBtn">
          <span>🔵</span>
          Iniciar sesión con Google
        </button>

        {error && <p className="authError">{error}</p>}

        <p className="authSwitch">
          ¿No tienes cuenta? {" "}
          <Link to="/register" className="authLink">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
