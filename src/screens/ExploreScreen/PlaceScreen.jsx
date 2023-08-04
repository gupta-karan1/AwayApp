import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  ScrollView,
  Button,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import GlobalStyles from "../../GlobalStyles";
import { FontAwesome } from "@expo/vector-icons";
import usePlaceScreen from "../../../hooks/usePlaceScreen";

// PlaceScreen component
const PlaceScreen = ({ route }) => {
  // Get the pathId from the route params
  const { pathId } = route.params;

  // Custom hook to fetch the single place data based on the pathId
  const { loading, singlePlaceData } = usePlaceScreen(pathId);

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

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Image
            source={{ uri: singlePlaceData.placeImage }}
            style={styles.image}
          />
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
            {/* <Button title="Save Place" onPress={() => {}} /> */}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default PlaceScreen;

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
  button: {
    marginVertical: 10,
  },
});

// SUMMARY: Place Screen component fteches data from Firebase using the usePlaceScreen custom hook, which takes the pathId parameter from the route. It displays the place image, category, title, description, address, contact, and hours. The Read More/Less functionality is implemented using the showFullText state variable and toggleFullText function. The formatPlaceHours function formats the place hours string for display.
