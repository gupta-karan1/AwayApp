import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "../firebaseConfig";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Tabs from "./Tabs";
import LoginStackGroup from "./LoginStackGroup";

const Navigation = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    // check if user is logged in
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        setIsUserLoggedIn(true);
      } else {
        setIsUserLoggedIn(false);
      }
    });
  }, []);

  return (
    <NavigationContainer>
      {isUserLoggedIn ? <Tabs /> : <LoginStackGroup />}
    </NavigationContainer>
  );
};

export default Navigation;
