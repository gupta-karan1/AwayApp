import { NavigationContainer } from "@react-navigation/native";
import { useCustomFonts } from "../../hooks/useCustomFonts";
import Tabs from "./Tabs";
import { View } from "react-native";

// This component is used to display the navigation for the application. It uses the AuthContext to determine which navigation to display based on whether the user is logged in or not.
const Navigation = () => {
  // Load custom fonts using the useCustomFonts hook
  const { fontsLoaded, onLayoutRootView } = useCustomFonts();

  // If fonts are not loaded, return null to avoid rendering
  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
        <Tabs />
      </View>
    </NavigationContainer>
  );
};

export default Navigation;

// SUMMARY: This component is used to display the navigation for the application. It uses the AuthContext to determine which navigation to display based on whether the user is logged in or not.
