import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import React, { useState } from "react";
import GlobalStyles from "../../GlobalStyles";
import { FontAwesome } from "@expo/vector-icons";

const PlaceDetailModal = ({
  onClose,
  modalVisible,
  placeItem,
  setModalVisible,
}) => {
  const {
    placeTitle,
    placeCategory,
    placeDescription,
    placeImage,
    placeAddress,
    placeContact,
    placeHours,
    placeGoogleMapLink,
  } = placeItem;

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

  return (
    <Modal
      animationType="fade"
      transparent={true}
      // presentationStyle="overFullScreen"
      visible={modalVisible}
      onRequestClose={() => {
        // Alert.alert("Modal has been closed.");
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
              <Text style={[GlobalStyles.titleLargeRegular, styles.titleText]}>
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
                    <Text style={[styles.para, GlobalStyles.bodySmallRegular]}>
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
                    <Text style={[GlobalStyles.bodySmallRegular, styles.para]}>
                      Read More
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Only display if data exists */}
              {placeAddress && (
                <Pressable
                  onPress={() => {
                    Linking.openURL(placeGoogleMapLink);
                  }}
                >
                  <View style={styles.iconContainer}>
                    <FontAwesome
                      style={[styles.icon, styles.AddressIcon]}
                      name="map-marker"
                      size={20} // Smaller icon require more margin
                      color="#63725A"
                    />
                    <Text
                      style={[GlobalStyles.bodySmallRegular, styles.bodyText]}
                    >
                      {placeAddress}
                    </Text>
                  </View>
                </Pressable>
              )}

              {placeContact && (
                <Pressable
                  onPress={() => {
                    const phoneNumber = `tel:${placeContact}`;
                    Linking.openURL(phoneNumber);
                  }}
                >
                  <View style={styles.iconContainer}>
                    <FontAwesome
                      style={styles.icon}
                      name="phone"
                      size={18}
                      color="#63725A"
                    />
                    <Text
                      style={[GlobalStyles.bodySmallRegular, styles.bodyText]}
                    >
                      {placeContact}
                    </Text>
                  </View>
                </Pressable>
              )}
              {placeHours && (
                <View style={styles.iconContainer}>
                  <FontAwesome
                    style={styles.icon}
                    name="clock-o"
                    size={18}
                    color="#63725A"
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
            onPress={onClose}
          >
            <Text style={[styles.textStyle, GlobalStyles.bodySmallRegular]}>
              Cancel
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default PlaceDetailModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 90,
    backgroundColor: "rgba(0,0,0,0.6)",
    // overflow: "visible",
    // width: "100%",
  },
  modalView: {
    // width: "90%",
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
    // overflow: "visible",
    // overflow: "scroll",
  },
  modalImage: {
    // width: "50%",
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
    // width: "100%",
    maxWidth: 270,
    // overflow: "visible",
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
    backgroundColor: "#63725A",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 50,
  },
  textStyle: {
    color: "#EFFBB7",
    textAlign: "center",
  },
});
