// React context for managing authentication state using Firebase Authentication

import { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "../firebaseConfig";

const AuthContext = createContext(); // new context will be used to store and share the authentication state across components in the React component tree.

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  //The useEffect hook is used to subscribe to changes in the authentication state using Firebase's onAuthStateChanged function.
  useEffect(() => {
    // Check if user is logged in
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      //When a user logs in or out, the callback function provided to onAuthStateChanged will be called, and the state variables user and isUserLoggedIn will be updated accordingly.

      if (user) {
        setUser(user);
        setIsUserLoggedIn(true);
      } else {
        setUser(null);
        setIsUserLoggedIn(false);
      }
    });

    //To avoid memory leaks, the useEffect hook returns a cleanup function that unsubscribes from the Firebase authentication state changes. This function is automatically called when the component is unmounted.
    return () => unsubscribe();
  }, []);

  return (
    // The value prop of AuthContext.Provider is an object containing the user and isUserLoggedIn state variables, making them accessible to all child components that consume the AuthContext.

    <AuthContext.Provider value={{ user, isUserLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

//SUMMARY: By using this context and provider setup, any component within the application can subscribe to changes in the authentication state and access the current user and login status without having to pass props through multiple layers of the component tree.
