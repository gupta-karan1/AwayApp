import { StyleSheet, Text, View, Image } from "react-native";

// DestinationCard component
const DestinationCard = ({ country, description, name, image }) => {
  return (
    <View>
      <Image source={{ uri: image }} style={styles.image} />
      <Text>{name}</Text>
      <Text>{country}</Text>
      <Text>{description}</Text>
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
