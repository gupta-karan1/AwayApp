import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Modal,
  Alert,
  Linking,
} from "react-native";
import { useState } from "react";
import GlobalStyles from "../../GlobalStyles";
import { FontAwesome } from "@expo/vector-icons";
import { useContext } from "react";
import { AuthContext } from "../../../hooks/AuthContext";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import SavePlaceModal from "./SavePlaceModal";

// PlaceScreen component
const PlaceScreen = ({ route }) => {
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
  const [modalVisible, setModalVisible] = useState(false);

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

  const Navigation = useNavigation();

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <Image source={{ uri: placeImage }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={[GlobalStyles.bodySmallRegular, styles.subtitleText]}>
          {placeCategory}
        </Text>
        <View>
          <Pressable
            style={styles.saveButton}
            onPress={() => {
              if (!user) {
                Navigation.navigate("TripsStackGroup");
              } else {
                setModalVisible(true);
              }
            }}
          >
            <Text style={[GlobalStyles.bodySmallRegular, styles.buttonText]}>
              Save Place
            </Text>
          </Pressable>
          {modalVisible && (
            <SavePlaceModal
              onClose={() => setModalVisible(false)}
              modalVisible={modalVisible}
              placeData={{
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
              }}
            />
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
        <Pressable
          onPress={() => {
            Linking.openURL(placeGoogleMapLink);
          }}
        >
          <View style={styles.iconContainer}>
            <FontAwesome
              style={[styles.icon, styles.AddressIcon]}
              name="map-marker"
              size={20} // Smaller icon require more margin
              color="#63725A"
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
        </Pressable>
      )}

      {placeContact && (
        <Pressable
          onPress={() => {
            const phoneNumber = `tel:${placeContact}`;
            Linking.openURL(phoneNumber);
          }}
        >
          <View style={styles.iconContainer}>
            <FontAwesome
              style={styles.icon}
              name="phone"
              size={18}
              color="#63725A"
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
        </Pressable>
      )}
      {placeHours && (
        <View style={styles.iconContainer}>
          <FontAwesome
            style={styles.icon}
            name="clock-o"
            size={18}
            color="#63725A"
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
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider="google"
          initialRegion={{
            latitude: placeLatitude,
            longitude: placeLongitude,
            latitudeDelta: 0.003,
            longitudeDelta: 0.003,
          }}
        >
          <Marker
            coordinate={{
              latitude: placeLatitude,
              longitude: placeLongitude,
            }}
            title={placeTitle}
            description={placeCategory}
          />
        </MapView>
      </View>
    </ScrollView>
  );
};

export default PlaceScreen;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#fff",
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
  headingText: {
    marginTop: 10,
  },
  innerContainer: {
    width: "100%",
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
  saveButton: {
    backgroundColor: "#63725A",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: "#EFFBB7",
  },
  textContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    alignItems: "flex-end",
  },
  mapContainer: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden", // This is important to clip the border radius
    marginBottom: 30,
  },
  map: {
    height: 200,
    width: "100%",
  },
});

// SUMMARY: Place Screen component fetches data from Firebase using the usePlaceScreen custom hook, which takes the pathId parameter from the route. It displays the place image, category, title, description, address, contact, and hours. The Read More/Less functionality is implemented using the showFullText state variable and toggleFullText function. The formatPlaceHours function formats the place hours string for display.
