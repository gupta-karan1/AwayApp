import { StyleSheet, Text, View } from "react-native";
import React from "react";

// Component to render Plan section of TripTopNav
const Plan = () => {
  return (
    <View showsVerticalScrollIndicator={false} style={styles.container}>
      <Text>Plan</Text>
    </View>
  );
};

export default Plan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

// SUMMARY: This code sets up the Plan section of the TripTopNav.
