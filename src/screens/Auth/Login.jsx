import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  TextInput,
  Text,
  ActivityIndicator,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../hooks/useAuth";
import GlobalStyles from "../../GlobalStyles";

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
      Alert.alert("Login Successful");
    } catch (error) {
      // error alert
      // console.log(error);
      Alert.alert("Login failed: ", error.message);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} keyboardVerticalOffset={5}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false} // Optional: Hide vertical scrollbar
      >
        <View style={styles.inputContainer}>
          <Text style={[styles.label, GlobalStyles.bodySmallRegular]}>
            Email:
          </Text>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#A6A6A6"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
            inputMode="email"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, GlobalStyles.bodySmallRegular]}>
            Password:
          </Text>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#A6A6A6"
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={styles.input}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#63725A" />
        ) : (
          // <View style={[styles.submitButton]}>
          //   <Button title="Login" onPress={handleLogin} />
          // </View>
          <Pressable style={styles.submitButton} onPress={handleLogin}>
            <Text
              style={[styles.saveButtonText, GlobalStyles.bodySmallRegular]}
            >
              Login
            </Text>
          </Pressable>
        )}

        <Pressable onPress={() => navigation.navigate("Register")}>
          <Text style={[GlobalStyles.bodySmallRegular, styles.register]}>
            Don't have an account?
          </Text>
          {/* <Text style={[GlobalStyles.bodySmallRegular, styles.register]}>
            Don't have an account? <Text style={styles.boldText}>Sign Up</Text>
          </Text> */}
        </Pressable>
        <Pressable
          style={styles.regButton}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={[styles.regButtonText, GlobalStyles.bodySmallRegular]}>
            Sign Up
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    backgroundColor: "#fff",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#63725A",
  },
  label: {
    // marginTop: 5,
    marginBottom: 5,
    color: "#63725A",
  },
  register: {
    color: "#63725A",
    marginTop: 40,
  },
  submitButton: {
    backgroundColor: "#63725A",
    paddingVertical: 15,
    // paddingHorizontal: 15,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 15,
    width: "100%",
  },
  regButton: {
    backgroundColor: "#E5E8E3",
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 15,
    width: "100%",
    // borderWidth: 1,
    borderColor: "#63725A",
  },
  saveButtonText: {
    color: "#EFFBB7",
  },
  regButtonText: {
    color: "#63725A",
    // fontWeight: "bold", // Apply bold font style
  },
  boldText: {
    fontWeight: "bold", // Apply bold font style
  },
});

// SUMMARY: The code defines the "Login" component, which provides an interface for users to log in with their email and password. It utilizes state variables to store user input, a custom hook for user authentication, and the "useNavigation" hook for screen navigation. The "handleLogin" function is responsible for authenticating the user using the provided email and password. The component also renders input fields for email and password, along with a "Login" button that triggers the login process. If the user is not logged in, a "Register" button is displayed to navigate to the registration screen.
