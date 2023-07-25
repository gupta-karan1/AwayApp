import { StyleSheet, View, Button } from "react-native";
import React from "react";

const Trips = ({ navigation }) => {
  // Use the 'navigation' prop to navigate to the TripForm screen
  const handleAddTrip = () => {
    navigation.navigate("CreateTripForm");
  };

  return (
    <View style={styles.container}>
      <Button title="Add Trip" onPress={handleAddTrip} />
    </View>
  );
};

export default Trips;

const styles = StyleSheet.create({});
