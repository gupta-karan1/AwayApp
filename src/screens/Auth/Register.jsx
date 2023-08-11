import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  TextInput,
  Button,
  ActivityIndicator,
  Alert,
  Text,
} from "react-native";
import React, { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { collection, addDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../../firebaseConfig";

const Register = () => {
  // State variables to store user input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");

  // Custom hook to register user
  const { register, loading, addDisplayName } = useAuth();

  // Function to handle registration
  const handleRegister = async () => {
    try {
      // Register function to create a new user with the provided email and password
      const userCredential = await register(email, password);
      await addDisplayName(userCredential.user, userName);

      // Set the user's display name to the username
      // userCredential.user.displayName = userName;

      // Create a new document in the 'users' collection in Firestore
      const userData = {
        userId: userCredential.user.uid, // Get the user's ID from the userCredential object
        email: email,
        username: userName,
      };

      // create a new users collection in the database

      // Add the new document to the 'users' collection
      const usersCollectionRef = collection(FIREBASE_DB, "users");
      await addDoc(usersCollectionRef, userData);

      // User registration and 'users' collection creation successful
      Alert.alert("New user registered successfully!");
    } catch (error) {
      // error alert
      console.log(error);
      alert("Registration failed: ", error.message);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} keyboardVerticalOffset={40}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Username:</Text>
        <TextInput
          placeholder="Name"
          value={userName}
          onChangeText={(text) => setUserName(text)}
          style={styles.input}
        />
        <Text style={styles.label}>Email:</Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
          autoCapitalize="none"
          inputMode="email"
        />
        <Text style={styles.label}>Password:</Text>
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
    marginBottom: 20,
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
  label: {
    marginBottom: 5,
  },
});

// SUMMARY: Register component includes input fields for the user's name, email, and password. When the user fills in the required details and taps the "Register" button, the "handleRegister" function is called. This function attempts to create a new user with the provided email and password using Firebase authentication. Upon successful registration, it creates a new document in the Firestore database's "users" collection with additional user data, including the user's ID and username.
