import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  ScrollView,
  Button,
  TouchableOpacity,
  Pressable,
  Modal,
  Alert,
} from "react-native";
import { useState } from "react";
import GlobalStyles from "../../GlobalStyles";
import { FontAwesome } from "@expo/vector-icons";
// import usePlaceScreen from "../../../hooks/usePlaceScreen";
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
import { useContext, useCallback } from "react";
import { AuthContext } from "../../../hooks/AuthContext";
import { useFocusEffect } from "@react-navigation/native";

// PlaceScreen component
const ProfilePlace = ({ route }) => {
  // Get the pathId from the route params
  // const { pathId } = route.params;

  // Custom hook to fetch the single place data based on the pathId
  // const { loading, singlePlaceData } = usePlaceScreen(pathId);
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
  } = route.params;

  // State variable to toggle the full text
  const [showFullText, setShowFullText] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [travelBoards, setTravelBoards] = useState([]);
  const [selectedBoards, setSelectedBoards] = useState([]);

  // Function to toggle the full text
  const toggleFullText = () => {
    setShowFullText(!showFullText);
  };

  // Function to format place hours in Firebase for display so that each item is on a new line
  const formatPlaceHours = () => {
    if (placeHours) {
      const hoursArray = placeHours // Get the placeHours string
        .split(",") // Split the string by comma
        .map((item) => item.trim()); // Trim the whitespace from each item
      return hoursArray.join("\n"); // Join the array with a new line
    }
    return ""; // Return empty string if placeHours is not available
  };

  const { user } = useContext(AuthContext);

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

  useFocusEffect(
    useCallback(() => {
      if (modalVisible) {
        getTravelBoards();
      }
    }, [modalVisible]) // Function only called once
  );

  const ChecklistItem = ({ board, isSelected, onToggleSelection }) => {
    const toggleCheckbox = () => {
      onToggleSelection(board);
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

  // Function to toggle the selection of a place
  const toggleSelection = (board) => {
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

  // console.log(selectedBoards[0].boardId);

  // create handleSubmitBoard which will save the particular place within a places array to the selected board

  const handleSubmitBoard = async () => {
    try {
      setIsLoading(true);
      // const boardData = {
      //   ...selectedBoards[0],
      //   places: [...selectedBoards[0].places, singlePlaceData],
      // };

      const q = query(
        collection(FIREBASE_DB, "users"),
        where("userId", "==", user.uid)
      );

      const querySnapshot = await getDocs(q); // get user documents from user collection based on user id
      const userRef = doc(FIREBASE_DB, "users", querySnapshot.docs[0].id); //Create a reference to this user's document

      // run a for loop to add the place to the places collection within all the selected boards
      for (let i = 0; i < selectedBoards.length; i++) {
        const q2 = query(
          collection(userRef, "boards"),
          where("boardId", "==", selectedBoards[i].boardId)
        );
        const querySnapshot2 = await getDocs(q2); // Get the travelBoards documents
        // check if the board already has the place saved
        const boardRef = doc(userRef, "boards", querySnapshot2.docs[0].id); //Create a reference to this board's document
        const q3 = query(
          collection(boardRef, "places"),
          where("placeId", "==", placeId)
        );

        const singlePlaceData = {
          placeAddress: placeAddress,
          placeCategory: placeCategory,
          placeContact: placeContact,
          placeDescription: placeDescription,
          placeGoogleMapLink: placeGoogleMapLink,
          placeHours: placeHours,
          placeImage: placeImage,
          placeLatitude: placeLatitude,
          placeLongitude: placeLongitude,
          placeSaved: placeSaved,
          placeTitle: placeTitle,
          placeWebsite: placeWebsite,
          placeId: placeId,
        };

        const querySnapshot3 = await getDocs(q3); // Get the travelBoards documents
        if (querySnapshot3.docs.length === 0) {
          await addDoc(collection(boardRef, "places"), singlePlaceData);
          Alert.alert("Place saved successfully");
        } else {
          Alert.alert(
            "Place already saved",
            "This place already exists in the selected board."
          );
        }
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error saving place", error.message);
    } finally {
      setIsLoading(false);
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* {loading ? (
        <ActivityIndicator size="large" />
      ) : ( */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: placeImage }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={[GlobalStyles.bodySmallRegular, styles.subtitleText]}>
            {placeCategory}
          </Text>
          <View>
            {isLoading ? (
              <ActivityIndicator size="large" />
            ) : (
              <Pressable
                style={styles.saveButton}
                onPress={() => {
                  setModalVisible(true);
                }}
              >
                <Text>Save Place</Text>
              </Pressable>
            )}
          </View>
        </View>

        <Text style={[GlobalStyles.titleLargeRegular, styles.titleText]}>
          {placeTitle}
        </Text>

        {showFullText ? (
          <View>
            <Text style={[GlobalStyles.bodySmallRegular, styles.bodyText]}>
              {placeDescription || ""}
            </Text>
            <TouchableOpacity onPress={toggleFullText}>
              <Text style={[styles.para, GlobalStyles.bodySmallRegular]}>
                Read Less
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text style={[GlobalStyles.bodySmallRegular, styles.bodyText]}>
              {placeDescription && placeDescription.slice(0, 200)}
              {"... "}
            </Text>
            <TouchableOpacity onPress={toggleFullText}>
              <Text style={[GlobalStyles.bodySmallRegular, styles.para]}>
                Read More
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Only display if data exists */}
        {placeAddress && (
          <View style={styles.iconContainer}>
            <FontAwesome
              style={[styles.icon, styles.AddressIcon]}
              name="map-marker"
              size={20} // Smaller icon require more margin
              color="grey"
            />
            <Text
              style={[
                GlobalStyles.bodySmallRegular,
                styles.bodyText,
                styles.iconText,
              ]}
            >
              {placeAddress}
            </Text>
          </View>
        )}

        {placeContact && (
          <View style={styles.iconContainer}>
            <FontAwesome
              style={styles.icon}
              name="phone"
              size={18}
              color="grey"
            />
            <Text
              style={[
                GlobalStyles.bodySmallRegular,
                styles.bodyText,
                styles.iconText,
              ]}
            >
              {placeContact}
            </Text>
          </View>
        )}
        {placeHours && (
          <View style={styles.iconContainer}>
            <FontAwesome
              style={styles.icon}
              name="clock-o"
              size={18}
              color="grey"
            />
            <Text
              style={[
                GlobalStyles.bodySmallRegular,
                styles.bodyText,
                styles.iconText,
              ]}
            >
              {formatPlaceHours()}
            </Text>
          </View>
        )}
      </ScrollView>
      {/* )} */}

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
              <Text style={styles.modalText}>Save to:</Text>
              <Ionicons
                name="ios-close"
                size={30}
                color="black"
                onPress={() => setModalVisible(false)}
              />
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {isLoading && <ActivityIndicator size={"large"} />}
              <Text>My Travel Boards</Text>
              {travelBoards.length === 0 && !isLoading && (
                <Text>
                  You have no travel boards places. Go to the Profile section to
                  create one places.
                </Text>
              )}

              {!isLoading &&
                travelBoards.length > 0 &&
                travelBoards.map((board) => (
                  <ChecklistItem
                    key={board.boardId}
                    board={board}
                    isSelected={selectedBoards.includes(board)}
                    onToggleSelection={toggleSelection}
                  />
                ))}
            </ScrollView>
            <View style={styles.modalFooter}>
              <Pressable
                style={styles.submitButton}
                title="Submit"
                onPress={() => {
                  handleSubmitBoard();
                }}
              >
                <Text>Submit</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfilePlace;

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  image: {
    height: 250,
    borderRadius: 10,
    marginBottom: 15,
  },
  subtitleText: {
    marginTop: 5,
    marginBottom: 10,
  },
  titleText: {
    marginBottom: 10,
    fontSize: 25,
  },
  bodyText: {
    overflow: "hidden",
    maxWidth: 340,
    marginBottom: 5,
  },
  icon: {
    marginRight: 15,
  },
  AddressIcon: {
    marginRight: 18,
  },
  iconText: {
    maxWidth: 300,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  para: {
    marginTop: 10,
    marginBottom: 30,
    textDecorationLine: "underline",
  },
  // button: {
  //   marginVertical: 10,
  // },
  saveButton: {
    backgroundColor: "lightblue",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  textContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    alignItems: "flex-end",
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
});

// SUMMARY: Place Screen component fetches data from Firebase using the usePlaceScreen custom hook, which takes the pathId parameter from the route. It displays the place image, category, title, description, address, contact, and hours. The Read More/Less functionality is implemented using the showFullText state variable and toggleFullText function. The formatPlaceHours function formats the place hours string for display.
