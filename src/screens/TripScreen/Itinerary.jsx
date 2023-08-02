import {
  StyleSheet,
  Text,
  View,
  SectionList,
  Modal,
  Button,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
// import CheckBox from "@react-native-community/checkbox";
import Checkbox from "expo-checkbox";
import React, { useEffect, useContext } from "react";
import moment from "moment";
import { useState } from "react";
import { FIREBASE_DB } from "../../../firebaseConfig";
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
} from "firebase/firestore";
import { FlatList } from "react-native-gesture-handler";
import { AuthContext } from "../../../hooks/AuthContext";

const Itinerary = ({ startDate, endDate, tripId }) => {
  // State variables for modal visibility and selected place
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedPlace, setSelectedPlace] = useState([]);
  const [tripReference, setTripReference] = useState("");
  const [savedPlaces, setSavedPlaces] = useState([]); // State to store saved places
  const [isLoading, setIsLoading] = useState(false); // State to show loading indicator

  // Access user object from AuthContext to get user id
  const { user } = useContext(AuthContext);

  // Parse startDate and endDate strings using Moment.js
  const startDateObj = moment(startDate, "DD-MMM-YYYY").toDate();
  const endDateObj = moment(endDate, "DD-MMM-YYYY").toDate();

  const generateDateRange = (start, end) => {
    const dates = [];
    let currentDate = moment(start);

    while (currentDate <= end) {
      dates.push(currentDate.toDate());
      currentDate.add(1, "days");
    }

    return dates;
  };

  const dateRange = generateDateRange(startDateObj, endDateObj);
  // console.log(dateRange);

  const formatDateString = (date) => {
    return moment(date).format("ddd Do MMM"); // change it to DD later
  };

  const getPlaces = async () => {
    try {
      setIsLoading(true); // show loading indicator
      const q = query(
        collection(FIREBASE_DB, "users"),
        where("userId", "==", user.uid)
      );

      const querySnapshot = await getDocs(q); // get user documents from user collection based on user id
      const userRef = doc(FIREBASE_DB, "users", querySnapshot.docs[0].id); //Create a reference to this user's document

      // create a trip reference to the trip document
      const q2 = query(
        collection(userRef, "trips"),
        where("tripId", "==", tripId)
      );
      const querySnapshot2 = await getDocs(q2);
      const tripRef = doc(userRef, "trips", querySnapshot2.docs[0].id);

      setTripReference(tripRef);

      // get documents from the "saved" subcollection under specific user
      const q3 = query(
        collection(tripRef, "saved"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot3 = await getDocs(q3);
      const saved = querySnapshot3.docs.map((doc) => doc.data());

      setSavedPlaces(saved);

      // Add the place data to the "saved" subcollection under specific user
    } catch (error) {
      Alert.alert("Error getting places:", error.message);
    } finally {
      setIsLoading(false); // set loading state to false after form submission
    }
  };

  useEffect(() => {
    getPlaces();
  }, [modalVisible]);

  // Function to handle adding the selected place to the itinerary
  const handleAddPlaceToItinerary = async () => {
    try {
      if (!tripReference) {
        console.error("Trip reference not available.");
        return;
      }

      // Check if at least one place is selected before proceeding
      if (selectedPlace.length === 0) {
        Alert.alert(
          "Error",
          "Please select at least one place before submitting."
        );
        return;
      }
      const itineraryRef = collection(tripReference, "itinerary");

      // Check if a document with the selected date already exists in the "itinerary" collection
      const q = query(itineraryRef, where("date", "==", selectedDate));

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Document with the selected date already exists, update it with the new place data
        const existingDoc = querySnapshot.docs[0];
        const existingData = existingDoc.data();

        // // Merge the existing place array with the new selectedPlace array
        const updatedData = {
          ...existingData,
          places: [...existingData.places, ...selectedPlace], // Merge the two arrays
        };
        // const updatedData = {
        //   ...existingData,
        //   places: { ...existingData.places, ...selectedPlace }, // Merge the two maps
        // };

        await doc(itineraryRef, existingDoc.id).update(updatedData);
      } else {
        // Document with the selected date doesn't exist, create a new document
        const itineraryData = {
          date: selectedDate,
          places: selectedPlace, // Convert selectedPlace to an array
        };
        await addDoc(itineraryRef, itineraryData);
      }
      console.log("Place added to the itinerary successfully!");

      // Clear the selected place
      setSelectedPlace([]);

      // setModalVisible(false); // Close the modal after adding the place
    } catch (error) {
      console.error("Error adding place to itinerary: ", error);
    }
  };

  const ChecklistItem = ({ place, isSelected, onToggleSelection }) => {
    return (
      <View style={styles.checklistItem}>
        <Checkbox
          value={isSelected}
          onValueChange={() => onToggleSelection(place.placeId)}
          style={styles.checkbox}
        />
        <Text style={styles.checklistText}>{place.placeTitle}</Text>
      </View>
    );
  };

  // // Function to toggle the selection of a place
  // const toggleSelection = (placeId) => {
  //   setSelectedPlace((prevSelectedPlace) =>
  //     prevSelectedPlace.includes(placeId)
  //       ? prevSelectedPlace.filter((id) => id !== placeId)
  //       : [...prevSelectedPlace, placeId]
  //   );
  // };

  // Function to toggle the selection of a place
  const toggleSelection = (place) => {
    // Modify to toggle based on the place object
    setSelectedPlace((prevSelectedPlace) =>
      prevSelectedPlace.some((p) => p.placeId === place.placeId)
        ? prevSelectedPlace.filter((p) => p.placeId !== place.placeId)
        : [...prevSelectedPlace, place]
    );
  };

  return (
    <View style={styles.container}>
      {/* Section List for Itinerary */}
      <SectionList
        sections={dateRange.map((date) => ({
          title: formatDateString(date),
          data: [],
        }))}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.placeTitle}</Text>{" "}
            {/* Display added places for the date */}
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View>
            <Text>{title}</Text>
            <Button
              title="Add Place"
              disabled={!tripReference} // Disable the button until the tripReference is fetched
              onPress={() => {
                setModalVisible(true);
                setSelectedDate(title);
              }}
            />
          </View>
        )}
      />

      {/* Modal for selecting and adding saved places */}
      {tripReference && ( // Show the modal content only when tripReference is available
        <Modal
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <Text>Select a Saved Place</Text>

          {/* Display the list of saved places as a checklist */}
          {savedPlaces.map((place) => (
            <ChecklistItem
              key={place.placeId}
              place={place}
              isSelected={selectedPlace.includes(place.placeId)}
              onToggleSelection={toggleSelection}
            />
          ))}

          <Button title="Cancel" onPress={() => setModalVisible(false)} />
          <Button title="Submit" onPress={handleAddPlaceToItinerary} />
        </Modal>
      )}
    </View>
  );
};

export default Itinerary;

const styles = StyleSheet.create({});
