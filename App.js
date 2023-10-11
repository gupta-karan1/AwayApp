import { StyleSheet } from "react-native";
// import Navigation from "./Navigation";
import Navigation from "./src/navigation/Navigation";
import { AuthProvider } from "./hooks/AuthContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Platform } from "react-native";
import { UIManager } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootSiblingParent } from "react-native-root-siblings";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function App() {
  return (
    <RootSiblingParent>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <AuthProvider>
            <Navigation />
          </AuthProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </RootSiblingParent>
  );
}

const styles = StyleSheet.create({});
