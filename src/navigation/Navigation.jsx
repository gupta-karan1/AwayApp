import { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Tabs from "./Tabs";
import LoginStackGroup from "./LoginStackGroup";
import { AuthContext } from "../../hooks/AuthContext"; // Import the AuthContext

// This component is used to display the navigation for the application. It uses the AuthContext to determine which navigation to display based on whether the user is logged in or not.
const Navigation = () => {
  const { isUserLoggedIn } = useContext(AuthContext); // The isUserLoggedIn state variable is retrieved from the AuthContext using the useContext hook.

  // The Tabs component is displayed if the user is logged in.
  // The LoginStackGroup component is displayed if the user is not logged in.
  return (
    <NavigationContainer>
      {isUserLoggedIn ? <Tabs /> : <LoginStackGroup />}
    </NavigationContainer>
  );
};

export default Navigation;

// SUMMARY: This component is used to display the navigation for the application. It uses the AuthContext to determine which navigation to display based on whether the user is logged in or not.
