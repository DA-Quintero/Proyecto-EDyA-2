import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerAuth } from "../store/thunks/registerAuth";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import "../App.scss";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nameError, setNameError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setDisplayName(value);
    if (value && value.length < 3) {
      setNameError("El nombre debe tener al menos 3 caracteres");
    } else {
      setNameError("");
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !validateEmail(value)) {
      setEmailError("Por favor ingresa un correo válido");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (value && value.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    // Validaciones antes de enviar
    if (displayName.length < 3) {
      setLocalError("El nombre debe tener al menos 3 caracteres");
      return;
    }

    if (!validateEmail(email)) {
      setLocalError("Por favor ingresa un correo válido");
      return;
    }

    if (password.length < 6) {
      setLocalError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    const res = await dispatch(registerAuth({ email, password, displayName }));

    if (res.meta?.requestStatus === "fulfilled") {
      navigate("/home");
    } else {
      // Manejar errores específicos de Firebase
      if (res.error?.message?.includes("auth/email-already-in-use")) {
        setLocalError("Este correo ya está registrado. Intenta iniciar sesión.");
      } else if (res.error?.message?.includes("email-already-in-use")) {
        setLocalError("Este correo ya está registrado. Intenta iniciar sesión.");
      } else {
        setLocalError(res.error?.message || "Hubo un error al registrarte. Intenta nuevamente.");
      }
    }
  };


  return (
    <div className="authWrapper">
      <div className="authCard">
        <div className="authLogoHeader">
          <div className="authLogoIcon">
            <FontAwesomeIcon icon={faBookOpen} />
          </div>
          <h1 className="authLogoTitle">Librería Municipal</h1>
        </div>

        <div className="authHeader">
          <h2 className="authTitle">Crear cuenta</h2>
          <p className="authSubtitle">Regístrate para acceder a todos nuestros servicios</p>
        </div>

        <form onSubmit={handleSubmit} className="authForm">
          <div className="authFormGroup">
            <label className="authLabel" htmlFor="name">Nombre de usuario</label>
            <input
              id="name"
              type="text"
              className="authInput"
              value={displayName}
              onChange={handleNameChange}
              placeholder="Tu nombre"
              required
            />
            {nameError && <small style={{ color: '#ff3b30', fontSize: '0.85rem', marginTop: '0.25rem' }}>{nameError}</small>}
          </div>

          <div className="authFormGroup">
            <label className="authLabel" htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              className="authInput"
              value={email}
              onChange={handleEmailChange}
              placeholder="tu@correo.com"
              required
            />
            {emailError && <small style={{ color: '#ff3b30', fontSize: '0.85rem', marginTop: '0.25rem' }}>{emailError}</small>}
          </div>

          <div className="authFormGroup">
            <label className="authLabel" htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              className="authInput"
              value={password}
              onChange={handlePasswordChange}
              placeholder="••••••••"
              required
            />
            {passwordError && <small style={{ color: '#ff3b30', fontSize: '0.85rem', marginTop: '0.25rem' }}>{passwordError}</small>}
          </div>

          <button type="submit" disabled={loading} className="authPrimaryBtn">
            {loading ? "Creando..." : "Registrarme"}
          </button>
        </form>

        {(error || localError) && <p className="authError">{localError || error}</p>}

        <p className="authSwitch">
          ¿Ya tienes cuenta? {" "}
          <Link to="/login" className="authLink">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
