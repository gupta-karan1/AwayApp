import { StyleSheet, Text, Pressable, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import GlobalStyles from "../../GlobalStyles";
import { FontAwesome } from "@expo/vector-icons";
import SavePlaceModal from "../../screens/ExploreScreen/SavePlaceModal";
import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../../hooks/AuthContext";

// display places on the destination screen based on the pathId prop passed to it.
const PlaceCard = ({ placeItem, path }) => {
  // The useNavigation hook is used to access the navigation prop of the component. This allows the component to navigate to other screens.
  const { navigate } = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const { user } = useContext(AuthContext);

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

  const Navigation = useNavigation();

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
          placeId,
        })
      }
    >
      <ImageBackground source={{ uri: placeImage }} style={styles.image}>
        <Pressable
          style={styles.saveButton}
          onPress={() => {
            if (!user) {
              Navigation.navigate("ProfileStackGroup");
            } else {
              setModalVisible(true);
            }
          }}
        >
          <FontAwesome name="plus-circle" size={24} color="black" />
        </Pressable>
      </ImageBackground>
      {modalVisible && (
        <SavePlaceModal
          onClose={() => setModalVisible(false)}
          modalVisible={modalVisible}
          placeData={{
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
          }}
        />
      )}
      {/* <FontAwesome name="bookmark-o" size={24} color="black" /> */}
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

// SUMMARY: This component renders the place card on article screen.
