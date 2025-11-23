import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config";
import { setUser, clearUser } from "./store/slices/authSlice";

import Home from "./components/pages/home";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/pages/Profile";
import Catalog from "./components/pages/Catalog";
import Prestamo from "./components/pages/Prestamo";

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  // 🔄 Mantiene la sesión activa al recargar
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        dispatch(
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          })
        );
      } else {
        dispatch(clearUser());
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <Routes>
      {/* Redirigir al login */}
      <Route path="/" element={user ? <Navigate to="/home" /> : <Navigate to="/login" />} />

      {/* Home pública */}
      <Route path="/home" element={<Home />} />

      <Route path="/catalog" element={<Catalog />} />

      <Route path="/prestamo" element={<Prestamo />} />


      {/* Login */}
      <Route
        path="/login"
        element={user ? <Navigate to="/home" /> : <Login />}
      />

      {/* Registro */}
      <Route
        path="/register"
        element={user ? <Navigate to="/home" /> : <Register />}
      />

      {/* Dashboard protegido */}
      <Route
        path="/profile"
        element={user ? <Profile /> : <Navigate to="/login" />}
      />

      {/* Ruta por defecto */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;
