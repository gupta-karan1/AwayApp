import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

// DestinationCard component
const DestinationCard = ({ destinationItem, path }) => {
  const { country, description, destinationName, imageUrl } = destinationItem;
  const { navigate } = useNavigation();

  return (
    <View>
      <Pressable
        style={styles.container}
        onPress={() =>
          navigate("DestinationScreen", {
            pathId: path,
            destinationName: destinationName,
            destinationCountry: country,
            destinationDescription: description,
            destinationImage: imageUrl,
          })
        }
      >
        <Image source={{ uri: imageUrl }} style={styles.image} />

        <Text>{destinationName}</Text>
        <Text>{country}</Text>
      </Pressable>
    </View>
  );
};

export default DestinationCard;

const styles = StyleSheet.create({
  image: {
    height: 200,
    width: 200,
  },
});
