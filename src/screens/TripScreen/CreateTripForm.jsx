import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  Text,
  Pressable,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { TextInput, Button } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useContext } from "react";
import { AuthContext } from "../../../hooks/AuthContext";
import { FIREBASE_DB, FIREBASE_STORAGE } from "../../../firebaseConfig";
import {
  collection,
  addDoc,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import uuid from "react-native-uuid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import moment from "moment";

// Component to render the Trip Form
const CreateTripForm = () => {
  // State variables to manage form data
  const [tripTitle, setTripTitle] = useState("");
  const [tripLocation, setTripLocation] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [tripType, setTripType] = useState("solo");
  const [invitees, setInvitees] = useState([]);
  const [coverImage, setCoverImage] = useState(null);

  // State variables to manage date picker modal
  const [showStartDateModal, setShowStartDateModal] = useState(false);
  const [showEndDateModal, setShowEndDateModal] = useState(false);

  // State variables to manage loading indicator
  const [loading, setLoading] = useState(false);
  // State variables to manage image upload progress
  const [isLoading, setIsLoading] = useState(false);

  // Access navigation object from React Navigation
  const navigation = useNavigation();

  // Access user object from AuthContext to get user id
  const { user } = useContext(AuthContext);

  // Fucntion to pick an image from image library
  const pickImage = async () => {
    setIsLoading(true); // Show loading image

    /*  Ask for permission to access the image library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }
    No permissions request is necessary for launching the image library */

    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1, // 0 is lowest and 1 is highest quality
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
      // If no image selected set coverImage to null
      setCoverImage(null);
      setInterval(() => {
        setIsLoading(false);
      }, 1000);
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

  // Function to handle start date picker changes
  const onStartChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowStartDateModal(false);
    setStartDate(currentDate);
  };

  // Function to handle end date picker changes
  const onEndChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowEndDateModal(false);
    setEndDate(currentDate);
  };

  // Function to show start date picker
  const showStartDatePicker = () => {
    setShowStartDateModal(true);
  };

  // Function to show end date picker
  const showEndDatePicker = () => {
    setShowEndDateModal(true);
  };

  // SaveTripDetails function to save trip to Firebase under specific user
  const saveTripDetails = async (userId, tripData) => {
    try {
      const q = query(
        collection(FIREBASE_DB, "users"),
        where("userId", "==", userId)
      );

      const querySnapshot = await getDocs(q); // get user documents from user collection based on user id
      const userRef = doc(FIREBASE_DB, "users", querySnapshot.docs[0].id); //Create a reference to this user's document

      await addDoc(collection(userRef, "trips"), tripData); // Add the trip data to the "trips" subcollection under specific user
    } catch (error) {
      Alert.alert("Error saving trip details:", error);
    }
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      setLoading(true); // show loading indicator
      // Prepare the trip data object with the form inputs etc
      const tripData = {
        tripTitle: tripTitle,
        tripLocation: tripLocation,
        startDate: startDate,
        endDate: endDate,
        tripType: tripType,
        invitees: invitees,
        coverImage: coverImage,
        userId: user.uid,
        tripId: uuid.v4(),
        createdAt: new Date(),
      };

      // Save the trip details to Firebase using the saveTripDetails function
      await saveTripDetails(user.uid, tripData);

      Alert.alert("Trip details saved successfully!");

      // Navigate to Trip Plan Screen with trip details as parameters
      navigation.navigate("TripPlan", {
        tripTitle: tripTitle,
        startDate: moment(startDate).format("DD MMM YYYY"),
        endDate: moment(endDate).format("DD MMM YYYY"),
        coverImage: coverImage,
        tripLocation: tripLocation,
        invitees: invitees,
      });
    } catch (error) {
      console.error("Error saving trip details:", error);
    } finally {
      setLoading(false); // set laoding state to flase after form submission
    }
    // Remember to handle the invitees array and cover image accordingly
  };

  // Function to handle trip type change
  const handleTripTypeChange = (value) => {
    setTripType(value);
    if (value === "solo") {
      setInvitees([]); // Reset invitees array when trip type is changed to solo
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="height"
      keyboardVerticalOffset={5}
    >
      <View style={styles.inputContainer}>
        <TextInput
          label="Trip Title"
          value={tripTitle}
          onChangeText={(text) => setTripTitle(text)}
          style={styles.input}
          placeholder="Trip Title"
        />
        <TextInput
          label="Location"
          value={tripLocation}
          onChangeText={(text) => setTripLocation(text)}
          style={styles.input}
          placeholder="Location"
        />
        <View style={styles.dateContainer}>
          {/* Start date picker for Android */}
          {Platform.OS === "android" && (
            <Pressable onPress={showStartDatePicker}>
              <Text>Start Date: </Text>
              <Text style={styles.input}>
                {moment(startDate).format("DD MMM YYYY")}
              </Text>
            </Pressable>
          )}

          {showStartDateModal && (
            <DateTimePicker
              testID="dateTimePicker"
              value={startDate}
              mode={"date"}
              onChange={onStartChange}
              minimumDate={startDate}
              // display={"compact"}
            />
          )}

          {/* Start date picker for iOS */}
          {Platform.OS === "ios" && (
            <View>
              <Text>Start Date</Text>
              <DateTimePicker
                testID="dateTimePicker"
                value={startDate}
                mode={"date"}
                onChange={onStartChange}
                minimumDate={startDate}
              />
            </View>
          )}

          {/* End date picker for Android */}
          {Platform.OS === "android" && (
            <Pressable onPress={showEndDatePicker}>
              <Text>End Date: </Text>
              <Text style={styles.input}>
                {moment(endDate).format("DD MMM YYYY")}
              </Text>
            </Pressable>
          )}

          {/* End Date picker for iOS */}
          {Platform.OS === "ios" && (
            <View>
              <Text>End Date</Text>
              <DateTimePicker
                testID="dateTimePicker"
                value={endDate}
                mode={"date"}
                onChange={onEndChange}
                minimumDate={startDate}
              />
            </View>
          )}

          {showEndDateModal && (
            <DateTimePicker
              testID="dateTimePicker"
              value={endDate}
              mode={"date"}
              minimumDate={startDate}
              onChange={onEndChange}
            />
          )}
        </View>
        {/* Radio buttons for trip type selection */}
        <View style={styles.radioButtonContainer}>
          <TouchableOpacity
            style={[
              styles.radioButton,
              tripType === "solo" ? styles.radioButtonActive : null,
            ]}
            onPress={() => handleTripTypeChange("solo")}
          >
            <Text style={styles.radioButtonText}>Solo Trip</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.radioButton,
              tripType === "group" ? styles.radioButtonActive : null,
            ]}
            onPress={() => handleTripTypeChange("group")}
          >
            <Text style={styles.radioButtonText}>Group Trip</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <View>
            {/* Cover Image Upload */}
            <Button title="Upload Cover Image" onPress={pickImage} />
            {/* Placeholder for Image */}
            {!coverImage && (
              <View style={styles.image}>
                <Text>Your Cover Image will Appear Here</Text>
              </View>
            )}
            {coverImage && (
              <Image source={{ uri: coverImage }} style={styles.image} />
            )}
          </View>
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button
            title="Save Trip"
            onPress={handleSubmit}
            style={styles.button}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

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
    marginBottom: 15,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  radioButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },

  button: {
    marginTop: 16,
  },

  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  radioButtonActive: {
    backgroundColor: "lightblue",
  },
  radioButtonText: {
    color: "black",
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 200,
    backgroundColor: "lightgrey",
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CreateTripForm;

//SUMMARY: This code renders the trip form. It uses state variables to manage the form data. It also includes state variables like "showStartDateModal" and "showEndDateModal" to handle date picker modals and "loading" and "isLoading" to manage loading indicators for the image upload process. The component accesses the navigation object from React Navigation and the user object from the "AuthContext" using hooks. It allows users to pick an image from their device's image library using the "ImagePicker" library, upload the selected image to Firebase Storage, and set the coverImage state to the uploaded image's URL. Various functions are defined to handle changes in the date pickers, show or hide the date picker modals, save trip details to Firebase under the specific user, handle form submissions, and manage trip type changes (solo or group).
