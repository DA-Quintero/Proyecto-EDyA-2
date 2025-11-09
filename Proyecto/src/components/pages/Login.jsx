import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginWithEmailAndPassword } from "../store/thunks/loginAuth";
import { loginWithGoogle } from "../store/thunks/loginGoogle";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

const handleSubmit = async (e) => {
  e.preventDefault();

 
  const res = await dispatch(loginWithEmailAndPassword(email, password));

  if (res.success) {
    navigate("/"); 
  } else {
    alert(res.message || "Error al iniciar sesión");
  }
};



  const handleGoogleLogin = async () => {
    const res = await dispatch(loginWithGoogle());
    if (res.success) navigate("/");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 400,
        margin: "40px auto",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <h2>Iniciar sesión</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
        required
      />
      <button type="submit" disabled={loading}>
        Iniciar sesión
      </button>

      <hr />

      <button
        type="button"
        onClick={handleGoogleLogin}
        style={{
          backgroundColor: "#4285F4",
          color: "white",
          border: "none",
          padding: "10px",
          cursor: "pointer",
        }}
      >
        Iniciar sesión con Google
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
