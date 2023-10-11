import {
  StyleSheet,
  Text,
  View,
  Modal,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import GlobalStyles from "../../GlobalStyles";
import { Ionicons } from "@expo/vector-icons";
import { FIREBASE_DB } from "../../../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  orderBy,
  addDoc,
  setDoc,
} from "firebase/firestore";
import { useContext, useCallback, useEffect, useState } from "react";
import { AuthContext } from "../../../hooks/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import moment from "moment";
import Toast from "react-native-root-toast";

const AddPlaceModal = ({
  placeData,
  onClose,
  modalVisible,
  tripId,
  userRefId,
  startDate,
  endDate,
  setModalVisible,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [wishlistSelected, setWishlistSelected] = useState(false);

  const [datesDisabled, setDatesDisabled] = useState(false); // New state to disable selected dates
  const [wishlistDisabled, setWishlistDisabled] = useState(false); // New state to disable wishlist

  const [disabledDates, setDisabledDates] = useState([]);

  const Navigation = useNavigation();

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

  const { user } = useContext(AuthContext);

  //   const savePlaceDetails = async (placeData) => {
  //     try {
  //       const q = query(
  //         collection(FIREBASE_DB, "users"),
  //         where("userId", "==", userRefId)
  //       );

  //       const querySnapshot = await getDocs(q); // get user documents from user collection based on user id
  //       const userRef = doc(FIREBASE_DB, "users", querySnapshot.docs[0].id); //Create a reference to this user's document

  //       // create a trip reference to the trip document
  //       const q2 = query(
  //         collection(userRef, "trips"),
  //         where("tripId", "==", tripId)
  //       );
  //       const querySnapshot2 = await getDocs(q2);
  //       const tripRef = doc(userRef, "trips", querySnapshot2.docs[0].id);

  //       // Check if the place with the same placeId exists in the "saved" subcollection
  //       const placeId = singlePlaceData.placeId;
  //       const existingPlacesSnapshot = await getDocs(
  //         query(collection(tripRef, "saved"), where("placeId", "==", placeId))
  //       );

  //       if (!existingPlacesSnapshot.empty) {
  //         // Place with the same placeId already exists, throw an error
  //         throw new Error("Place is already in the wishlist.");
  //       }

  //       // If placeId is unique, add the place data to the "saved" sub-collection
  //       await addDoc(collection(tripRef, "saved"), placeData);

  //       Alert.alert(
  //         "Added to Wishlist",
  //         // "",
  //         [
  //           // {
  //           //   text: "Continue",
  //           //   onPress: () => {},
  //           //   style: "cancel",
  //           //   text: "Plan",
  //           //   onPress: () => {
  //           //     //navigate to the saved places screen
  //           //     navigation.navigate("Plan");
  //           //   },
  //           // },
  //           {
  //             text: "Continue",
  //             onPress: () => {},
  //             style: "cancel",
  //           },
  //         ],
  //         {
  //           cancelable: true,
  //           onDismiss: () => {},
  //         }
  //       );
  //     } catch (error) {
  //       Alert.alert("Error saving place details:", error.message);
  //     }
  //   };

  // Function to save the place
  //   const savePlace = async () => {
  //     try {
  //       setIsLoading(true); // show loading indicator
  //       // Prepare the place data object with the form inputs etc
  //       //   const placeData = {
  //       //     placeTitle: singlePlaceData.placeTitle || "",
  //       //     placeCategory: singlePlaceData.placeCategory || "",
  //       //     placeDescription: singlePlaceData.placeDescription || "",
  //       //     placeAddress: singlePlaceData.placeAddress || "",
  //       //     placeContact: singlePlaceData.placeContact || "",
  //       //     placeHours: singlePlaceData.placeHours || "",
  //       //     placeImage: singlePlaceData.placeImage || "",
  //       //     placeGoogleMapLink: singlePlaceData.placeGoogleMapLink || "",
  //       //     placeLongitude: singlePlaceData.placeLongitude || "",
  //       //     placeLatitude: singlePlaceData.placeLatitude || "",
  //       //     placeSaved: true,
  //       //     placeId: singlePlaceData.placeId,
  //       //     placeWebsite: singlePlaceData.placeWebsite || "",
  //       //     userId: user.uid,
  //       //     userName: user.displayName,
  //       //     createdAt: new Date(),
  //       //   };

  //       // Save the place details to Firebase using the savePlaceDetails function
  //       await savePlaceDetails(placeData);
  //     } catch (error) {
  //       Alert.alert("Error saving place details:", error.message);
  //     } finally {
  //       setIsLoading(false); // set loading state to false after form submission
  //     }
  //   };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const q = query(
        collection(FIREBASE_DB, "users"),
        where("userId", "==", userRefId)
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

      // Check if the place with the same placeId exists in the "saved" subcollection

      // if the wishlist option is selected
      if (wishlistSelected) {
        const placeId = placeData.placeId;

        const existingPlacesSnapshot = await getDocs(
          query(collection(tripRef, "saved"), where("placeId", "==", placeId))
        );

        // if (!existingPlacesSnapshot.empty) {
        //   // Place with the same placeId already exists, throw an error
        //   throw new Error("Place is already in the wishlist.");
        // }

        // If placeId is unique, add the place data to the "saved" sub-collection
        if (existingPlacesSnapshot.empty) {
          await addDoc(collection(tripRef, "saved"), placeData);
          // Alert.alert("Success", "Place added to the wishlist successfully!");
          Toast.show(`Place added to Wishlist`, {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM - 50,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            backgroundColor: "#63725A",
          });
        }
      }

      if (selectedDates.length > 0) {
        // if the itinerary option is selected

        for (let i = 0; i < selectedDates.length; i++) {
          //   const selectedDate = selectedDates[i];
          const selectedDate = formatDateString(selectedDates[i]);
          const placeId = placeData.placeId;
          const itineraryRef = collection(tripRef, "itinerary");

          const q2 = query(
            collection(tripRef, "itinerary"),
            where("date", "==", selectedDate)
          );

          const existingPlacesSnapshot = await getDocs(q2);

          if (!existingPlacesSnapshot.empty) {
            const existingDoc = existingPlacesSnapshot.docs[0];
            const existingData = existingDoc.data();

            const existingPlaces = existingData.places;

            const existingPlaceIds = existingPlaces?.map((place) => {
              return place.placeId;
            });

            if (existingPlaceIds.includes(placeId)) {
              // don't add the place to the itinerary if it already exists
              // don't throw an error
              // simply continue to the next iteration
              continue;
            }

            const updatedData = {
              ...existingData,
              places: [...existingPlaces, placeData],
            };

            await setDoc(existingDoc.ref, updatedData);
          } else {
            const itineraryData = {
              date: selectedDate,
              places: [placeData],
            };

            await addDoc(itineraryRef, itineraryData);
          }
        }
        // Alert.alert("Success", "Place added to the itinerary successfully!");
        Toast.show(`Place added to Itinerary`, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM - 50,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          backgroundColor: "#63725A",
        });
      }
    } catch (error) {
      Alert.alert("Error saving place details:", error.message);
    } finally {
      setIsLoading(false);
      setModalVisible(false);
    }
  };

  const handleSelection = () => {
    // Toggle the selection of the "Wishlist" item
    setWishlistSelected(!wishlistSelected);
  };

  const ChecklistDate = ({
    date,
    // isSelected,
    onToggleSelectionDate,
    // isDisabled,
    isSelected,
  }) => {
    const toggleCheckbox = () => {
      onToggleSelectionDate(date);
    };
    // const toggleCheckbox = () => {
    //   // if (!isDisabled) {
    //     onToggleSelectionDate(date);
    //   // }
    // };

    // const isSelected = selectedDates.includes(date);

    return (
      <TouchableOpacity
        onPress={toggleCheckbox}
        style={styles.checkContainer}
        // disabled={isDisabled} // Disable the date if disabled is true
      >
        <View
          style={[
            styles.checkbox,
            isSelected ? styles.checkboxSelected : styles.checkboxUnselected,
          ]}
        >
          {isSelected ? <Text style={styles.checkmark}>✓</Text> : null}
        </View>
        <Text style={[GlobalStyles.bodyMediumRegular, styles.checktext]}>
          {formatDateString(date)}
        </Text>
      </TouchableOpacity>
    );
  };

  // Function to toggle the selection of a place
  const toggleSelectionDate = (date) => {
    setSelectedDates((prevDate) => {
      return prevDate.some((d) => d === date)
        ? prevDate.filter((d) => d !== date)
        : [...prevDate, date];
    });
  };

  // Function to toggle the selection of a place
  // const toggleSelectionDate = (date) => {
  //   setSelectedDates((prevSelectedDates) => {
  //     if (prevSelectedDates.includes(date)) {
  //       // If date is already selected, remove it
  //       return prevSelectedDates.filter((d) => d !== date);
  //     } else {
  //       // If date is not selected, add it
  //       return [...prevSelectedDates, date];
  //     }
  //   });
  // };

  // Function to toggle the selection of a place
  // const toggleSelectionDate = (date) => {
  //   setSelectedDates((prevSelectedDates) => {
  //     if (prevSelectedDates.includes(date)) {
  //       // If date is already selected, remove it
  //       return prevSelectedDates.filter((d) => d !== date);
  //     } else {
  //       // If date is not selected, add it
  //       return [...prevSelectedDates, date];
  //     }
  //   });

  //   setDisabledDates((prevDisabledDates) => {
  //     if (prevDisabledDates.includes(date)) {
  //       // If date is already disabled, remove it
  //       return prevDisabledDates.filter((d) => d !== date);
  //     } else {
  //       // If date is not disabled, add it
  //       return [...prevDisabledDates, date];
  //     }
  //   });
  // };

  useEffect(() => {
    const checkIfPlaceIsInItinerary = async () => {
      try {
        // Initialize an array to store selected dates where the place is already in the itinerary
        const datesWithPlaceInItinerary = [];
        const q = query(
          collection(FIREBASE_DB, "users"),
          where("userId", "==", userRefId)
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

        // Check if the place with the same placeId exists in the "saved" subcollection

        const placeId = placeData.placeId;

        const existingPlacesSnapshot = await getDocs(
          query(collection(tripRef, "saved"), where("placeId", "==", placeId))
        );

        const isPlaceAlreadyInWishlist = existingPlacesSnapshot.docs.some(
          (doc) => doc.data().placeId === placeId
        );

        if (isPlaceAlreadyInWishlist) {
          // If the place is already in the wishlist, set wishlistSelected to true
          setWishlistSelected(true);

          // Disable the wishlist option
          setWishlistDisabled(true);
        }

        // Check if the place is already in the itinerary for the selected dates
        // Iterate through dateRange and check each date
        for (const date of dateRange) {
          const selectedDateString = formatDateString(date);
          const placeId = placeData.placeId;

          // Check if the place is already in the itinerary for the selected date

          const q5 = query(
            collection(tripRef, "itinerary"),
            where("date", "==", selectedDateString)
          );

          const existingPlacesSnapshot = await getDocs(q5);

          const isPlaceAlreadyInItinerary = existingPlacesSnapshot.docs.some(
            (doc) =>
              doc.data().places.some((place) => place.placeId === placeId)
          );

          if (isPlaceAlreadyInItinerary) {
            // If the place is already in the itinerary for this date, add the date to the array
            datesWithPlaceInItinerary.push(date.toISOString());
          }
        }

        // Update the selectedDates state with the dates where the place is in the itinerary
        setSelectedDates(datesWithPlaceInItinerary);

        if (datesWithPlaceInItinerary.length > 0) {
          setDatesDisabled(true); // Disable the date selection
        }
      } catch (error) {
        Alert.alert("Error checking itinerary:", error.message);
      }
    };

    // Call the function to check if the place is in the itinerary
    checkIfPlaceIsInItinerary();
  }, [modalVisible]);

  return (
    <Modal
      animationType="slide"
      visible={modalVisible}
      onRequestClose={onClose}
      //   style={styles.modal}
      presentationStyle="overFullScreen"
      transparent={true}
    >
      {/* <TouchableWithoutFeedback onPress={handleBackgroundPress}> */}
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={GlobalStyles.titleLargeRegular}>Save To</Text>
            <Ionicons
              name="ios-close"
              size={28}
              color="black"
              //   onPress={() => setModalVisible(false)}
              onPress={onClose}
            />
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.innerContainer}
          >
            {/* <Pressable onPress={handleSelection}>
              <Text>Wishlist</Text>
            </Pressable> */}
            <TouchableOpacity
              onPress={handleSelection}
              style={[
                styles.checkContainer,
                wishlistSelected ? styles.selectedContainer : null,
              ]}
              // disabled={wishlistDisabled} // Disable the wishlist option if wishlistDisabled is true
            >
              <View
                style={[
                  styles.checkbox,
                  wishlistSelected
                    ? styles.checkboxSelected
                    : styles.checkboxUnselected,
                ]}
              >
                {wishlistSelected ? (
                  <Text style={styles.checkmark}>✓</Text>
                ) : null}
              </View>
              <Text style={[GlobalStyles.bodyMediumRegular, styles.checktext]}>
                Wishlist
              </Text>
            </TouchableOpacity>

            <Text style={GlobalStyles.bodyMediumRegular}>Itinerary</Text>

            {dateRange &&
              dateRange.map((date) => (
                <ChecklistDate
                  key={date}
                  date={date.toISOString()}
                  isSelected={selectedDates.includes(date.toISOString())}
                  onToggleSelectionDate={toggleSelectionDate}
                  // disabled={datesDisabled} // Disable the date if datesDisabled is true
                  // isDisabled={disabledDates.includes(date.toISOString())} // Check if the date is in disabledDates
                />
              ))}
          </ScrollView>
          <View style={styles.modalFooter}>
            <Pressable
              style={styles.submitButton}
              onPress={() => {
                handleSubmit();
              }}
            >
              <Text
                style={[styles.saveButtonText, GlobalStyles.bodySmallRegular]}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#EFFBB7" />
                ) : (
                  "Save Place"
                )}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddPlaceModal;

