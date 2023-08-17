import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import GlobalStyles from "../../GlobalStyles";
import { Ionicons } from "@expo/vector-icons";

// display places on the destination screen based on the pathId prop passed to it.
const ProfilePlaceCard = ({ placeItem, path, onDelete }) => {
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
    placeId,
  } = placeItem;

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() =>
          navigate("ProfilePlace", {
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
            placeId,
          })
        }
      >
        <Image source={{ uri: placeImage }} style={styles.image} />
      </Pressable>
      <View style={styles.cardFooter}>
        <View style={styles.cardText}>
          <Text style={GlobalStyles.labelMediumMedium}>{placeCategory}</Text>
          <Text style={GlobalStyles.bodyMediumBold} numberOfLines={2}>
            {placeTitle}
          </Text>
        </View>
        <View style={styles.iconBox}>
          {/* <Ionicons
            onPress={() => setModalVisible(true)}
            name="information-circle-outline"
            size={24}
            color="black"
          /> */}
          <Ionicons
            onPress={onDelete}
            name="md-trash-outline"
            size={22}
            color="black"
          />
        </View>
      </View>
    </View>
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
    // marginBottom: 5,
    backgroundColor: "lightgrey",
  },
  iconBox: {
    paddingRight: 4,
  },
  cardFooter: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  cardText: {
    wordWrap: "wrap",
  },
});

export default ProfilePlaceCard;

// SUMMARY: This component renders the place card on article screen.
