import { StyleSheet, Text, View, Button, Pressable, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

// DestinationCard component
const DestinationCard = ({ country, description, name, image, path }) => {
  const { navigate } = useNavigation();
  return (
    <View>
      <Pressable
        onPress={() =>
          navigate("DestinationScreen", {
            pathId: path,
          })
        }
      >
        <Image source={{ uri: image }} style={styles.image} />
        <Text>{name}</Text>
        <Text>{country}</Text>
        <Text>{description}</Text>
        <Text>{path}</Text>
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
