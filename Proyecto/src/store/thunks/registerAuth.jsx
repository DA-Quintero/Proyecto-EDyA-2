import { createAsyncThunk } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase/config";

export const registerAuth = createAsyncThunk(
  "auth/registerAuth",
  async ({ email, password, displayName }, { rejectWithValue }) => {
    try {

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  
      await updateProfile(userCredential.user, { displayName });

      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName,
      };
    } catch (err) {
      console.error("Error en el registro:", err.code, err.message);
      return rejectWithValue(err.message);
    }
  }
);
