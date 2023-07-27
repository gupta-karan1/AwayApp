import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  ScrollView,
  Dimensions,
} from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";
import TripTopNav from "./TripTopNav";

const TripPlan = () => {
  const route = useRoute();
  // const tripId = route.params.tripId;
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
  } = route.params;

  return (
    <View style={styles.container}>
      <ImageBackground source={{ uri: coverImage }} style={styles.image}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{tripTitle}</Text>
          <Text style={styles.text}>
            {startDate} - {endDate}
          </Text>
        </View>
      </ImageBackground>
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
    backgroundColor: "rgba(30, 144, 255, 0.6)",
    width: "100%",
    padding: 10,
  },
  text: {
    fontSize: 15,
    color: "white",
  },
});
