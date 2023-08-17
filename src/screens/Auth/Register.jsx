import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  TextInput,
  Button,
  ActivityIndicator,
  Alert,
  Text,
  Image,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { collection, addDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../../firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FIREBASE_STORAGE } from "../../../firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

const Register = () => {
  // State variables to store user input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Custom hook to register user
  const { register, loading, addDisplayName, addPhotoURL } = useAuth();
  const Navigation = useNavigation();

  // Function to handle registration
  const handleRegister = async () => {
    try {
      // Register function to create a new user with the provided email and password
      const userCredential = await register(email, password);
      await addDisplayName(userCredential.user, userName);
      await addPhotoURL(userCredential.user, coverImage);

      // Create a new document in the 'users' collection in Firestore
      const userData = {
        userId: userCredential.user.uid, // Get the user's ID from the userCredential object
        email: email,
        username: userName,
        coverImage: coverImage,
      };

      // create a new users collection in the database

      // Add the new document to the 'users' collection
      const usersCollectionRef = collection(FIREBASE_DB, "users");
      await addDoc(usersCollectionRef, userData);

      // Navigation.navigate("LoginStackGroup", {
      //   screen: "Login",
      // }); // Navigate to the Login screen

      // User registration and 'users' collection creation successful
      Alert.alert("New user registered successfully!");
    } catch (error) {
      // error alert
      console.log(error);
      Alert.alert("Registration failed: ", error.message);
    }
  };

  const clickImage = async () => {
    setIsLoading(true); // Show loading image

    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    // launch image picker and camera with the following options
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      // quality: 1,
    });

    // Check if image is selected
    if (!result.canceled) {
      // Upload slected image to Firebase Storage
      const uploadURL = await uploadImageAsync(result.assets[0].uri);
      setCoverImage(uploadURL); // Set coverImage state to uploaded image URL
      setInterval(() => {
        setIsLoading(false);
      }, 1000); // 1 second delay before hiding loading indicator

      delete result["cancelled"];
    } else {
      setCoverImage(null); // If no image selected set coverImage to null
      setIsLoading(false);
      return;
    }
  };

  // Fucntion to pick an image from image library
  const pickImage = async () => {
    setIsLoading(true); // Show loading image

    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      // quality: 1, // 0 is lowest and 1 is highest quality
    });

    // Check if image is selected
    if (!result.canceled) {
      // Upload slected image to Firebase Storage
      const uploadURL = await uploadImageAsync(result.assets[0].uri);
      setCoverImage(uploadURL); // Set coverImage state to uploaded image URL
      setInterval(() => {
        setIsLoading(false);
      }, 1000); // 1 second delay before hiding loading indicator

      delete result["cancelled"];
    } else {
      setCoverImage(null);
      setIsLoading(false);
      return;
    }
  };

  // Function to upload image to Firebase Storage
  const uploadImageAsync = async (uri) => {
    // Convert image to blob
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    try {
      const storageRef = ref(FIREBASE_STORAGE, `Images/image-${Date.now()}`); // Create reference to Firebase Storage location using current timestamp to make it unique
      const result = await uploadBytes(storageRef, blob); // Upload the Blob (image data) to the specified Firebase Storage location and await the result
      blob.close(); // Close blob after uploading to free resources
      return await getDownloadURL(storageRef); // Return download URL
    } catch (error) {
      // Catch errors and display alert
      alert(`Error: ${error}`);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} keyboardVerticalOffset={40}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <View>
          {/* <Text style={styles.profileText}>Profile Image</Text> */}
          <View style={styles.profileContainer}>
            <Image
              source={
                coverImage
                  ? { uri: coverImage }
                  : require("../../../assets/profileDefault.png")
              }
              style={styles.profileImg}
            />
            <View style={styles.iconContainer}>
              <Pressable onPress={pickImage}>
                <MaterialIcons
                  name="add-photo-alternate"
                  size={30}
                  color="grey"
                />
              </Pressable>
              <Pressable onPress={clickImage}>
                <MaterialIcons name="add-a-photo" size={28} color="grey" />
              </Pressable>
            </View>
          </View>
        </View>
      )}
      <View style={styles.inputContainer}>
        {/* <Text style={styles.label}>Cover Image:</Text> */}
        <Text style={styles.label}>Username:</Text>
        <TextInput
          placeholder="Username"
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
  profileImg: {
    borderRadius: 120,
    height: 120,
    width: 120,
    alignSelf: "center",
    objectFit: "cover",
  },
  profileText: {
    textAlign: "center",
    marginVertical: 15,
  },
  profileContainer: {
    flexDirection: "row",
    gap: -20,
    marginBottom: 15,
  },
  iconContainer: {
    justifyContent: "space-between",
    paddingVertical: 5,
  },
});

// SUMMARY: Register component includes input fields for the user's name, email, and password. When the user fills in the required details and taps the "Register" button, the "handleRegister" function is called. This function attempts to create a new user with the provided email and password using Firebase authentication. Upon successful registration, it creates a new document in the Firestore database's "users" collection with additional user data, including the user's ID and username.
