import { StyleSheet, Text, View, Image } from "react-native";
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
      {loading && <Text>Loading...</Text>}
      {!loading &&
        exploreData.map((item) => (
          <DestinationCard
            country={item.country}
            description={item.description}
            key={item.destinationId}
            name={item.destinationName}
            image={item.imageUrl}
            path={`destinations/${item.destinationId}/articles`}
          />
        ))}
    </View>
  );
};

export default ExploreFeed;

const styles = StyleSheet.create({});
