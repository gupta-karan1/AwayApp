import { StyleSheet } from "react-native";
// import Navigation from "./Navigation";
import Navigation from "./src/navigation/Navigation";
import { AuthProvider } from "./hooks/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({});
