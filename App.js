import { StyleSheet, StatusBar } from "react-native";
import Navigation from "./Navigation";

export default function App() {
  return <Navigation />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: StatusBar.currentHeight || 0,
  },
});
