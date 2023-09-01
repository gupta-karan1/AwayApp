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
  FlatList,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { useAuth } from "../../../hooks/useAuth";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { FIREBASE_DB } from "../../../firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FIREBASE_STORAGE } from "../../../firebaseConfig";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { updateProfile } from "firebase/auth";
import { AuthContext } from "../../../hooks/AuthContext";
import { UNSPLASH_ACCESS_KEY } from "@env";

const Register = () => {
  // State variables to store user input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [boardImage, setBoardImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchImage, setSearchImage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchResultsLoading, setSearchResultsLoading] = useState(false);

  const { user } = useContext(AuthContext);

  const getSingleUserData = async () => {
    try {
      setIsLoading(true);
      const q = query(
        collection(FIREBASE_DB, "users"),
        where("userId", "==", user.uid)
      );

      const querySnapshot = await getDocs(q);
      const userData = querySnapshot.docs.map((doc) => doc.data());
      setBoardImage(userData[0].headerImage);
    } catch (error) {
      Alert.alert("Error fetching user data:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Custom hook to register user
  const { register, loading, addDisplayName, addPhotoURL } = useAuth();
  // const Navigation = useNavigation();

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

      // create a new users collection in the database

      // Add the new document to the 'users' collection
      const usersCollectionRef = collection(FIREBASE_DB, "users");
      await addDoc(usersCollectionRef, userData);

      // navigation.navigate("LoginStackGroup", {
      //   screen: "Login",
      // }); // Navigate to the Login screen

      // Avoid going back to register screen instead of profile
      navigation.replace("Profile");
      // User registration and 'users' collection creation successful
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

  const route = useRoute();
  const { username, profileImage, userEmail, userId } = route.params || {};
  // console.log(user);
  useEffect(() => {
    if (userId) {
      setEmail(userEmail);
      setUserName(username);
      setCoverImage(profileImage);
      getSingleUserData();
    }
  }, [userId]);

  const navigation = useNavigation();

  const handleUpdateProfile = async () => {
    try {
      const q = query(
        collection(FIREBASE_DB, "users"),
        where("userId", "==", userId) // Query to find the user document based on the userId
      );
      const querySnapshot1 = await getDocs(q);
      const userRef = doc(FIREBASE_DB, "users", querySnapshot1.docs[0].id); // Create a reference to the user's document

      await updateDoc(userRef, {
        username: userName,
        profileImage: coverImage,
        headerImage: boardImage,
      });

      await updateProfile(user, {
        displayName: userName,
        photoURL: coverImage,
      });

      // User registration and 'users' collection creation successful
      Alert.alert("User profile updated successfully!");
      navigation.navigate("Profile");
    } catch (error) {
      Alert.alert("Update failed: ", error.message);
    }
  };

  const fetchImages = async () => {
    try {
      setSearchResultsLoading(true);
      const data = await fetch(
        `https://api.unsplash.com/search/photos?query=${searchImage}&client_id=${UNSPLASH_ACCESS_KEY}`
      );
      const images = await data.json();
      setSearchResults(images.results);
    } catch (error) {
      console.log(error);
    } finally {
      setSearchResultsLoading(false);
    }
  };

  const handleImageSelection = (image) => {
    setBoardImage(image.urls.small);
    setSelectedImage(image);
    // set search results to one selected image
    setSearchResults([image]);
  };

  return (
    <KeyboardAvoidingView style={styles.container} keyboardVerticalOffset={40}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <View>
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
      </View>

      {!userId && (
        <View style={styles.inputContainer}>
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
      )}

      <View style={styles.inputContainer}>
        {userId && (
          <View>
            <Text style={styles.titleText}>Cover Image (Unsplash):</Text>

            <TextInput
              label="Search for a cover image"
              value={searchImage}
              onChangeText={(text) => setSearchImage(text)}
              onSubmitEditing={fetchImages}
              style={[styles.input, styles.inputStyle]}
              reg
              placeholder="Search for an image"
            />
          </View>
        )}
        {userId && searchResults?.length === 0 && (
          <Text>Nothing found. Try a different query</Text>
        )}
        {userId && searchResultsLoading && <ActivityIndicator />}
        {userId && searchResults.length > 1 && (
          <FlatList
            data={searchResults}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleImageSelection(item)}
                key={item.urls.small}
              >
                <Image source={{ uri: item.urls.small }} style={styles.image} />
              </Pressable>
            )}
            contentContainerStyle={{ alignItems: "center" }}
            keyExtractor={(item) => item.id}
            horizontal
            ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
            showsHorizontalScrollIndicator={false}
          />
        )}
        {userId && searchResults.length === 1 && (
          <Image
            source={{ uri: selectedImage.urls.small }}
            style={styles.selectedImage}
          />
        )}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0782F9" />
      ) : (
        <View style={styles.buttonContainer}>
          <Button
            title={userId ? "Update Profile" : "Register"}
            onPress={userId ? handleUpdateProfile : handleRegister}
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
    paddingHorizontal: 30,
  },
  inputContainer: {
    width: "100%",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 20,
    width: "100%",
  },
  buttonContainer: {
    width: "100%",
    marginTop: 15,
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
  image: {
    height: 180,
    width: 250,
    borderRadius: 10,
  },
  selectedImage: {
    alignSelf: "center",
    height: 180,
    width: 250,
    objectFit: "cover",
    borderRadius: 10,
    marginBottom: 10,
  },
});

// SUMMARY: Register component includes input fields for the user's name, email, and password. When the user fills in the required details and taps the "Register" button, the "handleRegister" function is called. This function attempts to create a new user with the provided email and password using Firebase authentication. Upon successful registration, it creates a new document in the Firestore database's "users" collection with additional user data, including the user's ID and username.
