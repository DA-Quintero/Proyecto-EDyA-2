import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerAuth } from "../store/thunks/registerAuth";
import { useNavigate, Link } from "react-router-dom";
import styles from "./auth/auth.module.scss";

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
    <div className={styles.authWrapper}>
      <div className={styles.authCard}>
        <div className={styles.header}>
          <h2 className={styles.title}>Crear cuenta</h2>
          <p className={styles.subtitle}>Únete a BiblioTech en segundos</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="name">Nombre de usuario</label>
            <input
              id="name"
              type="text"
              className={styles.input}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Tu nombre"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" disabled={loading} className={styles.primaryBtn}>
            {loading ? "Creando..." : "Registrarme"}
          </button>
        </form>

        {error && <p className={styles.error}>{error}</p>}

        <p className={styles.switch}>
          ¿Ya tienes cuenta? {" "}
          <Link to="/login" className={styles.link}>Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
