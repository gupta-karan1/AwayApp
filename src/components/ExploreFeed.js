import { StyleSheet, View, ActivityIndicator, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebaseConfig";
import DestinationCard from "./DestinationCard";

const ExploreFeed = () => {
  const [exploreData, setExploreData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getExploreData = async () => {
    const querySnapshot = await getDocs(
      collection(FIREBASE_DB, "destinations")
    );
    const data = querySnapshot.docs.map((doc) => doc.data());
    setExploreData(data);
  };

  useEffect(() => {
    getExploreData();
    setLoading(false);
  }, []);

  return (
    <View>
      {loading && <ActivityIndicator size="large" />}
      {!loading && (
        <FlatList
          data={exploreData}
          renderItem={({ item }) => (
            <DestinationCard
              destinationItem={item}
              key={item.destinationId}
              path={`destinations/${item.destinationId}/articles`}
            />
          )}
          keyExtractor={(item) => item.destinationId}
        />
      )}
    </View>
  );
};

export default ExploreFeed;

const styles = StyleSheet.create({});
