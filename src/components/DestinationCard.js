import { StyleSheet, Text, View, Image, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DestinationScreen from "../screens/DestinationScreen";
import { useNavigation } from "@react-navigation/native";

// DestinationCard component
const DestinationCard = ({ country, description, name, image }) => {
  const navigation = useNavigation();
  return (
    <View>
      <Image source={{ uri: image }} style={styles.image} />
      <Text>{name}</Text>
      <Text>{country}</Text>
      <Text>{description}</Text>
      <Button
        title="Read More"
        // onPress={navigation.navigate("DestinationScreen")}
      />
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
