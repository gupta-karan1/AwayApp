//defines a custom React Hook called useAuth, which provides functionality for user authentication, including login and registration, using Firebase Authentication.

import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { FIREBASE_AUTH } from "../firebaseConfig";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  // asynchronous function that implements the login functionality using Firebase Authentication.
  const login = async (email, password) => {
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );

      // The loading state variable is set to false using the setLoading function to indicate that the login process has ended.
      setLoading(false);

      // The userCredential object returned from the signInWithEmailAndPassword function is returned from the login function so that it can be used to access the user object.
      return userCredential;
    } catch (error) {
      // If an error occurs during the login process, the loading state variable is set to false using the setLoading function to indicate that the login process has ended.
      setLoading(false);

      // The error is thrown so that it can be handled by the component that calls the login function.
      throw error;
    }
  };

  // asynchronous function that implements the registration functionality using Firebase Authentication.
  const register = async (email, password) => {
    setLoading(true);

    try {
      // The createUserWithEmailAndPassword function is used to register the user using the provided email and password.
      const userCredential = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );

      // await updateProfile(userCredential.user, {
      //   displayName: userName,
      //   // photoURL: "../../../assets/profile-pic-placeholder.png"
      // });

      // The loading state variable is set to false using the setLoading function to indicate that the registration process has ended.
      setLoading(false);

      // The userCredential object returned from the createUserWithEmailAndPassword function is returned from the register function so that it can be used to access the user object.
      return userCredential;
    } catch (error) {
      // If an error occurs during the registration process, the loading state variable is set to false using the setLoading function to indicate that the registration process has ended.
      setLoading(false);

      // The error is thrown so that it can be handled by the component that calls the register function.
      throw error;
    }
  };

  const addDisplayName = async (user, displayName) => {
    await updateProfile(user, {
      displayName: displayName,
    });
  };

  const addPhotoURL = async (user, photoURL) => {
    await updateProfile(user, {
      photoURL: photoURL,
    });
  };

  return { login, register, loading, addDisplayName, addPhotoURL };
};

// SUMMARY: Overall, this custom hook encapsulates the login and registration functionality using Firebase Authentication. It is designed to be used in React components, allowing them to implement user authentication easily and consistently.
