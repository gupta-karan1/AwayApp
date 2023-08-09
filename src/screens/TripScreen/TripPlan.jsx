import {
  StyleSheet,
  Text,
  SafeAreaView,
  ImageBackground,
  StatusBar,
  Pressable,
  View,
} from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";
import TripTopNav from "./TripTopNav";
// import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
// import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

// Component to render Trip Plan screen
const TripPlan = () => {
  const Navigation = useNavigation();
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
    <SafeAreaView style={styles.container}>
      {/* Trip Details Header */}
      <ImageBackground source={{ uri: coverImage }} style={styles.image}>
        <Pressable
          onPress={() => Navigation.navigate("Trips")}
          style={styles.backButton}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
        </Pressable>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{tripTitle}</Text>
          <Text style={styles.text}>
            {startDate} - {endDate}
          </Text>
        </View>
      </ImageBackground>

      {/* TripTopNav, passing tripLocation as a prop */}
      <TripTopNav
        tripLocation={tripLocation}
        tripId={tripId}
        invitees={invitees}
        startDate={startDate}
        endDate={endDate}
        tripType={tripType}
        userId={userId}
      />
    </SafeAreaView>
  );
};

export default TripPlan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Create status bar for Trip Page
    marginTop: StatusBar.currentHeight || 0,
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
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    padding: 5,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
});

// SUMMARY: This code sets up the Trip Plan screen. It uses the useRoute hook to get the route from navigation and then destructure the route params. It displays the trip coverImage with trip details. Then renders the TripTopNav component, passing  tripLocation as a prop. This is so the Find screen can use the tripLocation prop to fetch the destination data from Firebase.
