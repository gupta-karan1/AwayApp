import {
  StyleSheet,
  View,
  ActivityIndicator,
  FlatList,
  Text,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { FIREBASE_DB } from "../../../firebaseConfig";
import DestinationCard from "./DestinationCard";
import GlobalStyles from "../../GlobalStyles";

const ExploreFeed = () => {
  const [loading, setLoading] = useState(true);

  const [exploreData, setExploreData] = useState([]); // destination state

  const getExploreData = async () => {
    // const destRef = collection(FIREBASE_DB, "destinations");
    // const q = query(destRef, limit(2)); // limit to 2 articles for development purposes
    // // const q = query(destRef); // use without limit for production
    // const querySnapshot = await getDocs(q);
    // // const querySnapshot = await getDocs(
    // //   collection(FIREBASE_DB, "destinations"),
    // // );
    // const data = querySnapshot.docs.map((doc) => doc.data());
    // setExploreData(data);

    try {
      const destRef = collection(FIREBASE_DB, "destinations");
      const q = query(destRef, limit(2));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => doc.data());
      setExploreData(data);
    } catch (error) {
      console.error("Error fetching explore data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getExploreData();
    // setLoading(false);
  }, []);

  const renderDestinationCard = useCallback(({ item }) => {
    return (
      <DestinationCard
        destinationItem={item}
        key={item.destinationId}
        path={`destinations/${item.destinationId}/articles`}
      />
    );
  }, []);
  //Put the destination card code within the above function to optimize performance if required.

  // const LoadingCard = () => (
  //   <View style={[styles.loadingCard, styles.container]}>
  //     <ActivityIndicator size="large" color="#0000ff" />
  //   </View>
  // );

  // const LoadingSkeleton = () => (
  //   <View style={styles.container}>
  //     <Text style={[GlobalStyles.titleLargeRegular, styles.titleText]}>
  //       Destinations
  //     </Text>
  //     <FlatList
  //       data={[{}, {}, {}]} // Empty data to display loading cards
  //       renderItem={() => <LoadingCard />}
  //       keyExtractor={(item, index) => index.toString()}
  //       horizontal
  //       ItemSeparatorComponent={() => <View style={{ width: 15 }}></View>}
  //       removeClippedSubviews={true}
  //       initialNumToRender={2}
  //       maxToRenderPerBatch={2}
  //       updateCellsBatchingPeriod={100}
  //       windowSize={2}
  //       showsHorizontalScrollIndicator={false}
  //       contentContainerStyle={{ paddingHorizontal: 15 }}
  //     />
  //   </View>
  // );

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
            data={exploreData}
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

  // loadingCard: {
  //   width: 220,
  //   height: 150,
  //   backgroundColor: "#EAEAEA",
  //   marginRight: 15,
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
});

export default ExploreFeed;
