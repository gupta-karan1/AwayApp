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
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
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
                  Navigation.navigate("ProfileStackGroup");
                } else {
                  setModalVisible(true);
                }
              }}
            >
              <Text>Save Place</Text>
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
          </Pressable>
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
    </View>
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
    marginBottom: 20,
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
  mapContainer: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden", // This is important to clip the border radius
  },
  map: {
    height: 200,
    width: "100%",
  },
});

// SUMMARY: Place Screen component fetches data from Firebase using the usePlaceScreen custom hook, which takes the pathId parameter from the route. It displays the place image, category, title, description, address, contact, and hours. The Read More/Less functionality is implemented using the showFullText state variable and toggleFullText function. The formatPlaceHours function formats the place hours string for display.
