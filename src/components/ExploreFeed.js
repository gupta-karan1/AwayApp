import { StyleSheet, View, ActivityIndicator, FlatList } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebaseConfig";
import DestinationCard from "./DestinationCard";

const ExploreFeed = () => {
  const [exploreData, setExploreData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getExploreData = async () => {
    const destRef = collection(FIREBASE_DB, "destinations");
    const q = query(destRef, limit(2));
    const querySnapshot = await getDocs(q);
    // const querySnapshot = await getDocs(
    //   collection(FIREBASE_DB, "destinations"),
    // );
    const data = querySnapshot.docs.map((doc) => doc.data());
    setExploreData(data);
  };

  useEffect(() => {
    getExploreData();
    setLoading(false);
  }, []);

  const renderDestinationCard = useCallback(({ item }) => {
    return (
      <DestinationCard
        destinationItem={item}
        // key={item.destinationId}
        path={`destinations/${item.destinationId}/articles`}
      />
    );
  });
  //Put the destination card code within the above function to optimize performance if required.

  return (
    <View>
      {loading && <ActivityIndicator size="large" />}
      {!loading && (
        <FlatList
          data={exploreData}
          renderItem={renderDestinationCard}
          keyExtractor={(item) => item.destinationId}
          horizontal
          // Performance settings
          removeClippedSubviews={true} // Unmount components when outside of window
          initialNumToRender={2} // Reduce initial render amount
          maxToRenderPerBatch={2} // Reduce number in each render batch
          updateCellsBatchingPeriod={100} // Increase time between renders
          windowSize={2} // Reduce the window size
        />
      )}
    </View>
  );
};

export default ExploreFeed;

const styles = StyleSheet.create({});
