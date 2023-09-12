import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import GlobalStyles from "../../GlobalStyles";

// This component is used to display a single destination on the explore page. It is used to display destinations from the Firestore collection.
const DestinationCard = ({ destinationItem, path }) => {
  // The destinationItem prop contains the data for the destination to be displayed. The path prop contains the pathId for the destination.

  const { country, description, destinationName, imageUrl } = destinationItem; // The data for the destination is extracted from the destinationItem prop. This data is used to display the destination on the explore page.

  const { navigate } = useNavigation(); // The useNavigation hook is used to get the navigation object from the nearest navigation context. This navigation object is used to navigate to the destination screen when the destination card is pressed.

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

const styles = StyleSheet.create({
  container: {
    width: 280,
  },
  image: {
    height: 190,
    width: 280,
    borderRadius: 10,
    marginBottom: 5,
    backgroundColor: "lightgrey",
  },
});

export default DestinationCard;

// SUMMARY: Overall, this component encapsulates the logic for displaying a single destination on the explore page. It is designed to be used in React components, allowing them to display destinations from the Firestore collection easily and consistently.
