import { StyleSheet, Text, View, Pressable, StatusBar } from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";
import Itinerary from "./Itinerary";
import Saved from "./Saved";
import { useState } from "react";
import GlobalStyles from "../../GlobalStyles";

// Component to render Plan section
const Plan = () => {
  const route = useRoute();
  const { tripId, startDate, endDate, userId, invitees } = route.params;

  const [selectedItem, setSelectedItem] = useState("Itinerary"); // Default selected item is "Plan"

  // Function to navigate to the Plan (Itinerary) screen
  const goToPlan = () => {
    setSelectedItem("Itinerary"); // Update selected item to "Plan"
  };

  // Function to navigate to the Saved screen
  const goToSaved = () => {
    setSelectedItem("Saved"); // Update selected item to "Saved"
  };
  return (
    <View style={styles.container}>
      <View>
        <View style={styles.buttonContainer}>
          <Pressable
            onPress={goToPlan}
            style={[
              styles.button,
              selectedItem === "Itinerary" && styles.selected,
            ]}
          >
            <Text style={[styles.text, GlobalStyles.bodySmallRegular]}>
              Itinerary
            </Text>
          </Pressable>
          <Pressable
            onPress={goToSaved}
            style={[styles.button, selectedItem === "Saved" && styles.selected]}
          >
            <Text style={[styles.text, GlobalStyles.bodySmallRegular]}>
              Wishlist
            </Text>
          </Pressable>
        </View>
      </View>
      <View>
        {selectedItem === "Itinerary" && (
          <Itinerary
            startDate={startDate}
            endDate={endDate}
            tripId={tripId}
            userId={userId}
            invitees={invitees}
          />
        )}
        {selectedItem === "Saved" && (
          <Saved tripId={tripId} userId={userId} invitees={invitees} />
        )}
      </View>
    </View>
  );
};

export default Plan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: StatusBar.currentHeight || 0,
  },
  buttonContainer: {
    flexDirection: "row", // To make the buttons appear side by side
    padding: 10,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  button: {
    alignItems: "flex-start",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    backgroundColor: "#fff",
    marginRight: 10,
    // elevation: 2,
    borderWidth: 1,
    borderColor: "#63725A",
  },
  selected: {
    backgroundColor: "#E5E8E3",
  },
  text: {
    color: "#63725A",
  },
});

// SUMMARY: This code sets up the Plan section of the TripTopNav.
