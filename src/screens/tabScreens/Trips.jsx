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
  const navigation = useNavigation();
  const [tripData, setTripData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const [userId, setUserId] = useState("");

  const getUserTripData = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(FIREBASE_DB, "users"),
        where("userId", "==", user.uid)
      );
      const querySnapshot1 = await getDocs(q);
      //create reference to this doc
      const userRef = doc(FIREBASE_DB, "users", querySnapshot1.docs[0].id);
      setUserId(userRef.id);

      const tripQuery = query(
        collection(userRef, "trips"),
        orderBy("startDate", "asc")
      );

      // const querySnapshot2 = await getDocs(collection(userRef, "trips"));
      const querySnapshot2 = await getDocs(tripQuery);
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

  useFocusEffect(
    useCallback(() => {
      getUserTripData();
    }, [])
  );

  // Use the 'navigation' prop to navigate to the TripForm screen
  const handleAddTrip = () => {
    navigation.navigate("CreateTripForm");
  };

  const renderTripCard = useCallback(({ item }) => {
    return (
      <TripCard
        key={item.tripId}
        tripItem={item}
        path={`users/${userId}/trips`}
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
          ItemSeparatorComponent={() => <View style={{ width: 15 }}></View>}
          removeClippedSubviews={true}
          initialNumToRender={2}
          maxToRenderPerBatch={2}
          updateCellsBatchingPeriod={100}
          windowSize={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 15 }}
        />
      )}
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
