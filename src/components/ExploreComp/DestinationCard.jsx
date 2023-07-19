import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import GlobalStyles from "../../GlobalStyles";

// DestinationCard component
const DestinationCard = ({ destinationItem, path }) => {
  const { country, description, destinationName, imageUrl } = destinationItem;
  const { navigate } = useNavigation();

  return (
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

      <Text style={GlobalStyles.labelMediumMedium}>{country}</Text>
      <Text style={GlobalStyles.bodyMediumBold}>{destinationName}</Text>
    </Pressable>
  );
};

export default DestinationCard;

const styles = StyleSheet.create({
  container: {
    width: 220,
  },
  image: {
    height: 150,
    width: 220,
    borderRadius: 10,
  },
});
