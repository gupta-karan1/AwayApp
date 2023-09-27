import {
  StyleSheet,
  Text,
  Pressable,
  ImageBackground,
  View,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import GlobalStyles from "../../GlobalStyles";
import { Feather } from "@expo/vector-icons";
import { Alert } from "react-native";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { FIREBASE_DB } from "../../../firebaseConfig";
import { useContext, useState } from "react";
import { AuthContext } from "../../../hooks/AuthContext";
import usePlaceScreen from "../../../hooks/usePlaceScreen";
import AddPlaceModal from "../../screens/TripScreen/AddPlaceModal";

// display places on the destination screen based on the pathId prop passed to it.
const FindPlaceCard = ({
  placeItem,
  path,
  tripId,
  userId,
  startDate,
  endDate,
}) => {
  // The useNavigation hook is used to access the navigation prop of the component. This allows the component to navigate to other screens.
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const { loading, singlePlaceData } = usePlaceScreen(path);
  const [modalVisible, setModalVisible] = useState(false);

  // Access user object from AuthContext to get user id
  const { user } = useContext(AuthContext);

  // const savePlaceDetails = async (placeData) => {
  //   try {
  //     const q = query(
  //       collection(FIREBASE_DB, "users"),
  //       where("userId", "==", userId)
  //     );

  //     const querySnapshot = await getDocs(q); // get user documents from user collection based on user id
  //     const userRef = doc(FIREBASE_DB, "users", querySnapshot.docs[0].id); //Create a reference to this user's document

  //     // create a trip reference to the trip document
  //     const q2 = query(
  //       collection(userRef, "trips"),
  //       where("tripId", "==", tripId)
  //     );
  //     const querySnapshot2 = await getDocs(q2);
  //     const tripRef = doc(userRef, "trips", querySnapshot2.docs[0].id);

  //     // Check if the place with the same placeId exists in the "saved" subcollection
  //     const placeId = singlePlaceData.placeId;
  //     const existingPlacesSnapshot = await getDocs(
  //       query(collection(tripRef, "saved"), where("placeId", "==", placeId))
  //     );

  //     if (!existingPlacesSnapshot.empty) {
  //       // Place with the same placeId already exists, throw an error
  //       throw new Error("Place is already in the saved collection.");
  //     }

  //     // If placeId is unique, add the place data to the "saved" subcollection
  //     await addDoc(collection(tripRef, "saved"), placeData);

  //     Alert.alert(
  //       "Added to Wishlist",
  //       "You can view the wishlist in Plan",
  //       [
  //         // {
  //         //   text: "Continue",
  //         //   onPress: () => {},
  //         //   style: "cancel",
  //         //   text: "Plan",
  //         //   onPress: () => {
  //         //     //navigate to the saved places screen
  //         //     navigation.navigate("Plan");
  //         //   },
  //         // },
  //         {
  //           text: "Continue",
  //           onPress: () => {},
  //           style: "cancel",
  //         },
  //       ],
  //       {
  //         cancelable: true,
  //         onDismiss: () => {},
  //       }
  //     );
  //   } catch (error) {
  //     Alert.alert("Error saving place details:", error.message);
  //   }
  // };

  // // Function to save the place
  // const savePlace = async () => {
  //   try {
  //     setIsLoading(true); // show loading indicator
  //     // Prepare the place data object with the form inputs etc
  //     const placeData = {
  //       placeTitle: singlePlaceData.placeTitle || "",
  //       placeCategory: singlePlaceData.placeCategory || "",
  //       placeDescription: singlePlaceData.placeDescription || "",
  //       placeAddress: singlePlaceData.placeAddress || "",
  //       placeContact: singlePlaceData.placeContact || "",
  //       placeHours: singlePlaceData.placeHours || "",
  //       placeImage: singlePlaceData.placeImage || "",
  //       placeGoogleMapLink: singlePlaceData.placeGoogleMapLink || "",
  //       placeLongitude: singlePlaceData.placeLongitude || "",
  //       placeLatitude: singlePlaceData.placeLatitude || "",
  //       placeSaved: true,
  //       placeId: singlePlaceData.placeId,
  //       placeWebsite: singlePlaceData.placeWebsite || "",
  //       userId: user.uid,
  //       createdAt: new Date(),
  //       userName: user.displayName,
  //     };

  //     // Save the place details to Firebase using the savePlaceDetails function
  //     await savePlaceDetails(placeData);
  //   } catch (error) {
  //     Alert.alert("Error saving place details:", error.message);
  //   } finally {
  //     setIsLoading(false); // set loading state to false after form submission
  //   }
  // };

  // The placeItem prop is destructured to extract the data for the place to be displayed.
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
  } = placeItem;

  return (
    <Pressable
      style={styles.container}
      onPress={() =>
        navigation.navigate("FindPlace", {
          pathId: path,
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
        })
      }
    >
      <View style={styles.imageContainer}>
        <ImageBackground source={{ uri: placeImage }} style={styles.image}>
          {isLoading ? (
            <ActivityIndicator size="large" />
          ) : (
            <Pressable
              style={styles.saveButton}
              onPress={() => {
                setModalVisible(true);
              }}
            >
              <Feather name="plus" size={24} color="#63725A" />
            </Pressable>
          )}
        </ImageBackground>
      </View>
      {modalVisible && (
        <AddPlaceModal
          onClose={() => setModalVisible(false)}
          modalVisible={modalVisible}
          placeData={{
            placeTitle: singlePlaceData.placeTitle || "",
            placeCategory: singlePlaceData.placeCategory || "",
            placeDescription: singlePlaceData.placeDescription || "",
            placeAddress: singlePlaceData.placeAddress || "",
            placeContact: singlePlaceData.placeContact || "",
            placeHours: singlePlaceData.placeHours || "",
            placeImage: singlePlaceData.placeImage || "",
            placeGoogleMapLink: singlePlaceData.placeGoogleMapLink || "",
            placeLongitude: singlePlaceData.placeLongitude || "",
            placeLatitude: singlePlaceData.placeLatitude || "",
            placeSaved: true,
            placeId: singlePlaceData.placeId,
            placeWebsite: singlePlaceData.placeWebsite || "",
            userId: user.uid,
            userName: user.displayName,
            createdAt: new Date(),
          }}
          tripId={tripId}
          userRefId={userId}
          startDate={startDate}
          endDate={endDate}
          setModalVisible={setModalVisible}
        />
      )}
      <Text style={GlobalStyles.labelMediumMedium}>{placeCategory}</Text>
      <Text style={GlobalStyles.bodyMediumBold} numberOfLines={1}>
        {placeTitle}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "48%",
    marginBottom: 30,
  },
  image: {
    height: 130,
    borderRadius: 10,
    marginBottom: 5,
    backgroundColor: "lightgrey",
  },
  imageContainer: {
    width: "100%",
    height: 130,
    overflow: "hidden",
    borderRadius: 10,
  },
  saveButton: {
    position: "absolute",
    top: 5,
    right: 5,
    padding: 5,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    // backgroundColor: "rgba(99, 114, 90, .6)",
    borderRadius: 50,
    elevation: 2,
  },
});

export default FindPlaceCard;

// SUMMARY: This component renders the place card on article screen.
