import { createAsyncThunk } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import { setUser } from "../slices/authSlice";

export const registerAuth = createAsyncThunk(
  "auth/registerAuth",
  async ({ email, password, displayName }, { dispatch, rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName,
        createdAt: new Date().toISOString(),
      });

      // ✅ actualiza el estado global
      dispatch(
        setUser({
          uid: user.uid,
          email: user.email,
          displayName,
        })
      );

      return {
        uid: user.uid,
        email: user.email,
        displayName,
      };
    } catch (err) {
      console.error("Error en el registro:", err.code, err.message);
      return rejectWithValue(err.message);
    }
  }
);
