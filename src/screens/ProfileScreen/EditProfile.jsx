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
  Modal,
  ScrollView,
  Keyboard,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import {
  collection,
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
import GlobalStyles from "../../GlobalStyles";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import Toast from "react-native-root-toast";

const EditProfile = () => {
  const [userName, setUserName] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [boardImage, setBoardImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchImage, setSearchImage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchResultsLoading, setSearchResultsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

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
      // cameraType: Camera.Constants.Type.front,
    });

    // Check if image is selected
    if (!result.canceled) {
      // Upload slected image to Firebase Storage
      const uploadURL = await uploadImageAsync(result.assets[0].uri);
      setCoverImage(uploadURL); // Set coverImage state to uploaded image URL
      setModalVisible(false);
      setInterval(() => {
        setIsLoading(false);
      }, 1000); // 1 second delay before hiding loading indicator

      delete result["cancelled"];
    } else {
      // setCoverImage(null); // If no image selected set coverImage to null
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
      setModalVisible(false);
      setInterval(() => {
        setIsLoading(false);
      }, 1000); // 1 second delay before hiding loading indicator

      delete result["cancelled"];
    } else {
      // setCoverImage(null);
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
  const { username, profileImage, userId, headerImage } = route.params || {};
  // console.log(user);
  useEffect(() => {
    if (userId) {
      setUserName(username);
      setCoverImage(profileImage);
      setBoardImage(headerImage);
      getSingleUserData();
    }
  }, [userId]);

  const navigation = useNavigation();

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);
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
      // Alert.alert("User profile updated successfully!");
      Toast.show(`Profile Updated Successfully`, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM - 50,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: "#63725A",
      });
      navigation.navigate("Profile");
    } catch (error) {
      Alert.alert("Update failed: ", error.message);
    } finally {
      setLoading(false);
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
      Alert.alert("No images found", error.message);
    } finally {
      setSearchResultsLoading(false);
      Keyboard.dismiss();
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
                color="#EFFBB7"
                style={styles.saveButton}
              />
            </View>
          </Pressable>
          // <View>
          //   <View style={styles.profileContainer}>
          //     <Image
          //       source={
          //         coverImage
          //           ? { uri: coverImage }
          //           : require("../../../assets/profileDefault.png")
          //       }
          //       style={styles.profileImg}
          //     />
          //     <View style={styles.iconContainer}>
          //       <Pressable onPress={pickImage}>
          //         <MaterialIcons
          //           name="add-photo-alternate"
          //           size={30}
          //           color="grey"
          //         />
          //       </Pressable>
          //       <Pressable onPress={clickImage}>
          //         <MaterialIcons name="add-a-photo" size={28} color="grey" />
          //       </Pressable>
          //     </View>
          //   </View>
          // </View>
        )}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, GlobalStyles.bodySmallRegular]}>
            Name:
          </Text>
          <TextInput
            // placeholder="John Doe"
            value={userName}
            onChangeText={(text) => setUserName(text)}
            style={styles.input}
            placeholderTextColor="#A6A6A6"
          />
        </View>

        <View style={styles.inputContainer}>
          <View>
            <Text style={[styles.label, GlobalStyles.bodySmallRegular]}>
              Cover Image:
            </Text>
            <View style={styles.searchContainer}>
              <TextInput
                label="Search for a cover image"
                value={searchImage}
                onChangeText={(text) => setSearchImage(text)}
                onSubmitEditing={fetchImages}
                style={[styles.searchInput, styles.input]}
                reg
                placeholder="Search for a cover image"
                placeholderTextColor="#A6A6A6"
              />

              <EvilIcons
                name="search"
                size={27}
                color="#63725A"
                onPress={() => {
                  fetchImages();
                }}
                style={styles.searchIcon}
              />
            </View>
          </View>

          {searchResultsLoading && <ActivityIndicator />}
          {searchResults.length > 1 && (
            <FlatList
              data={searchResults}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleImageSelection(item)}
                  key={item.urls.small}
                  style={styles.imageWrapper}
                >
                  <Image
                    source={{ uri: item.urls.small }}
                    style={styles.image}
                  />
                </Pressable>
              )}
              contentContainerStyle={{ alignItems: "center" }}
              keyExtractor={(item) => item.id}
              horizontal
              ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
              showsHorizontalScrollIndicator={false}
            />
          )}
          {searchResults.length === 1 && (
            <Image
              source={{ uri: selectedImage.urls.small }}
              style={styles.selectedImage}
            />
          )}

          {searchResults.length === 0 && (
            <Image
              source={
                boardImage
                  ? { uri: boardImage }
                  : require("../../../assets/headerDefault.jpg")
              }
              style={styles.selectedImage}
            />
          )}
        </View>

        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <Pressable style={styles.submitButton} onPress={handleUpdateProfile}>
            <Text
              style={[styles.saveButtonText, GlobalStyles.bodySmallRegular]}
            >
              Save Profile
            </Text>
          </Pressable>
          //  <View style={styles.buttonContainer}>
          //  <Button
          //     title={"Update Profile"}
          //     onPress={handleUpdateProfile}
          //     style={styles.button}
          //   /> */}
          // </View>
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
                <Text style={GlobalStyles.titleLargeRegular}>Add Image</Text>
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
                  <Text style={GlobalStyles.bodySmallRegular}>Camera</Text>
                </Pressable>
                <Pressable onPress={pickImage} style={styles.modalOption}>
                  <MaterialIcons
                    name="add-photo-alternate"
                    size={30}
                    color="#63725A"
                  />
                  <Text style={GlobalStyles.bodySmallRegular}>Gallery</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditProfile;

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
  // profileContainer: {
  //   flexDirection: "row",
  //   gap: -20,
  //   marginBottom: 15,
  // },
  profileContainer: {
    alignSelf: "center",
  },
  iconContainer: {
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  image: {
    height: 180,
    width: 250,
    borderRadius: 10,
    objectFit: "cover",
  },
  imageWrapper: {
    // flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    // marginBottom: 10,
    // marginTop: 20,
    // marginBottom: 5,
    marginTop: 15,
    justifyContent: "center",
  },
  selectedImage: {
    alignSelf: "center",
    height: 180,
    width: 250,
    objectFit: "cover",
    borderRadius: 10,
    // marginBottom: 5,
    marginTop: 15,
  },
  searchContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 10,
  },
  searchInput: {
    flex: 1,
  },
  searchIcon: {
    paddingHorizontal: 9,
    paddingTop: 13,
    borderRadius: 10,
    height: "100%",
    color: "#63725A",
    borderWidth: 1,
    borderColor: "#63725A",
  },
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
    marginVertical: 5,
  },
  saveButton: {
    position: "absolute",
    top: 1,
    right: 1,
    padding: 5,
    backgroundColor: "rgba(99, 114, 90, 0.7)",
    // backgroundColor: "#F7F5F3",
    borderRadius: 50,
    // borderWidth: 1,
    // borderColor: "#63725A",
  },
  submitButton: {
    backgroundColor: "#63725A",
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: "center",
    // marginTop: 15,
    width: "100%",
  },
  saveButtonText: {
    color: "#EFFBB7",
  },
});

// SUMMARY: Register component includes input fields for the user's name, email, and password. When the user fills in the required details and taps the "Register" button, the "handleRegister" function is called. This function attempts to create a new user with the provided email and password using Firebase authentication. Upon successful registration, it creates a new document in the Firestore database's "users" collection with additional user data, including the user's ID and username.
