import {
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
} from "react-native";
import React, { useEffect } from "react";

import { useState, useContext } from "react";
import { AuthContext } from "../../../hooks/AuthContext";
import { Alert } from "react-native";
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { FIREBASE_DB } from "../../../firebaseConfig";
import { FlatList } from "react-native";
import SavedPlaceCard from "../../components/TripsComp/SavedPlaceCard";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

const Saved = ({ tripId }) => {
  const [savedPlaces, setSavedPlaces] = useState([]); // State to store saved places
  const [isLoading, setIsLoading] = useState(false); // State to show loading indicator

  // Access user object from AuthContext to get user id
  const { user } = useContext(AuthContext);

  const getPlaces = async () => {
    try {
      setIsLoading(true); // show loading indicator
      const q = query(
        collection(FIREBASE_DB, "users"),
        where("userId", "==", user.uid)
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

      // await addDoc(collection(tripRef, "saved"), placeData);

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
      Alert.alert("Error getting places:", error.message);
    } finally {
      setIsLoading(false); // set loading state to false after form submission
    }
  };

  useFocusEffect(
    useCallback(() => {
      getPlaces();
    }, []) // Function only called once
  );

  const renderPlaceCard = ({ item }) => {
    return (
      <SavedPlaceCard
        key={item.placeId}
        placeItem={item}
        // path={`${pathId}/${item.articleId}/places`}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View>
        {isLoading ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={savedPlaces}
            renderItem={renderPlaceCard}
            keyExtractor={(item) => item.placeId}
            // numColumns={2} // display items in 2 columns
            // columnWrapperStyle={{
            //   justifyContent: "space-between", // add space between columns
            // }}
            showsVerticalScrollIndicator={false} // hide scroll bar
            contentContainerStyle={{
              paddingHorizontal: 15,
              paddingTop: 15,
              paddingBottom: 60,
            }} // add padding to left and right
            // List header component to display the article details
          />
        )}
      </View>
    </View>
  );
};

export default Saved;

const styles = StyleSheet.create({});
