import { StyleSheet, View, Button, Alert } from "react-native";
import { signOut } from "firebase/auth";
import { FIREBASE_AUTH } from "../../../firebaseConfig";
import { useNavigation } from "@react-navigation/native";

export default function Profile() {
  // Function to handle user logout
  const handleLogout = () => {
    signOut(FIREBASE_AUTH)
      .then(() => {
        Alert.alert("Sign-out successful.");
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
