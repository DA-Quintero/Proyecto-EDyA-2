import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginWithGoogle } from "../store/thunks/loginGoogle";
import { loginWithEmailAndPassword } from "../store/thunks/loginAuth";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import "../App.scss";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Validaciones antes de enviar
    if (!validateEmail(email)) {
      setError("Por favor ingresa un correo válido");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    const result = await dispatch(loginWithEmailAndPassword(email, password));
    if (result.success) {
      navigate("/home");
    } else {
      setError(result.message || "Error al iniciar sesión");
    }
  };

 const handleGoogleLogin = async () => {
    const result = await dispatch(loginWithGoogle());
    if (result.success) {
      navigate("/home");
    } else {
      setError(result.message || "Error al iniciar con Google");
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
          <h2 className="authTitle">Iniciar sesión</h2>
          <p className="authSubtitle">Ingresa tus credenciales para acceder a tu cuenta</p>
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
              onChange={handleEmailChange}
              required
            />
            {emailError && <small style={{ color: '#ff3b30', fontSize: '0.85rem', marginTop: '0.25rem' }}>{emailError}</small>}
          </div>

          <div className="authFormGroup">
            <label className="authLabel" htmlFor="password">Contraseña</label>
            <input
              id="password"
              className="authInput"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            {passwordError && <small style={{ color: '#ff3b30', fontSize: '0.85rem', marginTop: '0.25rem' }}>{passwordError}</small>}
          </div>

          <button type="submit" className="authPrimaryBtn">Iniciar sesión</button>
        </form>

        <button type="button" onClick={handleGoogleLogin} className="authGoogleBtn">
          <FontAwesomeIcon icon={faGoogle} />
          Iniciar sesión con Google
        </button>

        {error && <p className="authError">{error}</p>}

        <p className="authSwitch">
          ¿No tienes una cuenta? {" "}
          <Link to="/register" className="authLink">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
