//defines a custom React Hook called useAuth, which provides functionality for user authentication, including login and registration, using Firebase Authentication.

import { useState } from "react"; // used to manage state in functional components.
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth"; // function used to implement the login and registration functionality using Firebase Authentication.
import { FIREBASE_AUTH } from "../firebaseConfig"; // Firebase Authentication instance

// custom React Hook that provides functionality for user authentication, including login and registration, using Firebase Authentication.
export const useAuth = () => {
  const [loading, setLoading] = useState(false); // state variable that holds a boolean value that indicates whether the login or registration process is ongoing. It is initialized as false.

  // asynchronous function that implements the login functionality using Firebase Authentication.
  const login = async (email, password) => {
    setLoading(true); // The loading state variable is set to true using the setLoading function to indicate that the login process has started.

    // The try-catch block is used to handle any errors that may occur during the login process.
    try {
      // The signInWithEmailAndPassword function is used to log in the user using the provided email and password.
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
    // The try-catch block is used to handle any errors that may occur during the registration process.

    setLoading(true); // The loading state variable is set to true using the setLoading function to indicate that the registration process has started.

    try {
      // The createUserWithEmailAndPassword function is used to register the user using the provided email and password.
      const userCredential = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );

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

  return { login, register, loading }; // The login and register functions are returned from the hook so that they can be used to implement the login and registration functionality in the application.
};
