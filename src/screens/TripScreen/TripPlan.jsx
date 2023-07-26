import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  ScrollView,
} from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";
import TripTopNav from "./TripTopNav";

const TripPlan = () => {
  const route = useRoute();
  // const tripId = route.params.tripId;
  const { tripId, tripTitle, startDate, endDate, coverImage } = route.params;

  return (
    <ScrollView>
      <ImageBackground source={{ uri: coverImage }} style={styles.image}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{tripTitle}</Text>
          <Text style={styles.text}>
            {startDate} - {endDate}
          </Text>
        </View>
      </ImageBackground>
      <TripTopNav />
    </ScrollView>
  );
};

export default TripPlan;

const styles = StyleSheet.create({
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
