import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import { setUser } from "../slices/authSlice";

export const loginWithGoogle = () => {
  return async (dispatch) => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Verificar si ya existe en Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          createdAt: new Date().toISOString(),
        });
      }

      // Guardar en Redux
      dispatch(
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        })
      );

      return { success: true };
    } catch (err) {
      console.error("Error en login con Google:", err);
      return { success: false, message: err.message };
    }
  };
};
