import { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Tabs from "./Tabs";
import LoginStackGroup from "./LoginStackGroup";
import { AuthContext } from "../../hooks/AuthContext"; // Import the AuthContext

const Navigation = () => {
  const { isUserLoggedIn } = useContext(AuthContext);

  return (
    <NavigationContainer>
      {isUserLoggedIn ? <Tabs /> : <LoginStackGroup />}
    </NavigationContainer>
  );
};

export default Navigation;
