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
import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { AuthContext } from "../../../hooks/AuthContext";

// component that displays a trip card on the trips screen based on the tripItem and path props passed to it. It will be different for different users.
const TripCard = ({ tripItem, path, onDelete }) => {
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
    createdAt,
  } = tripItem;

  const { user } = useContext(AuthContext);

  const { navigate } = useNavigation(); // The useNavigation hook is used to access the navigation prop of the component.

  const startDateTime = moment(startDate.toDate()).format("DD MMM YYYY"); // The moment library is used to format the date and time.
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
          tripLocation: tripLocation,
          tripType: tripType,
          invitees: invitees,
          userId: userId,
          path: path,
          createdAt: createdAt,
          tripItem: tripItem,
        })
      }
    >
      <ImageBackground
        source={
          coverImage
            ? { uri: coverImage }
            : require("../../../assets/image-placeholder.png")
        }
        style={styles.image}
      >
        <View style={styles.textContainer}>
          <View style={styles.label}>
            <Text style={styles.title}>{tripTitle}</Text>
            <Text style={styles.subtitle}>
              {startDateTime} - {endDateTime}
            </Text>
          </View>
          {user.uid === userId && (
            <Ionicons
              onPress={onDelete}
              name="md-trash-outline"
              size={24}
              color="white"
              style={styles.icon}
            />
          )}
        </View>
      </ImageBackground>
    </Pressable>
  );
};

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
    backgroundColor: "rgba(0, 0, 0, 0.30)",
    width: "100%",
    padding: 10,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  icon: {
    padding: 15,
  },
});

export default TripCard;

// SUMMARY: This component is used to display a trip card on the trips screen based on the tripItem and path props passed to it. It uses the useNavigation hook to access the navigation prop of the component. The moment library is used to format the date and time.
