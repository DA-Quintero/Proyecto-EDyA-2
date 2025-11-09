import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";
import { setUser } from "../slices/authSlice";

export const loginWithEmailAndPassword = (email, password) => {
  return async (dispatch) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const { uid, displayName, photoURL } = response.user;
      dispatch(setUser({ uid, email, displayName, photoURL }));
      return { success: true };
    } catch (error) {
      console.error("Error al iniciar sesión:", error.code, error.message);

      let msg = "Error desconocido al iniciar sesión.";
      switch (error.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
          msg = "La contraseña no es válida.";
          break;
        case "auth/user-not-found":
          msg = "No existe ninguna cuenta con ese correo.";
          break;
        case "auth/too-many-requests":
          msg = "Demasiados intentos. Intenta más tarde.";
          break;
        default:
          msg = error.message;
      }

      return { success: false, message: msg };
    }
  };
};

