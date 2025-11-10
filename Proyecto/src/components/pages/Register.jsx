import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerAuth } from "../../store/thunks/registerAuth";
import { useNavigate, Link } from "react-router-dom";

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
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Registro</h2>

        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Nombre de usuario"
          required
          style={styles.input}
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
          required
          style={styles.input}
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
          style={styles.input}
        />

        <button type="submit" disabled={loading} style={styles.button}>
          Registrarme
        </button>

        {error && <p style={styles.error}>{error}</p>}

        <p style={{ marginTop: "10px" }}>
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" style={styles.link}>Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" },
  form: { display: "flex", flexDirection: "column", gap: "10px", width: "300px" },
  title: { textAlign: "center" },
  input: { padding: "10px", fontSize: "16px", borderRadius: "8px", border: "1px solid #ccc" },
  button: { padding: "10px", background: "#4CAF50", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" },
  error: { color: "red", textAlign: "center" },
  link: { color: "blue", textDecoration: "underline", cursor: "pointer" },
};

export default Register;