const styles = StyleSheet.create({
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
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
    marginHorizontal: 10,
  },
  promptText: {
    textAlign: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: "center",
    borderColor: "lightgrey",
    borderWidth: 1,
    marginHorizontal: 90,
    marginVertical: 30,
    borderRadius: 100,
    marginTop: 10,
  },
  innerContainer: {
    width: "100%",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E5E8E3",
    borderRadius: 10,
    // marginTop: 10,
    padding: 20,
    marginVertical: 10,
    marginBottom: 20,
  },
  secondaryAction: {
    backgroundColor: "#fff",
    marginRight: 10,
    alignSelf: "flex-end",
  },
  buttonText: {
    color: "#63725A",
    textDecorationLine: "underline",
    paddingTop: 10,
  },
  submitButton: {
    backgroundColor: "#63725A",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 15,
  },
  saveButtonText: {
    color: "#EFFBB7",
  },
  modalFooter: {
    width: "100%",
  },
  // checklistItem: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   marginVertical: 5,
  // },
  checkbox: {
    width: 19,
    height: 19,
    borderWidth: 1.5,
    borderColor: "#63725A",
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    backgroundColor: "#E5E8E3",
  },
  checkboxSelected: {
    backgroundColor: "#63725A",
  },
  checkboxUnselected: {
    backgroundColor: "#E5E8E3",
  },
  checkmark: {
    color: "#fff",
    fontSize: 12,
  },
  checktext: {
    color: "#63725A",
  },
  checkContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#E5E8E3",
    borderRadius: 10,
    marginVertical: 5,
  },
});
