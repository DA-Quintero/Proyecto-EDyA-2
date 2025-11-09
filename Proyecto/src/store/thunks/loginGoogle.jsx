import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase/config";
import { setUser } from "../slices/authSlice";

export const loginWithGoogle = () => {
  return async (dispatch) => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      dispatch(
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "Usuario",
          photoURL: user.photoURL || "",
        })
      );

      return { success: true };
    } catch (error) {
      console.error("Error en el login con Google:", error.code, error.message);
      return { success: false, message: error.message };
    }
  };
};
