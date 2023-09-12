import {
  StyleSheet,
  Text,
  Pressable,
  ImageBackground,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import GlobalStyles from "../../GlobalStyles";
import { Feather } from "@expo/vector-icons";
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
      <View style={styles.imageContainer}>
        <ImageBackground source={{ uri: placeImage }} style={styles.image}>
          <Pressable
            style={styles.saveButton}
            onPress={() => {
              if (!user) {
                Navigation.navigate("TripsStackGroup");
              } else {
                setModalVisible(true);
              }
            }}
          >
            <Feather name="plus" size={24} color="#63725A" />
          </Pressable>
        </ImageBackground>
      </View>
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
    marginBottom: 5,
    backgroundColor: "lightgrey",
  },
  imageContainer: {
    width: "100%",
    height: 130,
    overflow: "hidden",
    borderRadius: 10,
  },
  saveButton: {
    position: "absolute",
    top: 5,
    right: 5,
    padding: 5,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    // backgroundColor: "rgba(99, 114, 90, .6)",
    borderRadius: 50,
    elevation: 2,
  },
});

export default PlaceCard;

// SUMMARY: This component renders the place card on article screen.
