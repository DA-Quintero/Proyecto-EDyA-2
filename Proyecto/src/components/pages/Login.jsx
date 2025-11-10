import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginWithGoogle } from "../../store/thunks/loginGoogle";
import { loginWithEmailAndPassword } from "../../store/thunks/loginAuth";
import { useNavigate, Link } from "react-router-dom";

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
    <div style={styles.container}>
      <form onSubmit={handleEmailLogin} style={styles.form}>
        <h2 style={styles.title}>Iniciar sesión</h2>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>Entrar</button>
        <button type="button" onClick={handleGoogleLogin} style={styles.googleButton}>
          Iniciar sesión con Google
        </button>

        {error && <p style={styles.error}>{error}</p>}

        <p style={{ marginTop: "10px" }}>
          ¿No tienes cuenta?{" "}
          <Link to="/register" style={styles.link}>Regístrate aquí</Link>
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
  googleButton: { padding: "10px", background: "#DB4437", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" },
  error: { color: "red", textAlign: "center" },
  link: { color: "blue", textDecoration: "underline", cursor: "pointer" },
};

export default Login;
