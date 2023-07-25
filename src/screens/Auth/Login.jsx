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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuth(); // custom hook to handle login and register user

  const navigation = useNavigation();

  // function to handle Login User
  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (error) {
      console.log(error);
      alert("Login failed: ", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      // behavior="padding"
      keyboardVerticalOffset={5}
    >
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
