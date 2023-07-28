// React context for managing authentication state using Firebase Authentication

import { createContext, useState, useEffect } from "react"; //  used to create a React context and manage state and side effects in functional components.
import { onAuthStateChanged } from "firebase/auth"; //Firebase function used to listen for changes in the authentication state, such as when a user logs in or out.
import { FIREBASE_AUTH } from "../firebaseConfig"; //Firebase Authentication instance

const AuthContext = createContext(); // new context will be used to store and share the authentication state across components in the React component tree.

// custom React component that serves as a wrapper for the entire application or a specific part of it. It is responsible for managing the authentication state and providing it to other components

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // holds the current user object if a user is logged in or null if no user is logged in.
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); // holds a boolean value that indicates whether a user is logged in or not.

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
    // The AuthProvider component wraps its children with the AuthContext.Provider component, which is provided by the React context created earlier (AuthContext).

    // The value prop of AuthContext.Provider is an object containing the user and isUserLoggedIn state variables, making them accessible to all child components that consume the AuthContext.

    <AuthContext.Provider value={{ user, isUserLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

// The AuthContext and AuthProvider components are exported, allowing other parts of the application to use the authentication context and provider.

export { AuthContext, AuthProvider };

//By using this context and provider setup, any component within the application can subscribe to changes in the authentication state and access the current user and login status without having to pass props through multiple layers of the component tree.
