import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { clearUser } from "../slices/authSlice";

export const logoutAuth = () => {
  return async (dispatch) => {
    await signOut(auth);
    dispatch(clearUser());
  };
};