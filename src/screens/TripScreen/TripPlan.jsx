import {
  StyleSheet,
  Text,
  SafeAreaView,
  ImageBackground,
  StatusBar,
  Pressable,
  View,
} from "react-native";
import React, { useContext } from "react";
import { useRoute } from "@react-navigation/native";
import TripTopNav from "./TripTopNav";
// import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
// import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { AuthContext } from "../../../hooks/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import GlobalStyles from "../../GlobalStyles";

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
    // path,
    // createdAt,
    tripItem,
  } = route.params;

  // Get the user object from the AuthContext
  const { user } = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.container}>
      {/* Trip Details Header */}
      <ImageBackground source={{ uri: coverImage }} style={styles.image}>
        <View style={styles.iconContainer}>
          <Pressable
            onPress={() => Navigation.navigate("Trips")}
            style={styles.backButton}
          >
            <AntDesign name="arrowleft" size={24} color="#63725A" />
          </Pressable>
          {user.uid === userId && (
            <Pressable
              onPress={() =>
                Navigation.navigate("CreateTripForm", {
                  tripItem: tripItem,
                })
              }
              style={styles.backButton}
            >
              <Feather name="edit-2" size={22} color="#63725A" />
            </Pressable>
          )}
        </View>
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={styles.textContainer}
        >
          <Text style={[styles.text, GlobalStyles.titleLargeRegular]}>
            {tripTitle}
          </Text>
          <Text style={[styles.text, GlobalStyles.labelMediumMedium]}>
            {startDate} - {endDate}
          </Text>
        </LinearGradient>
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
    height: 150,
    justifyContent: "space-between",
    backgroundColor: "lightgrey",
  },
  textContainer: {
    // backgroundColor: "rgba(30, 144, 255, 0.6)",
    width: "100%",
    padding: 10,
  },
  text: {
    color: "#fff",
  },
  backButton: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 15,
  },
});

// SUMMARY: This code sets up the Trip Plan screen. It uses the useRoute hook to get the route from navigation and then destructure the route params. It displays the trip coverImage with trip details. Then renders the TripTopNav component, passing  tripLocation as a prop. This is so the Find screen can use the tripLocation prop to fetch the destination data from Firebase.
