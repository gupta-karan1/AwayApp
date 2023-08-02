import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  ScrollView,
  Button,
  TouchableOpacity,
  ImageBackground,
  Pressable,
} from "react-native";
import { useState } from "react";
import GlobalStyles from "../../GlobalStyles";
import { FontAwesome } from "@expo/vector-icons";
import usePlaceScreen from "../../../hooks/usePlaceScreen";
import { useContext } from "react";
import { AuthContext } from "../../../hooks/AuthContext";
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
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";

// PlaceScreen component for the find section within a trip
const FindPlace = ({ route }) => {
  // Get the pathId from the route params
  const { pathId, tripId } = route.params;

  const navigation = useNavigation();

  // Custom hook to fetch the single place data based on the pathId
  const { loading, singlePlaceData } = usePlaceScreen(pathId);
  const [isLoading, setIsLoading] = useState(false);

  // State variable to toggle the full text
  const [showFullText, setShowFullText] = useState(false);

  // Function to toggle the full text
  const toggleFullText = () => {
    setShowFullText(!showFullText);
  };

  // Function to format place hours in Firebase for display so that each item is on a new line
  const formatPlaceHours = () => {
    if (singlePlaceData.placeHours) {
      const hoursArray = singlePlaceData.placeHours // Get the placeHours string
        .split(",") // Split the string by comma
        .map((item) => item.trim()); // Trim the whitespace from each item
      return hoursArray.join("\n"); // Join the array with a new line
    }
    return ""; // Return empty string if placeHours is not available
  };

  // Access user object from AuthContext to get user id
  const { user } = useContext(AuthContext);

  const savePlaceDetails = async (placeData) => {
    try {
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

      // Check if the place with the same placeId exists in the "saved" subcollection
      const placeId = singlePlaceData.placeId;
      const existingPlacesSnapshot = await getDocs(
        query(collection(tripRef, "saved"), where("placeId", "==", placeId))
      );

      if (!existingPlacesSnapshot.empty) {
        // Place with the same placeId already exists, throw an error
        throw new Error("Place is already in the saved collection.");
      }

      // If placeId is unique, add the place data to the "saved" subcollection
      await addDoc(collection(tripRef, "saved"), placeData);

      Alert.alert(
        "Place Saved",
        "Place saved successfully to Plan!",
        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel",
          },
          {
            text: "Go to Saved",
            onPress: () => {
              //navigate to the saved places screen
              navigation.navigate("Plan");
            },
          },
        ],
        {
          cancelable: true,
          onDismiss: () => {},
        }
      );
    } catch (error) {
      Alert.alert("Error saving place details:", error.message);
    }
  };

  // Function to save the place
  const savePlace = async () => {
    try {
      setIsLoading(true); // show loading indicator
      // Prepare the place data object with the form inputs etc
      const placeData = {
        placeTitle: singlePlaceData.placeTitle,
        placeCategory: singlePlaceData.placeCategory,
        placeDescription: singlePlaceData.placeDescription,
        placeAddress: singlePlaceData.placeAddress,
        placeContact: singlePlaceData.placeContact,
        placeHours: singlePlaceData.placeHours,
        placeImage: singlePlaceData.placeImage,
        placeGoogleMapLink: singlePlaceData.placeGoogleMapLink,
        placeLongitude: singlePlaceData.placeLongitude,
        placeLatitude: singlePlaceData.placeLatitude,
        placeSaved: true,
        placeId: singlePlaceData.placeId,
        placeWebsite: singlePlaceData.placeWebsite,
        userId: user.uid,
        createdAt: new Date(),
      };

      // Save the place details to Firebase using the savePlaceDetails function
      await savePlaceDetails(placeData);

      // console.log("Place details saved successfully!");
    } catch (error) {
      Alert.alert("Error saving place details:", error.message);
      // console.error("Error saving place details:", error.message);
    } finally {
      setIsLoading(false); // set loading state to false after form submission
    }
  };

  const Navigation = useNavigation();
  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <ImageBackground
            resizeMode="cover"
            style={styles.image}
            source={{ uri: singlePlaceData.placeImage }}
            imageStyle={{ borderRadius: 10 }}
          >
            <Pressable
              onPress={() => Navigation.goBack()}
              style={styles.backButton}
            >
              <AntDesign name="arrowleft" size={24} color="black" />
            </Pressable>
          </ImageBackground>

          <Text style={[GlobalStyles.bodySmallRegular, styles.subtitleText]}>
            {singlePlaceData.placeCategory}
          </Text>
          <Text style={[GlobalStyles.titleLargeRegular, styles.titleText]}>
            {singlePlaceData.placeTitle}
          </Text>

          {showFullText ? (
            <View>
              <Text style={[GlobalStyles.bodySmallRegular, styles.bodyText]}>
                {singlePlaceData.placeDescription || ""}
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
                {singlePlaceData.placeDescription &&
                  singlePlaceData.placeDescription.slice(0, 200)}
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
          {singlePlaceData.placeAddress && (
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
                {singlePlaceData.placeAddress}
              </Text>
            </View>
          )}

          {singlePlaceData.placeContact && (
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
                {singlePlaceData.placeContact}
              </Text>
            </View>
          )}
          {singlePlaceData.placeHours && (
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
          <View style={styles.button}>
            {/* Save Place button not functional yet */}
            {isLoading ? (
              <ActivityIndicator size="large" />
            ) : (
              <Button title="Save Place" type="submit" onPress={savePlace} />
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default FindPlace;

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  image: {
    width: "100%",
    height: 250,
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
  button: {
    marginVertical: 10,
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    padding: 5,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    elevation: 2,
  },
});

// SUMMARY: Place Screen component fteches data from Firebase using the usePlaceScreen custom hook, which takes the pathId parameter from the route. It displays the place image, category, title, description, address, contact, and hours. The Read More/Less functionality is implemented using the showFullText state variable and toggleFullText function. The formatPlaceHours function formats the place hours string for display.
