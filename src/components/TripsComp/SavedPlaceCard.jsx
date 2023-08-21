import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  Modal,
  ScrollView,
  TouchableOpacity,
} from "react-native";
// import { useNavigation } from "@react-navigation/native";
import GlobalStyles from "../../GlobalStyles";
import React from "react";
import { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

// display places on the destination screen based on the pathId prop passed to it.
const SavedPlaceCard = ({ placeItem, onDelete, onDrag }) => {
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
  } = placeItem;

  // const { loading, singlePlaceData } = usePlaceScreen(pathId);

  // State variable to toggle the full text
  const [showFullText, setShowFullText] = useState(false);

  // Function to toggle the full text
  const toggleFullText = () => {
    setShowFullText(!showFullText);
  };

  // Function to format place hours in Firebase for display so that each item is on a new line
  const formatPlaceHours = () => {
    if (placeHours) {
      const hoursArray = placeHours // Get the placeHours string
        .split(",") // Split the string by comma
        .map((item) => item.trim()); // Trim the whitespace from each item
      return hoursArray.join("\n"); // Join the array with a new line
    }
    return ""; // Return empty string if placeHours is not available
  };

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.card} onLongPress={onDrag}>
        <Image source={{ uri: placeImage }} style={styles.image} />
        <View style={styles.cardText}>
          <Text style={GlobalStyles.labelMediumMedium} numberOfLines={2}>
            {placeCategory}
          </Text>
          <Text style={GlobalStyles.bodyMediumBold} numberOfLines={3}>
            {placeTitle}
          </Text>
        </View>
        <View style={styles.iconBox}>
          <Ionicons
            onPress={() => setModalVisible(true)}
            name="information-circle-outline"
            size={24}
            color="black"
          />
          <Ionicons
            onPress={onDelete}
            name="md-trash-outline"
            size={24}
            color="black"
          />
        </View>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        // presentationStyle="overFullScreen"
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Image source={{ uri: placeImage }} style={styles.modalImage} />
              <View style={styles.textContainer}>
                <Text
                  style={[GlobalStyles.bodySmallRegular, styles.subtitleText]}
                >
                  {placeCategory}
                </Text>
                <Text
                  style={[GlobalStyles.titleLargeRegular, styles.titleText]}
                >
                  {placeTitle}
                </Text>

                {showFullText ? (
                  <View>
                    <Text
                      style={[GlobalStyles.bodySmallRegular, styles.bodyText]}
                    >
                      {placeDescription || ""}
                    </Text>
                    <TouchableOpacity onPress={toggleFullText}>
                      <Text
                        style={[styles.para, GlobalStyles.bodySmallRegular]}
                      >
                        Read Less
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View>
                    <Text
                      style={[GlobalStyles.bodySmallRegular, styles.bodyText]}
                    >
                      {placeDescription && placeDescription.slice(0, 150)}
                      {"... "}
                    </Text>
                    <TouchableOpacity onPress={toggleFullText}>
                      <Text
                        style={[GlobalStyles.bodySmallRegular, styles.para]}
                      >
                        Read More
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Only display if data exists */}
                {placeAddress && (
                  <View style={styles.iconContainer}>
                    <FontAwesome
                      style={[styles.icon, styles.AddressIcon]}
                      name="map-marker"
                      size={20} // Smaller icon require more margin
                      color="grey"
                    />
                    <Text
                      style={[GlobalStyles.bodySmallRegular, styles.bodyText]}
                    >
                      {placeAddress}
                    </Text>
                  </View>
                )}

                {placeContact && (
                  <View style={styles.iconContainer}>
                    <FontAwesome
                      style={styles.icon}
                      name="phone"
                      size={18}
                      color="grey"
                    />
                    <Text
                      style={[GlobalStyles.bodySmallRegular, styles.bodyText]}
                    >
                      {placeContact}
                    </Text>
                  </View>
                )}
                {placeHours && (
                  <View style={styles.iconContainer}>
                    <FontAwesome
                      style={styles.icon}
                      name="clock-o"
                      size={18}
                      color="grey"
                    />
                    <Text
                      style={[GlobalStyles.bodySmallRegular, styles.bodyText]}
                    >
                      {formatPlaceHours()}
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>

            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  card: {
    backgroundColor: "lightgrey",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderRadius: 10,
  },
  cardText: {
    width: "45%",
    paddingLeft: 10,
    paddingTop: 20,
    paddingRight: 10,
  },
  iconBox: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: 4,
    gap: 69,
  },
  image: {
    height: 130,
    width: "45%",
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    backgroundColor: "lightgrey",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 90,
    backgroundColor: "rgba(0,0,0,0.6)",
    // overflow: "hidden",
  },
  modalView: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    // overflow: "hidden",
  },
  modalImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  subtitleText: {
    marginTop: 5,
    marginBottom: 10,
  },
  titleText: {
    marginBottom: 10,
    fontSize: 25,
  },
  bodyText: {
    marginBottom: 5,
  },
  icon: {
    marginRight: 15,
  },
  AddressIcon: {
    marginRight: 18,
  },
  textContainer: {
    width: 290,
  },

  iconContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 5,
    width: "100%",
  },
  para: {
    marginTop: 10,
    marginBottom: 30,
    textDecorationLine: "underline",
  },
  button: {
    marginVertical: 10,
  },

  buttonClose: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default SavedPlaceCard;

// SUMMARY: This component renders the place card on article screen.
