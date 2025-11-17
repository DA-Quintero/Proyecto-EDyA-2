import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginWithGoogle } from "../store/thunks/loginGoogle";
import { loginWithEmailAndPassword } from "../store/thunks/loginAuth";
import { useNavigate, Link } from "react-router-dom";
import styles from "./auth/auth.module.scss";

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
      navigate("/dashboard");
    } else {
      setError(result.message || "Error al iniciar con Google");
    }
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authCard}>
        <div className={styles.header}>
          <h2 className={styles.title}>Iniciar sesión</h2>
          <p className={styles.subtitle}>Bienvenido de vuelta a BiblioTech</p>
        </div>

        <form onSubmit={handleEmailLogin} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              className={styles.input}
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">Contraseña</label>
            <input
              id="password"
              className={styles.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.primaryBtn}>Entrar</button>
        </form>

        <button type="button" onClick={handleGoogleLogin} className={styles.googleBtn}>
          <span>🔵</span>
          Iniciar sesión con Google
        </button>

        {error && <p className={styles.error}>{error}</p>}

        <p className={styles.switch}>
          ¿No tienes cuenta? {" "}
          <Link to="/register" className={styles.link}>Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
