import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

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
    <View>
      <Pressable
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
        <Text>{placeTitle}</Text>
        <Text>{placeCategory}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 200,
    width: 200,
  },
});

export default PlaceCard;
