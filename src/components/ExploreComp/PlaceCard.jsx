import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import GlobalStyles from "../../GlobalStyles";

const PlaceCard = ({ placeItem, path }) => {
  const { navigate } = useNavigation();
  const {
    placeAddress,
    placeCategory,
    placeContact,
    placeDescription,
    placeGoogleMapLink,
    placeHours,
    placeImage,
    placeLatitude,
    placeLongitude,
    placeSaved,
    placeTitle,
    placeWebsite,
  } = placeItem;

  return (
    <Pressable
      style={styles.container}
      onPress={() =>
        navigate("PlaceScreen", {
          pathId: path,
          placeAddress,
          placeCategory,
          placeContact,
          placeDescription,
          placeGoogleMapLink,
          placeHours,
          placeImage,
          placeLatitude,
          placeLongitude,
          placeSaved,
          placeTitle,
          placeWebsite,
        })
      }
    >
      <Image source={{ uri: placeImage }} style={styles.image} />
      <Text style={GlobalStyles.labelMediumMedium}>{placeCategory}</Text>
      <Text style={GlobalStyles.bodyMediumBold} numberOfLines={1}>
        {placeTitle}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "48%",
    marginBottom: 30,
  },
  image: {
    height: 130,
    borderRadius: 10,
    marginBottom: 5,
  },
});

export default PlaceCard;
