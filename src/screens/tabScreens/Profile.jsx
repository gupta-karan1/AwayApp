import { StyleSheet, Text, View, Button } from "react-native";
import { signOut } from "firebase/auth";
import { FIREBASE_AUTH } from "../../../firebaseConfig";
import { useNavigation } from "@react-navigation/native";

export default function Profile() {
  const navigation = useNavigation();

  const handleLogout = () => {
    signOut(FIREBASE_AUTH)
      .then(() => {
        // Sign-out successful.
        // console.log("Sign-out successful.");
        alert("Sign-out successful.");
        navigation.navigate("Login");
      })
      .catch((error) => {
        // An error happened.
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
