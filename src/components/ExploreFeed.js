import { StyleSheet, Text, View, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { FIREBASE_APP, FIREBASE_DB } from "../../firebaseConfig";

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

  // DestinationCard component
  const DestinationCard = ({ country, description, name, image }) => {
    return (
      <View>
        <Image source={{ uri: image }} style={{ height: 200, width: 200 }} />
        <Text>{name}</Text>
        <Text>{country}</Text>
        <Text>{description}</Text>
      </View>
    );
  };

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
          />
        ))}
    </View>
  );
};

export default ExploreFeed;

const styles = StyleSheet.create({});
