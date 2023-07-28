import { StyleSheet, View, Button } from "react-native";
import { signOut } from "firebase/auth";
import { FIREBASE_AUTH } from "../../../firebaseConfig";
import { useNavigation } from "@react-navigation/native";

export default function Profile() {
  // Navigation object from useNavigation hook
  const navigation = useNavigation();

  // Function to handle user logout
  const handleLogout = () => {
    signOut(FIREBASE_AUTH)
      .then(() => {
        // console.log("Sign-out successful.");
        // Sign out successful alert
        alert("Sign-out successful.");
        // Navigate to the Login screen
        navigation.navigate("Login");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <Button title="Log Out" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 15,
    borderRadius: 30,
  },
});

// SUMMARY: Profile Screen with logout button that redirects user to Login screen.
