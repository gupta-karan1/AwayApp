// hook to handle login and register user

import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { FIREBASE_AUTH } from "../firebaseConfig";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      setLoading(false);
      return userCredential;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      setLoading(false);
      return userCredential;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  return { login, register, loading };
};
