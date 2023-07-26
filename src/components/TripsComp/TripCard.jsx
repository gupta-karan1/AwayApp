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

const TripCard = ({ tripItem, path }) => {
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
  const { navigate } = useNavigation();

  const startDateTime = moment(startDate.toDate()).format("DD MMM YYYY");
  const endDateTime = moment(endDate.toDate()).format("DD MMM YYYY");

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
        })
      }
    >
      <ImageBackground source={{ uri: coverImage }} style={styles.image}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{tripTitle}</Text>
          <Text style={styles.subtitle}>
            {/* {moment(startDateTime).format("DD MMM YYYY")} -{" "}
            {moment(endDateTime).format("DD MMM YYYY")} */}
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
