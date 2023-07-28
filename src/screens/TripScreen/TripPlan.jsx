import { StyleSheet, Text, View, ImageBackground } from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";
import TripTopNav from "./TripTopNav";

// Component to render Trip Plan screen
const TripPlan = () => {
  // Get route from navigation
  const route = useRoute();
  // Destructure route params
  const {
    tripTitle,
    startDate,
    endDate,
    tripType,
    coverImage,
    tripLocation,
    invitees,
    tripId,
    userId,
    path,
  } = route.params;

  return (
    <View style={styles.container}>
      {/* Trip Details Header */}
      <ImageBackground source={{ uri: coverImage }} style={styles.image}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{tripTitle}</Text>
          <Text style={styles.text}>
            {startDate} - {endDate}
          </Text>
        </View>
      </ImageBackground>

      {/* TripTopNav, passing tripLocation as a prop */}
      <TripTopNav tripLocation={tripLocation} />
    </View>
  );
};

export default TripPlan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    height: 180,
    justifyContent: "flex-end",
    backgroundColor: "lightgrey",
  },
  textContainer: {
    // rgba for Opacity 0.6
    backgroundColor: "rgba(30, 144, 255, 0.6)",
    width: "100%",
    padding: 10,
  },
  text: {
    fontSize: 15,
    color: "white",
  },
});

// SUMMARY: This code sets up the Trip Plan screen. It uses the useRoute hook to get the route from navigation and then destructures the route params. It displays the trip coverImage with trip details. Then renders the TripTopNav component, passing  tripLocation as a prop. This is so the Find screen can use the tripLocation prop to fetch the destination data from Firebase.
