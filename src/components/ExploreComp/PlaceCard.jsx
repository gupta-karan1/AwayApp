import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import GlobalStyles from "../../GlobalStyles";

// display places on the destination screen based on the pathId prop passed to it.
const PlaceCard = ({ placeItem, path }) => {
  // The PlaceCard component accepts the placeItem and path props.
  // The placeItem prop contains the data for the place to be displayed.
  // The path prop contains the pathId of the destination that the place is from.

  // The useNavigation hook is used to access the navigation prop of the component. This allows the component to navigate to other screens.
  const { navigate } = useNavigation();

  // The placeItem prop is destructured to extract the data for the place to be displayed.
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

  // The component returns a Pressable component that displays the place image, category, and title.
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
    backgroundColor: "lightgrey",
  },
});

export default PlaceCard;
