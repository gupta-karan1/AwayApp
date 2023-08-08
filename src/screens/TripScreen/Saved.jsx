import { StyleSheet, View, ActivityIndicator, Text } from "react-native";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../hooks/AuthContext";
import { Alert } from "react-native";
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { FIREBASE_DB } from "../../../firebaseConfig";
import { FlatList } from "react-native";
import SavedPlaceCard from "../../components/TripsComp/SavedPlaceCard";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

const Saved = ({ tripId, userId }) => {
  const [savedPlaces, setSavedPlaces] = useState([]); // State to store saved places
  const [isLoading, setIsLoading] = useState(false); // State to show loading indicator
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Access user object from AuthContext to get user id
  // const { user } = useContext(AuthContext);

  const getSavedPlaces = async () => {
    try {
      setIsLoading(true); // show loading indicator
      const q = query(
        collection(FIREBASE_DB, "users"),
        where("userId", "==", userId)
      );

      const querySnapshot = await getDocs(q); // get user documents from user collection based on user id
      const userRef = doc(FIREBASE_DB, "users", querySnapshot.docs[0].id); //Create a reference to this user's document

      // create a trip reference to the trip document
      const q2 = query(
        collection(userRef, "trips"),
        where("tripId", "==", tripId)
      );
      const querySnapshot2 = await getDocs(q2);
      const tripRef = doc(userRef, "trips", querySnapshot2.docs[0].id);

      // get documents from the "saved" subcollection under specific user
      const q3 = query(
        collection(tripRef, "saved"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot3 = await getDocs(q3);
      const saved = querySnapshot3.docs.map((doc) => doc.data());

      setSavedPlaces(saved);

      // Add the place data to the "saved" subcollection under specific user
    } catch (error) {
      Alert.alert("Error getting saved places:", error.message);
    } finally {
      setIsLoading(false); // set loading state to false after form submission
    }
  };

  // useFocusEffect(
  //   useCallback(() => {
  //     getSavedPlaces();
  //   }, [deleteLoading]) // Function only called once
  // );

  useFocusEffect(
    useCallback(() => {
      if (!deleteLoading) {
        getSavedPlaces();
      }
    }, [deleteLoading])
  );

  const renderPlaceCard = ({ item }) => {
    return (
      <SavedPlaceCard
        key={item.placeId}
        placeItem={item}
        onDelete={() => confirmDelete(item)}
      />
    );
  };

  const confirmDelete = (item) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this place?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => handleDeletePlace(item.placeId),
        },
      ]
    );
  };

  const handleDeletePlace = async (placeId) => {
    try {
      setDeleteLoading(true);
      const q = query(
        collection(FIREBASE_DB, "users"),
        where("userId", "==", userId)
      );

      const querySnapshot = await getDocs(q);
      const userRef = doc(FIREBASE_DB, "users", querySnapshot.docs[0].id);

      const q2 = query(
        collection(userRef, "trips"),
        where("tripId", "==", tripId)
      );
      const querySnapshot2 = await getDocs(q2);
      const tripRef = doc(userRef, "trips", querySnapshot2.docs[0].id);

      const q3 = query(
        collection(tripRef, "saved"),
        where("placeId", "==", placeId)
      );
      const querySnapshot3 = await getDocs(q3);
      const placeRef = doc(tripRef, "saved", querySnapshot3.docs[0].id);

      await deleteDoc(placeRef);
    } catch (error) {
      Alert.alert("Error deleting place:", error.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        {isLoading && <ActivityIndicator size="large" />}
        {savedPlaces.length === 0 && !isLoading && (
          <Text>
            You have no saved places. Go to the Find Section to add places.
          </Text>
        )}
        {!isLoading && savedPlaces.length > 0 && (
          <FlatList
            data={savedPlaces}
            renderItem={renderPlaceCard}
            keyExtractor={(item) => item.placeId}
            showsVerticalScrollIndicator={false} // hide scroll bar
            contentContainerStyle={{
              paddingHorizontal: 15,
              paddingTop: 15,
              paddingBottom: 60,
            }}
          />
        )}
      </View>
    </View>
  );
};

export default Saved;

const styles = StyleSheet.create({});
