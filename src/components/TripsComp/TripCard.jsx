import {
  StyleSheet,
  Text,
  Pressable,
  ImageBackground,
  View,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";

// component that displays a trip card on the trips screen based on the tripItem and path props passed to it. It will be different for different users.
const TripCard = ({ tripItem, path }) => {
  // tripItem is an object that contains the data for the trip. path is a string that contains the path to the trip in the Firestore database.

  // The object destructuring syntax is used to extract the data from the tripItem object.
  const {
    tripTitle,
    tripLocation,
    startDate,
    endDate,
    tripType,
    invitees,
    coverImage,
    userId,
    tripId,
  } = tripItem;

  const { navigate } = useNavigation(); // The useNavigation hook is used to access the navigation prop of the component.

  const startDateTime = moment(startDate.toDate()).format("DD MMM YYYY"); // The moment library is used to format the date and time.
  const endDateTime = moment(endDate.toDate()).format("DD MMM YYYY");

  // The Pressable component is used to wrap the trip card. It is used to navigate to the TripPlan screen when the trip card is pressed.
  // The navigate function is used to navigate to the TripPlan screen. The tripId, tripTitle, startDate, endDate, coverImage, tripLocation, tripType, invitees, userId, and path props are passed to the TripPlan screen.
  return (
    <Pressable
      style={styles.container}
      onPress={() =>
        navigate("TripPlan", {
          tripId: tripId,
          tripTitle: tripTitle,
          startDate: startDateTime,
          endDate: endDateTime,
          coverImage: coverImage,
          tripLocation: tripLocation,
          tripType: tripType,
          invitees: invitees,
          userId: userId,
          path: path,
        })
      }
    >
      <ImageBackground source={{ uri: coverImage }} style={styles.image}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{tripTitle}</Text>
          <Text style={styles.subtitle}>
            {startDateTime} - {endDateTime}
          </Text>
        </View>
      </ImageBackground>
    </Pressable>
  );
};

export default TripCard;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    overflow: "hidden",
    borderRadius: 10,
  },
  image: {
    width: "100%",
    height: 200,
    justifyContent: "flex-end",
    backgroundColor: "lightgrey",
  },
  title: {
    fontSize: 20,
    color: "white",
  },
  subtitle: {
    fontSize: 10,
    color: "white",
  },
  textContainer: {
    backgroundColor: "rgba(30, 144, 255, 0.6)",
    width: "100%",
    padding: 10,
  },
});
