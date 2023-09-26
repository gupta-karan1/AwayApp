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
  ScrollView,
  Modal,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { collection, addDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../../firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FIREBASE_STORAGE } from "../../../firebaseConfig";
import { MaterialIcons } from "@expo/vector-icons";
import GlobalStyles from "../../GlobalStyles";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

const Register = () => {
  // State variables to store user input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Custom hook to register user
  const { register, loading, addDisplayName, addPhotoURL } = useAuth();

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
        profileImage: coverImage,
        headerImage: "",
      };

      // Add the new document to the 'users' collection
      const usersCollectionRef = collection(FIREBASE_DB, "users");
      await addDoc(usersCollectionRef, userData);

      Alert.alert("New user registered successfully!");
    } catch (error) {
      // error alert
      // console.log(error);
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

  // Function to pick an image from image library
  const pickImage = async () => {
    setIsLoading(true); // Show loading image

    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
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
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <Pressable onPress={() => setModalVisible(true)}>
            <View style={styles.profileContainer}>
              {/* <Text style={[styles.profileText, GlobalStyles.bodySmallRegular]}>
                Add Profile Image:
              </Text> */}
              <Image
                source={
                  coverImage
                    ? { uri: coverImage }
                    : require("../../../assets/profileDefault.png")
                }
                style={styles.profileImg}
              />

              <Feather
                name="plus"
                size={24}
                color="#F7F5F3"
                style={styles.saveButton}
              />
            </View>
          </Pressable>
        )}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, GlobalStyles.bodySmallRegular]}>
            Name:
          </Text>
          <TextInput
            placeholder="John Doe"
            value={userName}
            onChangeText={(text) => setUserName(text)}
            style={styles.input}
            placeholderTextColor="#A6A6A6"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, GlobalStyles.bodySmallRegular]}>
            Email:
          </Text>
          <TextInput
            placeholder="johnDoe@gmail.com"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
            autoCapitalize="none"
            inputMode="email"
            placeholderTextColor="#A6A6A6"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, GlobalStyles.bodySmallRegular]}>
            Password:
          </Text>
          <TextInput
            placeholder=""
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={styles.input}
            secureTextEntry
            placeholderTextColor="#A6A6A6"
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <Pressable style={styles.submitButton} onPress={handleRegister}>
            <Text
              style={[styles.saveButtonText, GlobalStyles.bodySmallRegular]}
            >
              Sign Up
            </Text>
          </Pressable>
        )}

        <Modal
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          //   style={styles.modal}
          presentationStyle="overFullScreen"
          transparent={true}
        >
          <View
            style={styles.centeredView}
            onTouchEnd={() => Keyboard.dismiss()}
          >
            <View style={styles.modalView}>
              <View style={styles.modalHeader}>
                <Text style={GlobalStyles.titleLargeRegular}>Select Image</Text>
                <Ionicons
                  name="ios-close"
                  size={30}
                  color="black"
                  onPress={() => setModalVisible(false)}
                />
              </View>

              <View style={styles.modalContent}>
                <Pressable onPress={clickImage} style={styles.modalOption}>
                  <MaterialIcons name="add-a-photo" size={28} color="#63725A" />
                  <Text style={GlobalStyles.bodySmallRegular}>
                    Take a Photo
                  </Text>
                </Pressable>
                <Pressable onPress={pickImage} style={styles.modalOption}>
                  <MaterialIcons
                    name="add-photo-alternate"
                    size={30}
                    color="#63725A"
                  />
                  <Text style={GlobalStyles.bodySmallRegular}>
                    Upload from Gallery
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#63725A",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 15,
  },
  submitButton: {
    backgroundColor: "#63725A",
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 15,
    width: "100%",
  },
  saveButtonText: {
    color: "#EFFBB7",
  },
  label: {
    marginBottom: 5,
    color: "#63725A",
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
    alignSelf: "center",
  },
  image: {
    height: 180,
    width: 250,
    borderRadius: 10,
  },
  // selectedImage: {
  //   alignSelf: "center",
  //   height: 180,
  //   width: 250,
  //   objectFit: "cover",
  //   borderRadius: 10,
  //   marginBottom: 10,
  // },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalView: {
    backgroundColor: "#fff",
    height: "30%",
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
    marginHorizontal: 10,
  },
  modalContent: {
    width: "100%",
  },
  modalOption: {
    flexDirection: "row",
    width: "100%",
    gap: 10,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#E5E8E3",
    borderRadius: 20,
    marginVertical: 10,
  },
  saveButton: {
    position: "absolute",
    top: 1,
    right: 1,
    padding: 5,
    backgroundColor: "rgba(99, 114, 90, 0.7)",
    borderRadius: 50,
  },
});

// SUMMARY: Register component includes input fields for the user's name, email, and password. When the user fills in the required details and taps the "Register" button, the "handleRegister" function is called. This function attempts to create a new user with the provided email and password using Firebase authentication. Upon successful registration, it creates a new document in the Firestore database's "users" collection with additional user data, including the user's ID and username.
