import {
  StyleSheet,
  Text,
  View,
  SectionList,
  Modal,
  Pressable,
  Alert,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useCallback } from "react";
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
import { FlatList, ScrollView } from "react-native-gesture-handler";
import SavedPlaceCard from "../../components/TripsComp/SavedPlaceCard";
import { Ionicons } from "@expo/vector-icons";
import GlobalStyles from "../../GlobalStyles";
import { useNavigation } from "@react-navigation/native";
import ViewMapModal from "./ViewMapModal";
import { useEffect } from "react";
import { useRoute } from "@react-navigation/native";

// import DraggableFlatList from "react-native-draggable-flatlist";
// import {
//   NestableScrollContainer,
//   NestableDraggableFlatList,
// } from "react-native-draggable-flatlist";

const Itinerary = () => {
  // State variables for modal visibility and selected place
  const route = useRoute();
  const { startDate, endDate, tripId, userId, invitees } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [tripReference, setTripReference] = useState("");
  const [savedPlaces, setSavedPlaces] = useState([]); // State to store saved places
  const [isLoading, setIsLoading] = useState(false); // State to show loading indicator
  const [itineraryData, setItineraryData] = useState({}); // state variable to store itinerary data
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [selectedMapDate, setSelectedMapDate] = useState("");
  const [selectedMapPlaces, setSelectedMapPlaces] = useState([]);

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
    return moment(date).format("ddd D MMM"); // change it to DD later
  };

  //   get saved places from firebase:

  const getSavedPlaces = async () => {
    try {
      setIsLoading(true); // show loading indicator
      const q = query(
        collection(FIREBASE_DB, "users"),
        where("userId", "==", userId)
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
        where("userId", "==", userId)
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
          {/* <View
            style={[
              styles.checkbox,
              isSelected ? styles.checkboxSelected : styles.checkboxUnselected,
            ]}
          >
            {isSelected ? <Text style={styles.checkmark}>✓</Text> : null}
          </View> */}
          <View style={isSelected ? styles.placeCardSelect : styles.placeCard}>
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
                numberOfLines={1}
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
  const Navigation = useNavigation();

  // Render checklist items as a FlatList inside the modal
  const renderChecklistItem = ({ item }) => (
    <ChecklistItem
      place={item}
      isSelected={selectedPlaces.includes(item)}
      onToggleSelection={toggleSelection}
    />
  );

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size={"large"} />}
      {/* {!loading && !itineraryData && ( */}
      {!loading &&
        Object.keys(itineraryData).every(
          (date) => itineraryData[date].length === 0
        ) && (
          <Pressable
            style={styles.emptyContainer}
            onPress={() =>
              Navigation.navigate("FindStack", {
                screen: "Find",
              })
            }
          >
            {/* <Text>Find places to build your Itinerary</Text> */}
            <Text style={[GlobalStyles.bodySmallRegular]}>
              Find places to create your Itinerary
            </Text>
            <Text style={styles.navText}>Go to Explore</Text>
          </Pressable>
        )}
      {mapModalVisible && (
        <ViewMapModal
          onClose={() => setMapModalVisible(false)}
          modalVisible={mapModalVisible}
          selectedMapDate={selectedMapDate}
          selectedMapPlaces={selectedMapPlaces}
        />
      )}
      {!loading && (
        <SectionList
          contentContainerStyle={styles.contentContainer}
          scrollEnabled={true}
          sections={dateRange.map((date) => ({
            title: formatDateString(date),
            data: itineraryData[formatDateString(date)] || [], // Use the itinerary data for each date
          }))}
          keyExtractor={(item, index) => index.toString()}
          // Performance Settings
          removeClippedSubviews={true} // Unmount components when outside of window
          initialNumToRender={3} // Reduce initial render amount
          maxToRenderPerBatch={3} // Reduce number in each render batch
          updateCellsBatchingPeriod={50} // Increase time between renders
          windowSize={2} // Reduce the window size
          // performance settings for section list

          renderItem={({ item, section }) => (
            <View style={styles.item}>
              <FlatList
                data={item["places"] || []}
                renderItem={({ item }) => (
                  <SavedPlaceCard
                    placeItem={item}
                    onDelete={() => confirmDelete(item, section)}
                  />
                )}
                keyExtractor={(item) => item.placeId}
                removeClippedSubviews={true} // Unmount components when outside of window
                initialNumToRender={5} // Reduce initial render amount
                maxToRenderPerBatch={5} // Reduce number in each render batch
                updateCellsBatchingPeriod={100} // Increase time between renders
                windowSize={2} // Reduce the window size
              />
            </View>
            // <DraggableFlatList
            //   data={item["places"] || []}
            //   renderItem={({ item, drag }) => (
            //     <SavedPlaceCard
            //       placeItem={item}
            //       onDelete={() => confirmDelete(item.placeId, section)}
            //       onDrag={drag} // Attach the drag function to the SavedPlaceCard component
            //     />
            //   )}
            //   keyExtractor={(item) => item.placeId}
            //   onDragEnd={({ data }) => {
            //     // Update the order of places in the state or Firebase here
            //     const updatedItineraryData = {
            //       ...itineraryData,
            //       [formatDateString(section.title)]: data, // Update the data for the specific date
            //     };
            //     setItineraryData(updatedItineraryData);
            //   }}
            // />
          )}
          stickySectionHeadersEnabled={true}
          renderSectionHeader={({ section: { title, data } }) => (
            <View style={styles.headerContainer}>
              <Text style={[styles.dateTitle, GlobalStyles.titleLargeRegular]}>
                {title}
              </Text>
              <View style={styles.buttonContainer}>
                {data.length > 0 && (
                  <TouchableOpacity
                    style={styles.mapButton}
                    title="Map"
                    onPress={() => {
                      setSelectedMapDate(title);
                      const selectedPlaces = data.map((item) => item.places);
                      setSelectedMapPlaces(selectedPlaces);
                      setMapModalVisible(true);
                    }}
                  >
                    {/* <Ionicons name="map-outline" size={22} color="#EFFBB7" /> */}
                    <Ionicons name="map-outline" size={22} color="#63725A" />
                    {/* <Text style={styles.buttonText}>Map</Text> */}
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.button}
                  title="Add Place"
                  onPress={() => {
                    setModalVisible(true);
                    setSelectedDate(title);
                  }}
                >
                  <Text
                    style={[styles.buttonText, GlobalStyles.bodySmallRegular]}
                  >
                    Add Place
                  </Text>
                </TouchableOpacity>
              </View>
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
              {savedPlaces.length === 0 && (
                // <Pressable
                //   style={styles.modalEmptyContainer}
                //   onPress={() =>
                //     Navigation.navigate("FindStack", {
                //       screen: "Find",
                //     })
                //   }
                // >
                <Pressable
                  style={styles.modalEmptyContainer}
                  onPress={() => {
                    setModalVisible(false); // Close the modal
                    Navigation.navigate("FindStack", {
                      screen: "Find",
                    });
                  }}
                >
                  <Text style={GlobalStyles.bodySmallRegular}>
                    Find places to create your Itinerary
                  </Text>
                  <Text style={[GlobalStyles.bodySmallRegular, styles.navText]}>
                    Go to Find
                  </Text>
                </Pressable>
              )}
              {savedPlaces.length > 0 && (
                <View>
                  <FlatList
                    data={savedPlaces}
                    renderItem={renderChecklistItem}
                    keyExtractor={(item) => item.placeId}
                    showsVerticalScrollIndicator={false}
                    removeClippedSubviews={true} // Unmount components when outside of window
                    initialNumToRender={5} // Reduce initial render amount
                    maxToRenderPerBatch={5} // Reduce number in each render batch
                    updateCellsBatchingPeriod={100} // Increase time between renders
                    windowSize={2} // Reduce the window size
                  />
                  <View>
                    <Pressable
                      style={styles.submitButton}
                      title="Save"
                      onPress={handleAddPlaceToItinerary}
                    >
                      <Text style={styles.submitText}>Add Place</Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default Itinerary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: 30,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  contentContainer: {
    paddingBottom: 80,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
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
    marginRight: 2,
  },
  dateTitle: {
    // fontSize: 20,
    padding: 10,
    paddingLeft: 0,
    width: "60%",
    // color: "#63725A",
  },
  headerContainer: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
    // width: "100%",
    alignItems: "flex-end",
    // alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 5,
    alignItems: "flex-end",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 5,
  },
  button: {
    // backgroundColor: "#63725A",
    backgroundColor: "#E5E8E3",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    justifyContent: "center",
  },
  mapButton: {
    backgroundColor: "#E5E8E3",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    flexDirection: "row",
    gap: 10,
  },
  buttonText: {
    // color: "#EFFBB7",
    color: "#63725A",
  },
  placeCard: {
    flexDirection: "row",
    // alignItems: "flex-start",
    alignItems: "center",
    marginVertical: 2,
    backgroundColor: "#F7F5F3",
    // width: "90%",
    justifyContent: "space-evenly",
    gap: 10,
    borderRadius: 10,
    paddingEnd: 15,
  },
  placeCardSelect: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
    backgroundColor: "#E5E8E3",
    // width: "90%",
    justifyContent: "space-evenly",
    gap: 10,
    borderRadius: 10,
    paddingEnd: 15,
    // elevation: 1,
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
    // width: "100%",
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
  submitButton: {
    backgroundColor: "#63725A",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 15,
    marginBottom: 40,
    // width: "100%",
  },
  submitText: {
    color: "#EFFBB7",
  },
  emptyContainer: {
    alignItems: "center",
    backgroundColor: "#E5E8E3",
    borderRadius: 10,
    marginHorizontal: 10,
    padding: 20,
    marginBottom: 20,
  },
  navText: {
    textDecorationLine: "underline",
    color: "#63725A",
  },
  modalEmptyContainer: {
    alignItems: "center",
    backgroundColor: "#E5E8E3",
    borderRadius: 10,
    marginHorizontal: 10,
    padding: 20,
    marginBottom: 20,
    width: "100%",
  },
});
