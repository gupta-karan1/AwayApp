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

// import { v4 as uuidv4 } from "uuid";

const CreateTripForm = () => {
  const [tripTitle, setTripTitle] = useState("");
  const [tripLocation, setTripLocation] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [tripType, setTripType] = useState("solo");
  const [invitees, setInvitees] = useState([]);
  const [coverImage, setCoverImage] = useState(null);
  // const [tripId, settripId] = useState("");
  const [showStartDateModal, setShowStartDateModal] = useState(false);
  const [showEndDateModal, setShowEndDateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  const { user } = useContext(AuthContext);

  // console.log(user.uid);

  const pickImage = async () => {
    setIsLoading(true);
    // // Ask for permission to access the image library
    // const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    // if (status !== "granted") {
    //   alert("Sorry, we need camera roll permissions to make this work!");
    //   return;
    // }

    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    // console.log(coverImage);

    if (!result.canceled) {
      // setCoverImage(result.assets[0].uri);
      const uploadURL = await uploadImageAsync(result.assets[0].uri);
      setCoverImage(uploadURL);
      setInterval(() => {
        setIsLoading(false);
      }, 1000);

      delete result["cancelled"];
    } else {
      setCoverImage(null);
      setInterval(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  const uploadImageAsync = async (uri) => {
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
      const storageRef = ref(FIREBASE_STORAGE, `Images/image-${Date.now()}`);
      const result = await uploadBytes(storageRef, blob);
      blob.close();
      return await getDownloadURL(storageRef);
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  const onStartChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowStartDateModal(false);
    setStartDate(currentDate);
  };

  const onEndChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowEndDateModal(false);
    setEndDate(currentDate);
  };

  const showStartDatePicker = () => {
    setShowStartDateModal(true);
  };

  const showEndDatePicker = () => {
    setShowEndDateModal(true);
  };

  const saveTripDetails = async (userId, tripData) => {
    try {
      const q = query(
        collection(FIREBASE_DB, "users"),
        where("userId", "==", userId)
      );

      const querySnapshot = await getDocs(q);
      //create reference to this doc
      const userRef = doc(FIREBASE_DB, "users", querySnapshot.docs[0].id);

      // add trip to user's trips array
      // await addDoc(collection(userRef, "trips"), tripData);
      await addDoc(collection(userRef, "trips"), tripData);
    } catch (error) {
      // console.error("Error saving trip details:", error);
      Alert.alert("Error saving trip details:", error);
    }
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      setLoading(true);
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

      // await saveTripDetails(user.uid, tripData);

      await saveTripDetails(user.uid, tripData);

      Alert.alert("Trip details saved successfully!");

      navigation.navigate("TripPlan", {
        tripTitle: tripTitle,
        startDate: moment(startDate).format("DD MMM YYYY"),
        endDate: moment(endDate).format("DD MMM YYYY"),
        coverImage: coverImage,
        tripLocation: tripLocation,
        invitees: invitees,
        // Include any other parameters you need in the TripPlan screen
      });
    } catch (error) {
      console.error("Error saving trip details:", error);
    } finally {
      setLoading(false);
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

          {Platform.OS === "android" && (
            <Pressable onPress={showEndDatePicker}>
              <Text>End Date: </Text>
              <Text style={styles.input}>
                {moment(endDate).format("DD MMM YYYY")}
              </Text>
            </Pressable>
          )}

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
            <Button title="Upload Cover Image" onPress={pickImage} />
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
