import { StyleSheet, Text, View, Pressable, Image } from "react-native";
// import { useNavigation } from "@react-navigation/native";
import GlobalStyles from "../../GlobalStyles";
import React from "react";
import { useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { AuthContext } from "../../../hooks/AuthContext";

import PlaceDetailModal from "./PlaceDetailModal";

// display places on the destination screen based on the pathId prop passed to it.
const SavedPlaceCard = ({ placeItem, onDelete }) => {
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
    placeId,
    placeWebsite,
    createdAt,
    userId,
    userName,
  } = placeItem;

  // const { loading, singlePlaceData } = usePlaceScreen(pathId);
  const { user } = useContext(AuthContext);

  // State variable to toggle the full text

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <View style={styles.card}>
          <Image source={{ uri: placeImage }} style={styles.image} />
          <View style={styles.cardContainer}>
            <View>
              <Text style={GlobalStyles.labelMediumMedium} numberOfLines={2}>
                {placeCategory}
              </Text>
              <Text style={GlobalStyles.bodyMediumBold} numberOfLines={2}>
                {placeTitle}
              </Text>
            </View>
            <View>
              <Text style={GlobalStyles.labelMediumMedium}>{userName}</Text>
            </View>
          </View>
          <View style={styles.iconBox}>
            {userId === user.uid && (
              <Ionicons
                onPress={onDelete}
                name="md-trash-outline"
                size={20}
                color="#000"
              />
            )}
          </View>
        </View>
      </Pressable>

      {modalVisible && (
        <PlaceDetailModal
          onClose={() => setModalVisible(false)}
          modalVisible={modalVisible}
          placeItem={placeItem}
          setModalVisible={setModalVisible}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    // marginTop: 15,
  },
  card: {
    backgroundColor: "#F7F5F3",
    elevation: 1,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 10,
  },
  cardContainer: {
    flex: 1,
    padding: 15,
    justifyContent: "space-between",
  },
  iconBox: {
    position: "absolute",
    right: 7,
    bottom: 7,
    padding: 5,
  },
  image: {
    height: 130,
    width: "45%",
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    backgroundColor: "lightgrey",
  },
});

export default SavedPlaceCard;

// SUMMARY: This component renders the place card on article screen.
