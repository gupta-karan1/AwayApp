import {
  StyleSheet,
  View,
  ActivityIndicator,
  FlatList,
  Text,
} from "react-native";
import { useCallback } from "react";
// import React, { useState, useEffect, useCallback } from "react";
// import { collection, getDocs, limit, query } from "firebase/firestore";
// import { FIREBASE_DB } from "../../../firebaseConfig";
import DestinationCard from "./DestinationCard";
import GlobalStyles from "../../GlobalStyles";
import useDestinationFeed from "../../../hooks/useDestinationFeed";

const ExploreFeed = () => {
  // const [loading, setLoading] = useState(true);

  // const [exploreData, setExploreData] = useState([]); // destination state

  // const getExploreData = async () => {
  //   try {
  //     const destRef = collection(FIREBASE_DB, "destinations");
  //     const q = query(destRef, limit(2));
  //     const querySnapshot = await getDocs(q);
  //     const data = querySnapshot.docs.map((doc) => doc.data());
  //     setExploreData(data);
  //   } catch (error) {
  //     console.error("Error fetching explore data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   getExploreData();
  // }, []);

  const { loading, destinationData } = useDestinationFeed();

  const renderDestinationCard = useCallback(({ item }) => {
    return (
      <DestinationCard
        destinationItem={item}
        key={item.destinationId}
        path={`destinations/${item.destinationId}/articles`}
      />
    );
  }, []);

  return (
    <View>
      {loading ? (
        <ActivityIndicator size={"large"} />
      ) : (
        <View style={styles.container}>
          <Text style={[GlobalStyles.titleLargeRegular, styles.titleText]}>
            Destinations
          </Text>
          <FlatList
            data={destinationData}
            renderItem={renderDestinationCard}
            keyExtractor={(item) => item.destinationId}
            horizontal
            ItemSeparatorComponent={() => <View style={{ width: 15 }}></View>}
            removeClippedSubviews={true}
            initialNumToRender={2}
            maxToRenderPerBatch={2}
            updateCellsBatchingPeriod={100}
            windowSize={2}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 15 }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 30,
  },
  titleText: {
    marginBottom: 15,
    marginLeft: 15,
  },
});

export default ExploreFeed;
