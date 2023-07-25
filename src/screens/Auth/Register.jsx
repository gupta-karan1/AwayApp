import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  TextInput,
  Button,
  ActivityIndicator,
} from "react-native";
import React, { useState, useContext } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { collection, addDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../../firebaseConfig";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register, loading } = useAuth();
  const [userName, setUserName] = useState("");

  //function to handle Register User
  const handleRegister = async () => {
    try {
      const userCredential = await register(email, password);

      // Create a new document in the 'users' collection in Firestore
      const userData = {
        userId: userCredential.user.uid,
        email: email,
        username: userName, // Add the 'username' field to the user data
      };

      // Add the new document to the 'users' collection
      const usersCollectionRef = collection(FIREBASE_DB, "users");
      await addDoc(usersCollectionRef, userData);

      // User registration and 'users' collection creation successful
      console.log("User registered and 'users' collection created!");
    } catch (error) {
      alert("Registration failed: ", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      // behavior="padding"
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
          inputMode="email"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0782F9" />
      ) : (
        <View style={styles.buttonContainer}>
          <Button
            title="Register"
            onPress={handleRegister}
            style={styles.button}
          />
        </View>
      )}
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
    width: "100%",
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
});
