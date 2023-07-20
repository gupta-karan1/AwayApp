import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  Button,
} from "react-native";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { FIREBASE_AUTH } from "../../../firebaseConfig";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");

  const navigation = useNavigation();

  //   useEffect(() => {
  //     onAuthStateChanged(FIREBASE_AUTH, (user) => {
  //       if (user) {
  //         navigation.navigate("ExploreStackGroup");
  //       } else {
  //         navigation.navigate("Register");
  //       }
  //     });
  //   }, []);

  //function to handle Register User
  const handleRegister = () => {
    createUserWithEmailAndPassword(FIREBASE_AUTH, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user.email);
        navigation.navigate("ExploreStackGroup");
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
        console.log(errorMessage);
        alert(errorCode, errorMessage);
      });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      //   behavior="padding"
      keyboardVerticalOffset={40}
    >
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Name"
          value={userName}
          onChangeText={(text) => setUserName(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Register"
          onPress={handleRegister}
          style={styles.button}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 48,
  },
  button: {
    backgroundColor: "#0782F9",
    width: "100%",
    padding: 15,
    borderRadius: 10,
  },
  //   buttonOutline: {
  //     backgroundColor: "",
  //     marginTop: 5,
  //     borderColor: "#0782F9",
  //     borderWidth: 2,
  //   },
  //   buttonText: {
  //     color: "white",
  //     fontWeight: "700",
  //     fontSize: 16,
  //   },
});
