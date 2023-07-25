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
import moment from "moment/moment";
import { Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useContext } from "react";
import { AuthContext } from "../../../hooks/AuthContext";
import { FIREBASE_DB } from "../../../firebaseConfig";
import {
  collection,
  addDoc,
  doc,
  query,
  getDoc,
  where,
  getDocs,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const CreateTripForm = () => {
  const [tripTitle, setTripTitle] = useState("");
  const [tripLocation, setTripLocation] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [tripType, setTripType] = useState("solo");
  const [invitees, setInvitees] = useState([]);
  const [coverImage, setCoverImage] = useState(null);
  const [showStartDateModal, setShowStartDateModal] = useState(false);
  const [showEndDateModal, setShowEndDateModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const { user } = useContext(AuthContext);

  // console.log(user.uid);

  const pickImage = async () => {
    // Ask for permission to access the image library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    // console.log(coverImage);

    if (!result.canceled) {
      setCoverImage(result.assets[0].uri);

      delete result["cancelled"];
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
      };

      await saveTripDetails(user.uid, tripData);

      Alert.alert("Trip details saved successfully!");

      navigation.navigate("TripPlan");
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
        <View>
          <Button
            title="Select an image from camera roll"
            onPress={pickImage}
          />
          {coverImage && (
            <Image source={{ uri: coverImage }} style={styles.image} />
          )}
        </View>

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
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    marginTop: 16,
  },
  radioButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  radioButton: {
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
  },
});

export default CreateTripForm;
