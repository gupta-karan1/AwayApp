import React, { useCallback, useEffect, useState } from "react";
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
  ScrollView,
} from "react-native";
import { TextInput } from "react-native";
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
  updateDoc,
} from "firebase/firestore";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import uuid from "react-native-uuid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import moment from "moment";
import useDestinationFeed from "../../../hooks/useDestinationFeed";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import {
  SelectList,
  MultipleSelectList,
} from "react-native-dropdown-select-list";
import { Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import GlobalStyles from "../../GlobalStyles";
import { MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-root-toast";

// Component to render the Trip Form
const CreateTripForm = () => {
  // State variables to manage form data
  const [tripTitle, setTripTitle] = useState("");
  const [tripLocation, setTripLocation] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [tripType, setTripType] = useState("solo");
  const [invitees, setInvitees] = useState([]);
  const [coverImage, setCoverImage] = useState(
    "https://firebasestorage.googleapis.com/v0/b/away-app-31140.appspot.com/o/Images%2Fimage-placeholder.png?alt=media&token=5e36ae66-b8bc-47ab-af74-241d7875e43a"
  );
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showInviteesPicker, setShowInviteesPicker] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState();

  // State variables to manage date picker modal
  const [showStartDateModal, setShowStartDateModal] = useState(false);
  const [showEndDateModal, setShowEndDateModal] = useState(false);

  // State variables to manage loading indicator
  const [loading, setLoading] = useState(false);
  // State variables to manage image upload progress
  const [isLoading, setIsLoading] = useState(false);

  const [showInvitees, setShowInvitees] = useState(false);

  // Access navigation object from React Navigation
  const navigation = useNavigation();

  // Access user object from AuthContext to get user id
  const { user } = useContext(AuthContext);

  const { destinationData } = useDestinationFeed();

  // Fucntion to pick an image from image library
  const pickImage = async () => {
    setIsLoading(true); // Show loading image

    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      // mediaTypes: ImagePicker.MediaTypeOptions.All,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
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
      // if no cover image is selected, set the cover image to the destination.imageUrl
      if (tripLocation) {
        setCoverImage(
          destinationData.filter(
            (destination) => destination.destinationName === tripLocation
          )[0].imageUrl
        );
      } else {
        setCoverImage(
          "https://firebasestorage.googleapis.com/v0/b/away-app-31140.appspot.com/o/Images%2Fimage-placeholder.png?alt=media&token=5e36ae66-b8bc-47ab-af74-241d7875e43a"
        );
      }

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
      Alert.alert("Error saving trip details:", error.message);
    }
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      setLoading(true); // show loading indicator
      // Prepare the trip data object with the form inputs etc
      const tripData = {
        tripTitle: tripTitle || "Untitled Trip",
        tripLocation: tripLocation || "Amsterdam",
        startDate: startDate,
        endDate: endDate,
        tripType: tripType,
        invitees: invitees || [],
        coverImage: coverImage,
        userId: user.uid,
        tripId: uuid.v4(),
        createdAt: new Date(),
      };

      // Save the trip details to Firebase using the saveTripDetails function
      await saveTripDetails(user.uid, tripData);

      // Alert.alert("Trip details saved successfully!");
      Toast.show(`New Trip Created Successfully`, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM - 50,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: "#63725A",
      });

      navigation.navigate("Trips"); // navigate to trips screen after submitting form
    } catch (error) {
      // console.error("Error saving trip details:", error);
      Alert.alert("Error saving trip details:", error.message);
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
    } else {
      // getUsers();
      setShowInviteesPicker(true); // Show invitees picker when trip type is changed to group
    }
  };

  // function to update trip details via the same form using route params
  const handleUpdate = async () => {
    try {
      setLoading(true);
      const newTripData = {
        tripTitle: tripTitle || "Untitled Trip",
        tripLocation: tripLocation || "No Location",
        startDate: startDate,
        endDate: endDate,
        tripType: tripType,
        invitees: invitees,
        coverImage: coverImage,
        userId: user.uid,
        tripId: tripItem.tripId,
        createdAt: tripItem.createdAt,
      };

      const q = query(
        collection(FIREBASE_DB, "users"),
        where("userId", "==", user.uid)
      );

      const querySnapshot = await getDocs(q); // get user documents from user collection based on user id
      const userRef = doc(FIREBASE_DB, "users", querySnapshot.docs[0].id); //Create a reference to this user's document

      const q2 = query(
        collection(userRef, "trips"),
        where("tripId", "==", tripItem.tripId)
      );
      const querySnapshot2 = await getDocs(q2);
      const tripRef = doc(
        FIREBASE_DB,
        "users",
        querySnapshot.docs[0].id,
        "trips",
        querySnapshot2.docs[0].id
      );

      await updateDoc(tripRef, newTripData);

      // Alert.alert("Trip details updated successfully!");
      Toast.show(`Trip details updated successfully`, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM - 50,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: "#63725A",
      });

      navigation.navigate("Trips"); // navigate to trips screen after submitting form
    } catch (error) {
      Alert.alert("Error updating trip details:", error.message);
    } finally {
      setLoading(false); // set laoding state to flase after form submission
    }
  };

  const getUsers = async () => {
    try {
      const userId = user.uid;
      const q = query(collection(FIREBASE_DB, "users"));
      const querySnapshot = await getDocs(q);
      const users = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        // Only add users to the array if their ID is not the same as the logged-in user's ID
        if (userData.userId !== userId) {
          users.push(userData);
        }
      });
      setUsers(users);
    } catch (error) {
      Alert.alert("Error fetching users:", error.message);
    }
  };

  // Function to remove an invitee from the invitees array
  const removeInvitee = (invitee) => {
    setInvitees(invitees.filter((item) => item !== invitee));
  };

  // run the get Users function only when the showInviteesPicker state variable is true and the trip type is group
  useFocusEffect(
    useCallback(() => {
      if (showInviteesPicker == true && tripType === "group") {
        getUsers();
      }
    }, [showInviteesPicker, tripType])
  );

  const route = useRoute();
  const { tripItem } = route.params || {};
  useEffect(() => {
    if (tripItem) {
      setTripTitle(tripItem.tripTitle);
      setTripLocation(tripItem.tripLocation);
      setStartDate(tripItem.startDate.toDate());
      setEndDate(tripItem.endDate.toDate());
      setTripType(tripItem.tripType);
      setInvitees(tripItem.invitees);
      setCoverImage(tripItem.coverImage);

      navigation.setOptions({
        headerTitle: "Edit Trip",
      });
    }
  }, [tripItem]);

  // console.log(invitees);

  // const startDateObj = moment(startDate, "DD-MMM-YYYY").toDate();
  // const endDateObj = moment(endDate, "DD-MMM-YYYY").toDate();

  // console.log(invitees);

  return (
    <ScrollView style={{ backgroundColor: "#fff" }}>
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={[styles.titleText, GlobalStyles.bodySmallRegular]}>
            Trip Title:
          </Text>
          <TextInput
            label="Trip Title"
            value={tripTitle}
            onChangeText={(text) => setTripTitle(text)}
            style={[styles.input, GlobalStyles.bodySmallRegular]}
            placeholder="Trip Title"
          />
        </View>

        {/* <Picker
              // mode="dropdown"
              style={styles.picker}
              selectedValue={tripLocation}
              onValueChange={(itemValue, itemIndex) => {
                setTripLocation(itemValue);
                // set the cover image to the destination.imageUrl when the destination is selected
                // filter through the destinationData array to find the destination with the same destinationId as the selected destination
                if (itemValue) {
                  setCoverImage(
                    destinationData.filter(
                      (destination) => destination.destinationName === itemValue
                    )[0].imageUrl
                  );
                } else {
                  setCoverImage(null);
                }
              }}
            >
              {/* Render list of destinations in Picker */}
        {/* <Picker.Item label="Select a Location" value="" />
              {destinationData.map((destination) => (
                <Picker.Item
                  key={destination.destinationId}
                  label={destination.destinationName}
                  value={destination.destinationName}
                />
              ))}
            </Picker> */}

        <View style={styles.inputContainer}>
          <Text style={[styles.titleText, GlobalStyles.bodySmallRegular]}>
            Trip Location:
          </Text>
          <SelectList
            boxStyles={styles.boxStyles}
            inputStyles={styles.inputStyles}
            dropdownStyles={styles.dropdownStyles}
            fontFamily="Mulish-Regular"
            searchicon={<Feather name="search" size={18} color="#63725A" />}
            arrowicon={
              <Entypo name="chevron-small-down" size={20} color="#63725A" />
            }
            closeicon={<AntDesign name="close" size={20} color="#63725A" />}
            data={destinationData.map((destination) => ({
              key: destination.destinationId,
              value: destination.destinationName,
            }))}
            maxHeight={100}
            setSelected={(val) => {
              setTripLocation(val);
              if (val) {
                setCoverImage(
                  destinationData.filter(
                    (destination) => destination.destinationName === val
                  )[0].imageUrl
                );
              } else {
                setCoverImage(null);
              }
            }}
            save="value"
            placeholder="Search for a Location"
            searchPlaceholder="Search"
          />
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.dateWrapper}>
            {/* Start date picker for Android */}
            {Platform.OS === "android" && (
              <Pressable
                onPress={showStartDatePicker}
                style={styles.dateContainer}
              >
                <Text style={[styles.titleText, GlobalStyles.bodySmallRegular]}>
                  Start Date:{" "}
                </Text>
                <Text
                  style={[
                    styles.input,
                    styles.datePicker,
                    GlobalStyles.bodySmallRegular,
                  ]}
                >
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
                // minimumDate={startDate}
                // maximumDate={endDate}
              />
            )}

            {/* Start date picker for iOS */}
            {Platform.OS === "ios" && (
              <View>
                <Text style={[styles.titleText, GlobalStyles.bodySmallRegular]}>
                  Start Date
                </Text>
                <DateTimePicker
                  testID="dateTimePicker"
                  value={startDate}
                  mode={"date"}
                  onChange={onStartChange}
                  // minimumDate={startDate}
                />
              </View>
            )}

            {/* End date picker for Android */}
            {Platform.OS === "android" && (
              <Pressable
                onPress={showEndDatePicker}
                style={styles.dateContainer}
              >
                <Text style={[styles.titleText, GlobalStyles.bodySmallRegular]}>
                  End Date:
                </Text>
                <Text
                  style={[
                    styles.input,
                    styles.datePicker,
                    GlobalStyles.bodySmallRegular,
                  ]}
                >
                  {moment(endDate).format("DD MMM YYYY")}
                </Text>
              </Pressable>
            )}

            {/* End Date picker for iOS */}
            {Platform.OS === "ios" && (
              <View>
                <Text style={[styles.titleText, GlobalStyles.bodySmallRegular]}>
                  End Date
                </Text>
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
        </View>
        {/* Radio buttons for trip type selection */}

        <View style={styles.inputContainer}>
          <Text style={[styles.titleText, GlobalStyles.bodySmallRegular]}>
            Trip Type:
          </Text>
          <View style={styles.radioButtonContainer}>
            <TouchableOpacity
              style={[
                styles.radioButton,
                tripType === "solo" ? styles.radioButtonActive : null,
              ]}
              onPress={() => handleTripTypeChange("solo")}
            >
              <Text
                style={[styles.radioButtonText, GlobalStyles.bodySmallRegular]}
              >
                Solo Trip
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton,
                tripType === "group" ? styles.radioButtonActive : null,
              ]}
              onPress={() => handleTripTypeChange("group")}
            >
              <Text
                style={[styles.radioButtonText, GlobalStyles.bodySmallRegular]}
              >
                Group Trip
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {showInviteesPicker && tripType === "group" && (
          <View style={styles.inputContainer}>
            <Text style={[styles.titleText, GlobalStyles.bodySmallRegular]}>
              Invite a Tripmate:
            </Text>
            {/* <Picker
                style={styles.picker}
                selectedValue={selectedUser}
                onValueChange={(itemValue, itemIndex) => {
                  setSelectedUser(itemValue);
                  // Add the selected user to the selectedInvitees array
                  if (
                    itemValue &&
                    !invitees.some(
                      (invitee) => invitee.userId === itemValue.userId
                    )
                  ) {
                    setInvitees([...invitees, itemValue]);
                  }
                }}
              >
                <Picker.Item label="Select an invitee" value="" />
                {users.map((user) => (
                  <Picker.Item
                    key={user.userId}
                    label={`${user.username} (${user.email})`}
                    value={user}
                  />
                ))}
              </Picker> */}

            {/* <MultipleSelectList
                data={users.map((user) => ({
                  key: user.userId,
                  value: `${user.email}`,
                }))}
                setSelected={(selectedItems) => {
                  setSelectedUser(selectedItems);
                  // Update the invitees array with the selected users
                  // Add the selected user to the selectedInvitees array
                  if (
                    selectedItems &&
                    !invitees.some(
                      (invitee) => invitee.userId === selectedItems.userId
                    )
                  ) {
                    setInvitees([...invitees, selectedItems]);
                  }
                }}
                save="value"
                placeholder="Select invitees"
              /> */}

            <MultipleSelectList
              boxStyles={styles.boxStyles}
              inputStyles={styles.inputStyles}
              dropdownStyles={styles.dropdownStyles}
              disabledItemStyles={{ color: "#63725A" }}
              disabledTextStyles={{}}
              // checkBoxStyles={{ backgroundColor: "#E5E8E3" }}
              // disabledCheckBoxStyles={{
              //   backgroundColor: "#E5E8E3",
              // }}
              badgeStyles={{ backgroundColor: "#63725A" }}
              badgeTextStyles={{ color: "#E5E8E3" }}
              labelStyles={{ paddingLeft: 8 }}
              fontFamily="Mulish-Regular"
              searchicon={<Feather name="search" size={18} color="#63725A" />}
              arrowicon={
                <Entypo name="chevron-small-down" size={20} color="#63725A" />
              }
              closeicon={<AntDesign name="close" size={20} color="#63725A" />}
              data={users.map((user) => ({
                key: user.userId,
                value: user.email,
                // disabled: invitees.some((invitee) => invitee === user.email),
                disabled: tripItem
                  ? invitees.some((invitee) => invitee === user.email)
                  : false,
              }))}
              setSelected={(val) => {
                setInvitees(val);

                // if the selected user is not already in the invitees array, add the selected user to the invitees array
                // if (
                //   val &&
                //   !invitees.some((invitee) => invitee.userId === val.key)
                // ) {
                //   setInvitees([...invitees, val]);
                // }
              }}
              save="value"
              placeholder="Search for a user"
              label="Selected Users"
              notFoundText="No users found"
              searchPlaceholder="Search"
              // maxHeight={200}
            />

            {tripItem && (
              <View>
                <Pressable>
                  <Text
                    style={[styles.titleText, styles.deleteText]}
                    onPress={() => setShowInvitees(!showInvitees)}
                  >
                    {showInvitees ? "Hide" : "Delete"} Invitees
                  </Text>
                </Pressable>
                {showInvitees && (
                  <View style={styles.invitees}>
                    {invitees.map((invitee) => (
                      <View style={styles.inviteeText} key={invitee}>
                        <Text>{invitee}</Text>
                        <TouchableOpacity
                          onPress={() => removeInvitee(invitee)}
                        >
                          <Ionicons
                            name="ios-close"
                            size={24}
                            color="black"
                            style={styles.icon}
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {isLoading ? (
          <ActivityIndicator size="large" color="#63725A" />
        ) : (
          <View style={styles.inputContainer}>
            {/* <Button title="Upload Cover Image" onPress={pickImage} /> */}
            <Pressable onPress={pickImage} style={styles.imgContainer}>
              <Text style={[styles.titleText, GlobalStyles.bodySmallRegular]}>
                Cover Image:
              </Text>
              <MaterialIcons
                name="add-photo-alternate"
                size={32}
                color="#63725A"
              />
              {/* <Ionicons name="md-images-outline" size={24} color="#63725A" /> */}
            </Pressable>
            <Image source={{ uri: coverImage }} style={styles.image} />
          </View>
        )}
        {loading ? (
          <ActivityIndicator size="large" color="#63725A" />
        ) : (
          <Pressable
            style={styles.submitButton}
            onPress={tripItem ? handleUpdate : handleSubmit}
          >
            <Text
              style={[styles.saveButtonText, GlobalStyles.bodySmallRegular]}
            >
              {tripItem ? "Edit Trip" : "Add Trip"}
            </Text>
          </Pressable>
        )}
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  inputContainer: {
    marginBottom: 20,
    // borderWidth: 1,
    width: "100%",
  },
  input: {
    // backgroundColor: "#E5E8E3",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    // marginTop: 5,
    // marginBottom: 30,
    borderWidth: 1,
    // width: "100%",
    borderColor: "#63725A",
  },
  dateContainer: {
    // flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    // marginTop: 10,
    width: "48%",
  },
  radioButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    // marginBottom: 16,
    // marginTop: 5,
  },
  submitButton: {
    backgroundColor: "#63725A",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 50,
    alignItems: "center",
    // marginTop: 15,
  },
  saveButtonText: {
    color: "#EFFBB7",
  },
  // picker: {
  //   marginBottom: 30,
  //   backgroundColor: "#fff",
  //   borderRadius: 10,
  // },
  imgContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#63725A",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: "48%",
    justifyContent: "center",
    marginTop: 5,
  },
  radioButtonActive: {
    backgroundColor: "#E5E8E3",
  },
  radioButtonText: {
    color: "#63725A",
    // fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 180,
    backgroundColor: "lightgrey",
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  invitees: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 10,
    marginTop: 10,
  },
  inviteeText: {
    flexDirection: "row",
    backgroundColor: "#E5E8E3",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    paddingLeft: 5,
  },
  deleteText: {
    textDecorationLine: "underline",
    paddingBottom: 25,
    alignSelf: "flex-end",
  },
  titleText: {
    color: "#63725A",
    marginBottom: 5,
  },
  boxStyles: {
    color: "#63725A",
    borderColor: "#63725A",
    paddingHorizontal: 8,
  },
  inputStyles: {
    color: "#000",
    paddingLeft: 8,
  },
  dropdownStyles: {
    color: "#63725A",
    // marginBottom: 10,
  },
  datePicker: {
    width: "100%",
    alignItems: "center",
    // paddingHorizontal: 44,
    // color: "#63725A",
  },
  dateWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default CreateTripForm;

//SUMMARY: This code renders the trip form. It uses state variables to manage the form data. It also includes state variables like "showStartDateModal" and "showEndDateModal" to handle date picker modals and "loading" and "isLoading" to manage loading indicators for the image upload process. The component accesses the navigation object from React Navigation and the user object from the "AuthContext" using hooks. It allows users to pick an image from their device's image library using the "ImagePicker" library, upload the selected image to Firebase Storage, and set the coverImage state to the uploaded image's URL. Various functions are defined to handle changes in the date pickers, show or hide the date picker modals, save trip details to Firebase under the specific user, handle form submissions, and manage trip type changes (solo or group).
