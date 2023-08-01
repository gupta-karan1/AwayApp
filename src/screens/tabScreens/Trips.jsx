import {
  StyleSheet,
  View,
  Pressable,
  Text,
  Alert,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useState, useContext, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";

import { AuthContext } from "../../../hooks/AuthContext";
import {
  getDocs,
  collection,
  query,
  where,
  doc,
  orderBy,
} from "firebase/firestore";
import { FIREBASE_DB } from "../../../firebaseConfig";
import TripCard from "../../components/TripsComp/TripCard";
import { useFocusEffect } from "@react-navigation/native";

const Trips = () => {
  // Navigation object from useNavigation hook
  const navigation = useNavigation();

  // State variables
  const [tripData, setTripData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");

  // Get the user object from the AuthContext
  const { user } = useContext(AuthContext);

  // Function to fetch and set user's trip data and order it by the trip's start date.
  const getUserTripData = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(FIREBASE_DB, "users"),
        where("userId", "==", user.uid) // Query to find the user document based on the userId
      );
      const querySnapshot1 = await getDocs(q);
      const userRef = doc(FIREBASE_DB, "users", querySnapshot1.docs[0].id); // Create a reference to the user's document
      setUserId(userRef.id);

      const tripQuery = query(
        collection(userRef, "trips"),
        orderBy("startDate", "desc") // Query to get the user's trips sorted by startDate in ascending order
      );

      const querySnapshot2 = await getDocs(tripQuery);
      // Extract and set trip data from the query snapshot
      const data = querySnapshot2.docs.map((doc) => doc.data());
      setTripData(data);
      // console.log(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error saving trip details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's trip data when the screen mounted
  useFocusEffect(
    useCallback(() => {
      getUserTripData();
    }, []) // Function only called once
  );

  // Function to navigate to the TripForm screen
  const handleAddTrip = () => {
    navigation.navigate("CreateTripForm");
  };

  // Function to render the trip card
  const renderTripCard = useCallback(({ item }) => {
    return (
      <TripCard
        key={item.tripId}
        tripItem={item}
        path={`users/${userId}/trips`} // Path to logged in user's trips collection
      />
    );
  });

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size={"large"} />
      ) : (
        <FlatList
          data={tripData}
          renderItem={renderTripCard}
          keyExtractor={(item) => item.tripId}
          ItemSeparatorComponent={() => <View style={{ width: 15 }}></View>} // Add space between trip cards
          removeClippedSubviews={true} // removes off screen items
          initialNumToRender={2} // initial number of items to render
          maxToRenderPerBatch={2} // max number of items to render per batch
          updateCellsBatchingPeriod={100} // time in ms between each batch render
          windowSize={2} // number of items to render outside of the visible window
          showsVerticalScrollIndicator={false} // hide scroll bar
          contentContainerStyle={{ paddingHorizontal: 15 }} //horizonatal padding to container
        />
      )}
      {/* FAB to add a new trip */}
      <Pressable style={styles.fabButton} onPress={handleAddTrip}>
        <Text style={styles.fabText}>+ Add Trip</Text>
      </Pressable>
    </View>
  );
};

export default Trips;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fabButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#0D47A1",
    elevation: 4,
  },
  fabText: {
    fontSize: 15,
    color: "white",
  },
});

// SUMMARY: The Trip Screen component renders a list of trips associated with the logged-in user. The getUserTripData function is responsible for fetching the user's trip data from Firebase and ordering it by the trip's start dates. It sets the data in the tripData state variable, which is then used to render individual trip cards using the renderTripCard function. The path prop is passed to the TripCard component to specify the path to the user's trips collection in Firebase. The FlatList is used to render the list of trip cards. The FAB is uses the handleAddTrip function to navigate to the TripForm screen.
