import { NavigationContainer } from "@react-navigation/native";
import Tabs from "./Tabs";

// This component is used to display the navigation for the application. It uses the AuthContext to determine which navigation to display based on whether the user is logged in or not.
const Navigation = () => {
  return (
    <NavigationContainer>
      <Tabs />
    </NavigationContainer>
  );
};

export default Navigation;

// SUMMARY: This component is used to display the navigation for the application. It uses the AuthContext to determine which navigation to display based on whether the user is logged in or not.
