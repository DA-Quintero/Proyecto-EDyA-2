import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutAuth } from "../store/thunks/logoutAuth";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutAuth());
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h1>Dashboard</h1>
      <p>Bienvenido, {user.displayName}</p>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
}
