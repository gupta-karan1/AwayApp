import { StyleSheet, View, FlatList, Text } from "react-native";
import { useCallback } from "react";
import DestinationCard from "./DestinationCard";
import GlobalStyles from "../../GlobalStyles";
import useDestinationFeed from "../../../hooks/useDestinationFeed";

// This component is used to display destinations from the Firestore collection. It uses the useDestinationFeed hook to fetch data from the Firestore database and display it in a FlatList component.
const DestinationFeed = () => {
  const { destinationData } = useDestinationFeed(); // The useDestinationFeed hook is used to fetch data from the Firestore database and store it in the destinationData state variable.

  // The renderDestinationCard function is used to render each destination item in the FlatList component. It is memoized using the useCallback hook to prevent unnecessary re-renders. The destinationItem prop is passed to the DestinationCard component to display the destination data.
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
        data={destinationData} // The destinationData state variable is passed to the data prop of the FlatList component to display the data fetched from the Firestore collection.
        renderItem={renderDestinationCard} // The renderDestinationCard function is passed to the renderItem prop of the FlatList component to render each destination item.
        keyExtractor={(item) => item.destinationId} // The keyExtractor prop is used to extract the destinationId from each destination item and use it as the key for each item in the FlatList component.
        horizontal // The horizontal prop is used to display the FlatList component horizontally.
        ItemSeparatorComponent={() => <View style={{ width: 15 }}></View>} // The ItemSeparatorComponent prop is used to add a separator between each destination item in the FlatList component.
        removeClippedSubviews={true} // The removeClippedSubviews prop is used to improve the performance of the FlatList component by removing items that are not currently visible on the screen.
        initialNumToRender={2} // The initialNumToRender prop is used to specify the number of items to render initially.
        maxToRenderPerBatch={2} // The maxToRenderPerBatch prop is used to specify the maximum number of items to render per batch.
        updateCellsBatchingPeriod={100} // The updateCellsBatchingPeriod prop is used to specify the time between each batch of items to render.
        windowSize={2} // The windowSize prop is used to specify the number of items to render before and after the current item.
        showsHorizontalScrollIndicator={false} // The showsHorizontalScrollIndicator prop is used to hide the horizontal scroll indicator.
        contentContainerStyle={{ paddingHorizontal: 15 }} // The contentContainerStyle prop is used to add padding to the FlatList component.
        ListEmptyComponent={
          // The ListEmptyComponent prop is used to display a message when the FlatList component is empty.
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

export default DestinationFeed;
