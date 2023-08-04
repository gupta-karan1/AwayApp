import {
  StyleSheet,
  Text,
  View,
  SectionList,
  Modal,
  Button,
  Pressable,
  Alert,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
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
  setDoc,
} from "firebase/firestore";
import { AuthContext } from "../../../hooks/AuthContext";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import SavedPlaceCard from "../../components/TripsComp/SavedPlaceCard";
import { Ionicons } from "@expo/vector-icons";
import GlobalStyles from "../../GlobalStyles";

const Itinerary = ({ startDate, endDate, tripId }) => {
  // State variables for modal visibility and selected place
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [tripReference, setTripReference] = useState("");
  const [savedPlaces, setSavedPlaces] = useState([]); // State to store saved places
  const [isLoading, setIsLoading] = useState(false); // State to show loading indicator
  const [itineraryData, setItineraryData] = useState({}); // state variable to store itinerary data
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  const formatDateString = (date) => {
    return moment(date).format("ddd Do MMM"); // change it to DD later
  };

  //   get saved places from firebase:
  // Access user object from AuthContext to get user id
  const { user } = useContext(AuthContext);
  const getSavedPlaces = async () => {
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

      setTripReference(tripRef); // set trip reference to state variable

      // get documents from the "saved" subcollection under specific user
      const q3 = query(
        collection(tripRef, "saved"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot3 = await getDocs(q3);
      const saved = querySnapshot3.docs.map((doc) => doc.data());

      setSavedPlaces(saved);
    } catch (error) {
      Alert.alert("Error getting places:", error.message);
    } finally {
      setIsLoading(false); // set loading state to false after form submission
    }
  };

  const getItineraryData = async () => {
    try {
      setLoading(true);
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

      const itineraryData = {}; // Create an object to store the itinerary data for each date

      // Loop through each date in the date range and fetch the itinerary data for that date
      for (const date of dateRange) {
        const formattedDate = formatDateString(date);

        const q4 = query(
          collection(tripRef, "itinerary"),
          where("date", "==", formattedDate)
        );
        const querySnapshot4 = await getDocs(q4);
        const itineraryForDate = querySnapshot4.docs.map((doc) => doc.data());

        itineraryData[formattedDate] = itineraryForDate;
      }

      setItineraryData(itineraryData);
    } catch (error) {
      Alert.alert("Error getting places:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const ChecklistItem = ({ place, isSelected, onToggleSelection }) => {
    const toggleCheckbox = () => {
      onToggleSelection(place);
    };

    return (
      <TouchableOpacity onPress={toggleCheckbox}>
        <View style={styles.checklistItem}>
          <View
            style={[
              styles.checkbox,
              isSelected ? styles.checkboxSelected : styles.checkboxUnselected,
            ]}
          >
            {isSelected ? <Text style={styles.checkmark}>✓</Text> : null}
          </View>
          <View style={styles.placeCard}>
            <Image source={{ uri: place.placeImage }} style={styles.image} />
            <View style={styles.textContainer}>
              <Text
                style={[styles.checklistText, GlobalStyles.labelMediumMedium]}
                numberOfLines={1}
              >
                {place.placeCategory}
              </Text>
              <Text
                style={[styles.checklistText, GlobalStyles.bodyMediumBold]}
                numberOfLines={3}
              >
                {place.placeTitle}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Function to toggle the selection of a place
  const toggleSelection = (place) => {
    // setSelectedPlaces used to update current array
    setSelectedPlaces((prevSelectedPlace) =>
      // some method to check if place with same placeId already exists in prevSelectedPlace array
      prevSelectedPlace.some((p) => p.placeId === place.placeId)
        ? //If place exists removed with filter function
          prevSelectedPlace.filter((p) => p.placeId !== place.placeId)
        : // Otherwise adds place to array using spread operator
          [...prevSelectedPlace, place]
    );
  };

  // Runs when submit selected, adds places to itinerary in Firebase
  const handleAddPlaceToItinerary = async () => {
    try {
      if (!tripReference) {
        Alert.alert.error("Trip reference not available.");
        return;
      }

      // Check if at least one place is selected before proceeding
      if (selectedPlaces.length === 0) {
        Alert.alert(
          "Error",
          "Please select at least one place before submitting."
        );
        return;
      }

      const itineraryRef = collection(tripReference, "itinerary");

      //  Check if a document with the selected date already exists in the "itinerary" collection
      const q = query(itineraryRef, where("date", "==", selectedDate));

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Document with the selected date already exists, update it with the new place data
        const existingDoc = querySnapshot.docs[0];
        const existingData = existingDoc.data();

        // Merge only the unique places from existingData.places and selectedPlaces
        const mergedPlaces = [
          ...existingData.places,
          ...selectedPlaces.filter(
            (selectedPlace) =>
              !existingData.places.some(
                (existingPlace) =>
                  existingPlace.placeId === selectedPlace.placeId
              )
          ),
        ];

        if (
          mergedPlaces.length === existingData.places.length && // If the merged array has the same length as the existing array
          mergedPlaces.every((place) =>
            existingData.places.some(
              (existingPlace) => existingPlace.placeId === place.placeId
            )
          )
        ) {
          // If all selected places are duplicates, show an error message
          throw new Error("All selected places are duplicates.");
        }

        const updatedData = {
          ...existingData,
          places: mergedPlaces,
        };

        await setDoc(existingDoc.ref, updatedData);
        Alert.alert("Success", "Place added to the itinerary successfully!");
      } else {
        // Document with the selected date doesn't exist, create a new document
        const itineraryData = {
          date: selectedDate,
          places: selectedPlaces, // Convert selectedPlace to an array
        };
        await addDoc(itineraryRef, itineraryData);
        console.log(itineraryData);

        Alert.alert("Success", "Place added to the itinerary successfully!");
      }

      // Clear the selected place
      setSelectedPlaces([]);
    } catch (error) {
      Alert.alert("Error adding place to itinerary:", error.message);
    } finally {
      setModalVisible(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!modalVisible) {
        getSavedPlaces();
      }
      if (!deleteLoading) {
        getItineraryData();
      }
    }, [modalVisible, deleteLoading]) // Function only called once
  );

  const confirmDelete = (item, section) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this place?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => handleDeletePlaceItem(item.placeId, section.title),
        },
      ]
    );
  };

  const handleDeletePlaceItem = async (placeId, date) => {
    try {
      setDeleteLoading(true);
      if (!tripReference) {
        Alert.alert("Trip reference not available.");
        return;
      }

      // Create a reference to the specific date within the itinerary
      const q4 = query(
        collection(tripReference, "itinerary"),
        where("date", "==", date)
      );
      const querySnapshot4 = await getDocs(q4);
      const itineraryForDate = querySnapshot4.docs.map((doc) => doc.data());

      if (itineraryForDate.length > 0) {
        // If the itinerary data exists for the specific date
        const existingData = itineraryForDate[0];
        const updatedPlaces = existingData.places.filter(
          (place) => place.placeId !== placeId
        );

        // Update the places array with the filtered array
        const updatedData = {
          ...existingData,
          places: updatedPlaces,
        };

        // Set the updated itinerary data back to the document
        await setDoc(querySnapshot4.docs[0].ref, updatedData);

        Alert.alert("Success", "Place removed from the itinerary!");
      }
    } catch (error) {
      Alert.alert("Error deleting place:", error.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <View>
      {loading && <ActivityIndicator size={"large"} />}
      {!loading && (
        <SectionList
          contentContainerStyle={styles.contentContainer}
          scrollEnabled={true}
          sections={dateRange.map((date) => ({
            title: formatDateString(date),
            data: itineraryData[formatDateString(date)] || [], // Use the itinerary data for each date
          }))}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, section }) => (
            <View style={styles.item}>
              <FlatList
                // contentContainerStyle={{
                //   marginBottom: 60,
                // }}
                data={item["places"] || []}
                renderItem={({ item }) => (
                  <SavedPlaceCard
                    placeItem={item}
                    // onDelete={() =>
                    //   handleDeletePlaceItem(item.placeId, section.title)
                    // }
                    onDelete={() => confirmDelete(item, section)}
                  />
                )}
                keyExtractor={(item) => item.placeId}
              />
            </View>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.headerContainer}>
              <Text style={[styles.dateTitle, GlobalStyles.titleLargeRegular]}>
                {title}
              </Text>

              <TouchableOpacity
                style={styles.button}
                title="Add Place"
                onPress={() => {
                  setModalVisible(true);
                  setSelectedDate(title);
                }}
              >
                <Text>Add Place</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {tripReference && ( // Show the modal content only when tripReference is available
        <Modal
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          //   style={styles.modal}
          presentationStyle="overFullScreen"
          transparent={true}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalText}>Add to: {selectedDate}</Text>
                <Ionicons
                  name="ios-close"
                  size={30}
                  color="black"
                  onPress={() => setModalVisible(false)}
                />
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                {isLoading && <ActivityIndicator size={"large"} />}
                {savedPlaces.length === 0 && !isLoading && (
                  <Text>
                    You have no saved places. Go to the Find section to add
                    places.
                  </Text>
                )}

                {!isLoading &&
                  savedPlaces.length > 0 &&
                  savedPlaces.map((place) => (
                    <ChecklistItem
                      key={place.placeId}
                      place={place}
                      isSelected={selectedPlaces.includes(place)}
                      onToggleSelection={toggleSelection}
                    />
                  ))}
                <Pressable
                  style={styles.submitButton}
                  title="Submit"
                  onPress={handleAddPlaceToItinerary}
                >
                  <Text>Submit</Text>
                </Pressable>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default Itinerary;

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 100,
    paddingHorizontal: 15,
    // paddingTop: 15,
  },
  checklistItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkboxSelected: {
    backgroundColor: "#007bff",
  },
  checkboxUnselected: {
    backgroundColor: "#fff",
  },
  checkmark: {
    color: "#fff",
    fontSize: 18,
  },
  textContainer: {
    flex: 1,
  },
  checklistText: {
    fontSize: 16,
    marginBottom: 2,
  },
  dateTitle: {
    // fontSize: 20,
    padding: 10,
    paddingLeft: 0,
    width: "60%",
  },
  headerContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    backgroundColor: "lightblue",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: "lightblue",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 30,
  },
  placeCard: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    backgroundColor: "lightgrey",
    width: "90%",
    justifyContent: "space-evenly",
    gap: 10,
    borderRadius: 10,
  },
  image: {
    width: "35%",
    height: 80,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    width: "100%",
  },
  modalView: {
    backgroundColor: "#fff",
    height: "90%",
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
  modalText: {
    fontSize: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
    marginHorizontal: 10,
  },
});