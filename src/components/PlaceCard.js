import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

const PlaceCard = ({ address, category, contact, description, googleMap, hours, image, lattitude, longitude, saved, title, website, path }) => {
    const { navigate } = useNavigation();

  return (
    <View>
        <Pressable
        onPress={() =>
          navigate("PlaceScreen", {
            pathId: path,
            address, category, contact, description, googleMap, hours, image, lattitude, longitude, saved, title, website
          })
        }
      >
        <Image source={{ uri: image }} style={styles.image} />
        <Text>{address}</Text>
        <Text>{category}</Text>
        <Text>{contact}</Text>
        <Text>{description}</Text>
        <Text>{googleMap}</Text>
        <Text>{hours}</Text>
        <Text>{lattitude}</Text>
        <Text>{longitude}</Text>
        <Text>{saved}</Text>
        <Text>{title}</Text>
        <Text>{website}</Text>
        <Text>{path}</Text>
      </Pressable>
      </View>
  )
}

const styles = StyleSheet.create({
    image: {
      height: 200,
      width: 200,
    },
  });

export default PlaceCard