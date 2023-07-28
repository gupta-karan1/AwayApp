import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  TextInput,
  Button,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../hooks/useAuth";

// Login component
const Login = () => {
  // State variables to store user input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Custom hook for loading and to login user
  const { login, loading } = useAuth();

  // Navigation object from useNavigation hook
  const navigation = useNavigation();

  // Function to handle login
  const handleLogin = async () => {
    try {
      // Call the login function to authenticate the user with the provided email and password
      await login(email, password);
    } catch (error) {
      // error alert
      console.log(error);
      alert("Login failed: ", error.message);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} keyboardVerticalOffset={5}>
      <View style={styles.inputContainer}>
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
        <View style={[styles.loginButton, styles.button]}>
          <Button title="Login" onPress={handleLogin} />
        </View>
      )}
      <View style={styles.button}>
        <Button
          title="Register"
          // Navigate to the Register screen
          onPress={() => navigation.navigate("Register")}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;

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
    width: "80%",
    padding: 15,
    borderRadius: 30,
  },
});

// SUMMARY: The code defines the "Login" component, which provides an interface for users to log in with their email and password. It utilizes state variables to store user input, a custom hook for user authentication, and the "useNavigation" hook for screen navigation. The "handleLogin" function is responsible for authenticating the user using the provided email and password. The component also renders input fields for email and password, along with a "Login" button that triggers the login process. If the user is not logged in, a "Register" button is displayed to navigate to the registration screen.
