import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import useArticleData from "../../../hooks/useDestinationScreen";
import DestinationScreen from "../ExploreScreen/DestinationScreen";
import FindDestination from "./FindDestination";

const Find = () => {
  const route = useRoute();
  const { tripLocation } = route.params;
  const pathId = `destinations/${tripLocation.toLowerCase()}/articles`;

  // const { loading, articleData } = useArticleData(pathId);
  // console.log(articleData);

  return (
    <View showsVerticalScrollIndicator={false} style={styles.container}>
      <FindDestination pathId={pathId} tripLocation={tripLocation} />
    </View>
  );
};

export default Find;

const styles = StyleSheet.create({});
