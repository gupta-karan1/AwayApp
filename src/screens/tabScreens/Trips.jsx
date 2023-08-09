import {
  StyleSheet,
  View,
  Pressable,
  Text,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useState, useContext, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../../hooks/AuthContext";
import {
  getDocs,
  collection,
  collectionGroup,
  query,
  where,
  doc,
  orderBy,
} from "firebase/firestore";
import { FIREBASE_DB } from "../../../firebaseConfig";
import TripCard from "../../components/TripsComp/TripCard";
import { useFocusEffect } from "@react-navigation/native";
import GlobalStyles from "../../GlobalStyles";

const Trips = () => {
  // Navigation object from useNavigation hook
  const navigation = useNavigation();

  // State variables
  const [tripData, setTripData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [invitedTrips, setInvitedTrips] = useState([]);
  const [tabView, setTabView] = useState("all");

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

      const tripQuery = query(
        collection(userRef, "trips"),
        orderBy("startDate", "desc") // Query to get the user's trips sorted by startDate in ascending order
      );

      const querySnapshot2 = await getDocs(tripQuery);
      // Extract and set trip data from the query snapshot
      const data = querySnapshot2.docs.map((doc) => doc.data());

      setTripData(data);

      const userData = querySnapshot1.docs.map((doc) => doc.data());
      const { userId, username, email } = userData[0];

      // make a collectionGroup query to get all trips where the user is an invitee
      if (userId && username && email) {
        const q2 = query(
          collectionGroup(FIREBASE_DB, "trips"),
          where("invitees", "array-contains", {
            userId: userId,
            username: username,
            email: email,
          })
        );
        const querySnapshot = await getDocs(q2);

        const data2 = querySnapshot.docs.map((doc) => doc.data());
        setInvitedTrips(data2);
      }
    } catch (error) {
      Alert.alert("Error saving trip details:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's trip data when the screen mounted
  useFocusEffect(
    useCallback(() => {
      getUserTripData();
    }, []) // Function to call once
  );

  // Function to navigate to the TripForm screen
  const handleAddTrip = () => {
    navigation.navigate("CreateTripForm");
  };

  const MyTrips = () => {
    return (
      <ScrollView
        style={styles.tripContainer}
      >
        <Text style={GlobalStyles.titleLargeRegular}>My Trips</Text>
        {tripData.length > 0 &&
          tripData.map((trip) => {
            return <TripCard key={trip.tripId} tripItem={trip} />;
          })}
      </ScrollView>
    );
  };

  const InvitedTrips = () => {
    return (
      <View style={styles.tripContainer}>
        <Text style={GlobalStyles.titleLargeRegular}>Invited Trips</Text>
        {invitedTrips.length > 0 &&
          invitedTrips.map((trip) => {
            return <TripCard key={trip.tripId} tripItem={trip} />;
          })}
      </View>
    );
  };

  const AllTrips = () => {
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.tripContainer}>
          <Text style={GlobalStyles.titleLargeRegular}>My Trips</Text>
          {tripData.length > 0 &&
            tripData.map((trip) => {
              return <TripCard key={trip.tripId} tripItem={trip} />;
            })}
        </View>
        <View style={styles.tripContainer}>
          <Text style={GlobalStyles.titleLargeRegular}>Invited Trips</Text>
          {invitedTrips.length > 0 &&
            invitedTrips.map((trip) => {
              return <TripCard key={trip.tripId} tripItem={trip} />;
            })}
        </View>
      </ScrollView>
    );
  };

  const handleTabView = (tab) => {
    setTabView(tab);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={() => handleTabView("all")}
          style={[styles.button, tabView === "all" && styles.selected]}
        >
          <Text>All</Text>
        </Pressable>
        <Pressable
          onPress={() => handleTabView("personal")}
          style={[styles.button, tabView === "personal" && styles.selected]}
        >
          <Text>My Trips</Text>
        </Pressable>
        <Pressable
          onPress={() => handleTabView("invited")}
          style={[styles.button, tabView === "invited" && styles.selected]}
        >
          <Text>Invited</Text>
        </Pressable>
      </View>
      {loading ? (
        <ActivityIndicator size={"large"} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {tabView === "all" && <AllTrips />}
          {tabView === "personal" && <MyTrips />}
          {tabView === "invited" && <InvitedTrips />}
        </ScrollView>
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
    paddingHorizontal: 15,
    // paddingTop: 15,
  },
  tripContainer: {
    marginBottom: 15,
    marginTop: 15,
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
  buttonContainer: {
    flexDirection: "row", // To make the buttons appear side by side
    padding: 10,
    paddingLeft: 0,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  button: {
    alignItems: "flex-start",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 50,
    backgroundColor: "#fff",
    marginRight: 10,
    elevation: 2,
  },
  selected: {
    backgroundColor: "lightblue",
  },
});

// SUMMARY: The Trip Screen component renders a list of trips associated with the logged-in user. The getUserTripData function is responsible for fetching the user's trip data from Firebase and ordering it by the trip's start dates. It sets the data in the tripData state variable, which is then used to render individual trip cards using the renderTripCard function. The path prop is passed to the TripCard component to specify the path to the user's trips collection in Firebase. The FlatList is used to render the list of trip cards. The FAB is uses the handleAddTrip function to navigate to the TripForm screen.
