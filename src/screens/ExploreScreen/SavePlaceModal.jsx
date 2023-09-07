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
} from "firebase/firestore";
import { useContext, useCallback, useEffect, useState } from "react";
import { AuthContext } from "../../../hooks/AuthContext";
import { useFocusEffect } from "@react-navigation/native";

const SavePlaceModal = ({ placeData, onClose, modalVisible }) => {
  const {
    placeAddress,
    placeCategory,
    placeContact,
    placeDescription,
    placeGoogleMapLink,
    placeHours,
    placeImage,
    placeLatitude,
    placeLongitude,
    placeSaved,
    placeTitle,
    placeWebsite,
    pathId,
    placeId,
  } = placeData;

  //   const route = useRoute();
  //   const {
  //     placeAddress,
  //     placeCategory,
  //     placeContact,
  //     placeDescription,
  //     placeGoogleMapLink,
  //     placeHours,
  //     placeImage,
  //     placeLatitude,
  //     placeLongitude,
  //     placeSaved,
  //     placeTitle,
  //     placeWebsite,
  //     pathId,
  //     placeId,
  //   } = route.params;
  const { user } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(true);
  //   const [modalVisible, setModalVisible] = useState(true);
  const [travelBoards, setTravelBoards] = useState([]);
  const [selectedBoards, setSelectedBoards] = useState([]);
  const [userTrips, setUserTrips] = useState([]);
  const [selectedTrips, setSelectedTrips] = useState([]);

  const Navigation = useNavigation();

  // const handleSubmit = async () => {
  //   try {
  //     setIsLoading(true);

  //     const q = query(
  //       collection(FIREBASE_DB, "users"),
  //       where("userId", "==", user.uid)
  //     );

  //     const querySnapshot = await getDocs(q); // get user documents from user collection based on user id
  //     const userRef = doc(FIREBASE_DB, "users", querySnapshot.docs[0].id); //Create a reference to this user's document

  //     // run a for loop to add the place to the places collection within all the selected boards
  //     for (let i = 0; i < selectedBoards.length; i++) {
  //       const q2 = query(
  //         collection(userRef, "boards"),
  //         where("boardId", "==", selectedBoards[i].boardId)
  //       );
  //       const querySnapshot2 = await getDocs(q2); // Get the travelBoards documents
  //       // check if the board already has the place saved
  //       const boardRef = doc(userRef, "boards", querySnapshot2.docs[0].id); //Create a reference to this board's document
  //       const q3 = query(
  //         collection(boardRef, "places"),
  //         where("placeId", "==", placeId)
  //       );

  //       const singlePlaceData = {
  //         placeAddress,
  //         placeCategory,
  //         placeContact,
  //         placeDescription,
  //         placeGoogleMapLink,
  //         placeHours,
  //         placeImage,
  //         placeLatitude,
  //         placeLongitude,
  //         placeSaved,
  //         placeTitle,
  //         placeWebsite,
  //         placeId,
  //       };

  //       const querySnapshot3 = await getDocs(q3); // Get the travelBoards documents
  //       if (querySnapshot3.docs.length === 0) {
  //         await addDoc(collection(boardRef, "places"), singlePlaceData);
  //         Alert.alert("Place saved successfully");
  //       } else {
  //         Alert.alert(
  //           "Place already saved",
  //           "This place already exists in the selected board."
  //         );
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     Alert.alert("Error saving place", error.message);
  //   } finally {
  //     setIsLoading(false);
  //     //   setModalVisible(false);
  //     onClose();
  //   }
  // };

  const getTravelBoards = async () => {
    try {
      setIsLoading(true); // show loading indicator
      const q = query(
        collection(FIREBASE_DB, "users"),
        where("userId", "==", user.uid)
      );

      const querySnapshot = await getDocs(q); // get user documents from user collection based on user id
      const userRef = doc(FIREBASE_DB, "users", querySnapshot.docs[0].id); //Create a reference to this user's document

      const q2 = query(
        collection(userRef, "boards"),
        orderBy("createdAt", "desc")
      ); // Create a query to get all travelBoards for this user

      const querySnapshot2 = await getDocs(q2); // Get the travelBoards documents

      const travelBoards = querySnapshot2.docs.map((doc) => doc.data()); // Get the data from each document

      setTravelBoards(travelBoards); // Set the travelBoards state variable
    } catch (error) {
      Alert.alert("Error fetching travel boards:", error.message);
      console.log(error);
    } finally {
      setIsLoading(false); // hide loading indicator
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const q = query(
        collection(FIREBASE_DB, "users"),
        where("userId", "==", user.uid)
      );

      const querySnapshot = await getDocs(q); // get user documents from user collection based on user id
      const userRef = doc(FIREBASE_DB, "users", querySnapshot.docs[0].id); //Create a reference to this user's document

      // Loop through the selected boards
      for (let i = 0; i < selectedBoards.length; i++) {
        const selectedBoard = selectedBoards[i];

        const q2 = query(
          collection(userRef, "boards"),
          where("boardId", "==", selectedBoard.boardId)
        );

        const querySnapshot2 = await getDocs(q2); // Get the travelBoards documents
        const boardRef = doc(userRef, "boards", querySnapshot2.docs[0].id); //Create a reference to this board's document

        const q3 = query(
          collection(boardRef, "places"),
          where("placeId", "==", placeId)
        );

        const querySnapshot3 = await getDocs(q3);

        const singlePlaceData = {
          placeAddress,
          placeCategory,
          placeContact,
          placeDescription,
          placeGoogleMapLink,
          placeHours,
          placeImage,
          placeLatitude,
          placeLongitude,
          placeSaved,
          placeTitle,
          placeWebsite,
          placeId,
          createdAt: new Date(),
          userId: user.uid,
          userName: user.displayName,
        };

        if (querySnapshot3.docs.length === 0) {
          // If the place is not already saved in the board, add it
          await addDoc(collection(boardRef, "places"), singlePlaceData);
          // Alert.alert("Place saved successfully");
        } else {
          Alert.alert(
            "Place already saved",
            "This place already exists in the selected board(s)."
          );
        }
      }

      // Loop through the selected trips
      for (let j = 0; j < selectedTrips.length; j++) {
        const selectedTrip = selectedTrips[j];

        const q4 = query(
          collection(userRef, "trips"),
          where("tripId", "==", selectedTrip.tripId)
        );

        const querySnapshot4 = await getDocs(q4); // Get the travelBoards documents

        const tripRef = doc(userRef, "trips", querySnapshot4.docs[0].id); //Create a reference to this trip's document

        const q5 = query(
          collection(tripRef, "saved"),
          where("placeId", "==", placeId)
        );

        const querySnapshot5 = await getDocs(q5);

        const singlePlaceData = {
          placeAddress,
          placeCategory,
          placeContact,
          placeDescription,
          placeGoogleMapLink,
          placeHours,
          placeImage,
          placeLatitude,
          placeLongitude,
          placeSaved,
          placeTitle,
          placeWebsite,
          placeId,
          createdAt: new Date(),
          userId: user.uid,
          userName: user.displayName,
        };

        if (querySnapshot5.docs.length === 0) {
          // If the place is not already saved in the trip, add it
          await addDoc(collection(tripRef, "saved"), singlePlaceData);
          // Alert.alert("Place saved successfully to the selected trips");
        } else {
          Alert.alert(
            "Place already saved",
            "This place already exists in the selected trip(s)."
          );
        }
      }

      Alert.alert("Place saved successfully");
    } catch (error) {
      console.log(error);
      Alert.alert("Error saving place", error.message);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  const getUserTrips = async () => {
    try {
      setIsLoading(true); // show loading indicator
      const q = query(
        collection(FIREBASE_DB, "users"),
        where("userId", "==", user.uid)
      );

      const querySnapshot = await getDocs(q); // get user documents from user collection based on user id

      const userRef = doc(FIREBASE_DB, "users", querySnapshot.docs[0].id); //Create a reference to this user's document

      const q2 = query(
        collection(userRef, "trips"),
        orderBy("createdAt", "desc")
      ); // Create a query to get all travelBoards for this user

      const querySnapshot2 = await getDocs(q2); // Get the travelBoards documents

      const userTrips = querySnapshot2.docs.map((doc) => doc.data()); // Get the data from each document

      setUserTrips(userTrips); // Set the travelBoards state variable
    } catch (error) {
      Alert.alert("Error fetching trips:", error.message);
      console.log(error);
    } finally {
      setIsLoading(false); // hide loading indicator
    }
  };

  const ChecklistBoard = ({ board, isSelected, onToggleSelectionBoard }) => {
    const toggleCheckbox = () => {
      onToggleSelectionBoard(board);
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
            <View style={styles.checkTextContainer}>
              <Text style={[styles.checklistText]} numberOfLines={3}>
                {board.title}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const ChecklistTrip = ({ trip, isSelected, onToggleSelectionTrip }) => {
    const toggleCheckbox = () => {
      onToggleSelectionTrip(trip);
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
            <View style={styles.checkTextContainer}>
              <Text style={[styles.checklistText]} numberOfLines={3}>
                {trip.tripTitle}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Function to toggle the selection of a place
  const toggleSelectionBoard = (board) => {
    // setSelectedPlaces used to update current array
    setSelectedBoards((prevSelectedBoard) =>
      // some method to check if place with same placeId already exists in prevSelectedPlace array
      prevSelectedBoard.some((b) => b.boardId === board.boardId)
        ? //If place exists removed with filter function
          prevSelectedBoard.filter((b) => b.boardId !== board.boardId)
        : // Otherwise adds place to array using spread operator
          [...prevSelectedBoard, board]
    );
  };

  // Function to toggle the selection of a place
  const toggleSelectionTrip = (trip) => {
    // setSelectedPlaces used to update current array
    setSelectedTrips((prevSelectedTrip) =>
      // some method to check if place with same placeId already exists in prevSelectedPlace array
      prevSelectedTrip.some((t) => t.tripId === trip.tripId)
        ? //If place exists removed with filter function
          prevSelectedTrip.filter((t) => t.tripId !== trip.tripId)
        : // Otherwise adds place to array using spread operator
          [...prevSelectedTrip, trip]
    );
  };

  useFocusEffect(
    useCallback(() => {
      if (modalVisible) {
        getTravelBoards();
        getUserTrips();

        // getMyTrips();
      }
    }, [modalVisible]) // Function only called once
  );

  return (
    <Modal
      animationType="slide"
      visible={modalVisible}
      onRequestClose={onClose}
      //   style={styles.modal}
      presentationStyle="overFullScreen"
      transparent={true}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalText}>Save to:</Text>
            <Ionicons
              name="ios-close"
              size={30}
              color="black"
              //   onPress={() => setModalVisible(false)}
              onPress={onClose}
            />
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.innerContainer}
          >
            <Text style={GlobalStyles.titleLargeRegular}>My Travel Boards</Text>
            {travelBoards.length === 0 && !isLoading && (
              <View>
                <Text style={styles.promptMsg}>
                  You have no Travel Boards yet. Create one in the Profile.
                </Text>
                <Pressable
                  style={styles.promptText}
                  onPress={() => {
                    Navigation.navigate("ProfileStackGroup", {
                      screen: "Profile",
                    });
                    // setModalVisible(false);
                    onClose();
                  }}
                >
                  <Text>Go to Profile</Text>
                </Pressable>
              </View>
            )}

            {!isLoading &&
              travelBoards.length > 0 &&
              travelBoards.map((board) => (
                <ChecklistBoard
                  key={board.boardId}
                  board={board}
                  isSelected={selectedBoards.includes(board)}
                  onToggleSelectionBoard={toggleSelectionBoard}
                />
              ))}
            {!isLoading && travelBoards.length > 0 && (
              <Pressable
                style={styles.secondaryAction}
                onPress={() => {
                  Navigation.navigate("ProfileStackGroup", {
                    screen: "Profile",
                  });
                  //   setModalVisible(false);
                  onClose();
                }}
              >
                <Text>Create New Board</Text>
              </Pressable>
            )}

            <Text style={GlobalStyles.titleLargeRegular}>My Trips</Text>
            {userTrips.length === 0 && !isLoading && (
              <View>
                <Text style={styles.promptMsg}>
                  You have no Trips yet. Create one in Trips.
                </Text>
                <Pressable
                  style={styles.promptText}
                  onPress={() => {
                    Navigation.navigate("TripsStackGroup", {
                      screen: "Trips",
                    });
                    // setModalVisible(false);
                    onClose();
                  }}
                >
                  <Text>Go to Trips</Text>
                </Pressable>
              </View>
            )}

            {!isLoading &&
              userTrips.length > 0 &&
              userTrips.map((trip) => (
                <ChecklistTrip
                  key={trip.tripId}
                  trip={trip}
                  isSelected={selectedTrips.includes(trip)}
                  onToggleSelectionTrip={toggleSelectionTrip}
                />
              ))}
            {!isLoading && userTrips.length > 0 && (
              <Pressable
                style={styles.secondaryAction}
                onPress={() => {
                  Navigation.navigate("TripStackGroup", {
                    screen: "Trips",
                  });
                  //   setModalVisible(false);
                  onClose();
                }}
              >
                <Text>Create New Trip</Text>
              </Pressable>
            )}
            {/* {isLoading && <ActivityIndicator size={"large"} />}
            <Text style={styles.promptMsg}>
              You can also save places to a trip.
            </Text>
            {/* {myTrips.length === 0 && !isLoading && ( */}
            {/* <Pressable
              style={styles.promptText}
              onPress={() => {
                Navigation.navigate("TripsStackGroup");
                // setModalVisible(false);
                onClose();
              }}
            >
              <Text>Go to Trips</Text>
            </Pressable> */}
            {/* )} */}

            {/* {!isLoading &&
                myTrips.length > 0 &&
                myTrips.map((trip) => (
                  <ChecklistItem
                    key={trip.tripId}
                    trip={trip}
                    isSelected={selectedBoards.includes(trip)}
                    onToggleSelection={toggleSelection}
                  />
                ))} */}
          </ScrollView>
          <View style={styles.modalFooter}>
            <Pressable
              style={styles.submitButton}
              title="Submit"
              onPress={() => {
                handleSubmit();
              }}
            >
              <Text>Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SavePlaceModal;

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
  modalText: {
    fontSize: 20,
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
  promptMsg: {
    marginTop: 50,
    textAlign: "center",
  },
  innerContainer: {
    width: "100%",
  },
  secondaryAction: {
    textAlign: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: "center",
    borderColor: "lightgrey",
    borderWidth: 1,
    marginHorizontal: 90,
    marginVertical: 10,
    borderRadius: 100,
  },
  submitButton: {
    backgroundColor: "lightblue",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 15,
  },
  modalFooter: {
    width: "100%",
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
  checkTextContainer: {
    flex: 1,
    height: 40,
  },
  checklistText: {
    fontSize: 16,
    marginBottom: 2,
    paddingLeft: 10,
    paddingTop: 8,
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

  //   image: {
  //     height: 250,
  //     borderRadius: 10,
  //     marginBottom: 15,
  //   },
  //   subtitleText: {
  //     marginTop: 5,
  //     marginBottom: 10,
  //   },
  //   titleText: {
  //     marginBottom: 10,
  //     fontSize: 25,
  //   },
  //   headingText: {
  //     marginTop: 10,
  //   },
  //   bodyText: {
  //     overflow: "hidden",
  //     maxWidth: 340,
  //     marginBottom: 5,
  //   },
  //   icon: {
  //     marginRight: 15,
  //   },
  //   AddressIcon: {
  //     marginRight: 18,
  //   },
  //   iconText: {
  //     maxWidth: 300,
  //   },
  //   iconContainer: {
  //     flexDirection: "row",
  //     alignItems: "flex-start",
  //     marginBottom: 5,
  //   },
  //   para: {
  //     marginTop: 10,
  //     marginBottom: 30,
  //     textDecorationLine: "underline",
  //   },
  //   saveButton: {
  //     backgroundColor: "lightblue",
  //     paddingVertical: 10,
  //     paddingHorizontal: 10,
  //     borderRadius: 5,
  //   },
  //   textContainer: {
  //     flex: 1,
  //     flexDirection: "row",
  //     justifyContent: "space-between",
  //     marginBottom: 20,
  //     alignItems: "flex-end",
  //   },
});
