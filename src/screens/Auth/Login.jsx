import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  Button,
  ActivityIndicator,
} from "react-native";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { FIREBASE_AUTH } from "../../../firebaseConfig";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuth(); // custom hook to handle login and register user
  // const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  // useEffect(() => {
  //   onAuthStateChanged(FIREBASE_AUTH, (user) => {
  //     if (user) {
  //       navigation.navigate("ExploreStackGroup"); // navigate to ExploreStackGroup
  //     } else {
  //       navigation.navigate("Login");
  //     }
  //   });
  // }, []);

  // function to handle Login User
  const handleLogin = async () => {
    // signInWithEmailAndPassword(FIREBASE_AUTH, email, password)
    //   .then((userCredential) => {
    //     // Signed in
    //     const user = userCredential.user;
    //     // console.log(user.email);
    //     navigation.navigate("ExploreStackGroup");
    //     // ...
    //   })
    //   .catch((error) => {
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    //     // ..
    //     console.log(errorMessage);
    //     alert(errorCode, errorMessage);
    //   });
    // setLoading(true);
    // try {
    //   const userCredential = signInWithEmailAndPassword(
    //     FIREBASE_AUTH,
    //     email,
    //     password
    //   );
    //   console.log(userCredential);
    // } catch (error) {
    //   console.log(error);
    //   alert("Login failed: ", error.message);
    // } finally {
    //   setLoading(false);
    // }

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
  // loginButton: {
  //   marginBottom: 2,
  // },
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
