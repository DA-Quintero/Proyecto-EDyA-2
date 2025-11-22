import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerAuth } from "../store/thunks/registerAuth";
import { useNavigate, Link } from "react-router-dom";
import "../App.scss";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  const res = await dispatch(registerAuth({ email, password, displayName }));

  if (res.meta?.requestStatus === "fulfilled") {
    navigate("/dashboard");
  } else {
    alert("Hubo un error al registrarte. Intenta nuevamente.");
  }
};


  return (
    <div className="authWrapper">
      <div className="authCard">
        <div className="authHeader">
          <h2 className="authTitle">Crear cuenta</h2>
          <p className="authSubtitle">Únete a BiblioTech en segundos</p>
        </div>

        <form onSubmit={handleSubmit} className="authForm">
          <div className="authFormGroup">
            <label className="authLabel" htmlFor="name">Nombre de usuario</label>
            <input
              id="name"
              type="text"
              className="authInput"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Tu nombre"
              required
            />
          </div>

          <div className="authFormGroup">
            <label className="authLabel" htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              className="authInput"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              required
            />
          </div>

          <div className="authFormGroup">
            <label className="authLabel" htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              className="authInput"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="authPrimaryBtn">
            {loading ? "Creando..." : "Registrarme"}
          </button>
        </form>

        {error && <p className="authError">{error}</p>}

        <p className="authSwitch">
          ¿Ya tienes cuenta? {" "}
          <Link to="/login" className="authLink">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
