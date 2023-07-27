import { StyleSheet, View, FlatList, Text } from "react-native";
import { useCallback } from "react";

import DestinationCard from "./DestinationCard";
import GlobalStyles from "../../GlobalStyles";
import useDestinationFeed from "../../../hooks/useDestinationFeed";

const ExploreFeed = () => {
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
        ListEmptyComponent={
          <View
            style={{
              width: 220,
              height: 150,
              backgroundColor: "lightgrey",
              borderRadius: 10,
            }}
          ></View>
        }
      />
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
