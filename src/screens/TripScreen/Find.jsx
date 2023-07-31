import { StyleSheet, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import FindDestination from "./FindDestination";

// Component for Find section of TripTopNav
const Find = () => {
  // Get route from navigation
  const route = useRoute();
  // Destructure route params
  const { tripLocation } = route.params;
  console.log(tripLocation);
  // pathId for article data based on tripLocation. Lowercase to match database.
  const pathId = `destinations/${tripLocation.toLowerCase()}/articles`;

  return (
    <View showsVerticalScrollIndicator={false} style={styles.container}>
      {/* FindDestination component, passing pathId and tripLocation as props */}
      <FindDestination pathId={pathId} tripLocation={tripLocation} />
    </View>
  );
};

export default Find;

const styles = StyleSheet.create({});

// SUMMARY: Find section of TripTopNav. It accesses the tripLocation parameter from the route to determine the specific destination. It generates a pathId based on the tripLocation for fetching article data related to that destination. It renders the FindDestination component, passing the pathId and tripLocation as props.
