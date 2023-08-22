import { StyleSheet, Text, View, Modal } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import { Dimensions } from "react-native";

const ViewMapModal = ({ placeData, onClose, modalVisible }) => {
  const [mapInitialized, setMapInitialized] = useState(false);

  return (
    <Modal
      animationType="slide"
      visible={modalVisible}
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
      transparent={true}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalText}>Saved Places Map</Text>
            <Ionicons
              name="close-outline"
              size={30}
              color="black"
              //   onPress={() => setModalVisible(false)}
              onPress={onClose}
            />
          </View>

          {placeData.length === 0 ? (
            <Text style={styles.promptMsg}>No places saved yet.</Text>
          ) : (
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                provider="google"
                // onLayout={onMapReady}
                onMapReady={() => setMapInitialized(true)}
                loadingEnabled={true}
                initialRegion={{
                  latitude: placeData[0].placeLatitude,
                  longitude: placeData[0].placeLongitude,
                  latitudeDelta: 0.15,
                  longitudeDelta: 0.15,
                }}
              >
                {mapInitialized &&
                  placeData.map((place) => (
                    <Marker
                      key={place.placeId}
                      coordinate={{
                        latitude: place.placeLatitude,
                        longitude: place.placeLongitude,
                      }}
                      title={place.placeTitle}
                      description={place.placeCategory}
                    />
                  ))}
              </MapView>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ViewMapModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    width: "100%",
  },
  modalView: {
    backgroundColor: "#fff",
    height: "90%",
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
    marginHorizontal: 10,
  },
  modalText: {
    fontSize: 20,
  },

  innerContainer: {
    width: "100%",
  },
  secondaryAction: {
    textAlign: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: "center",
    borderColor: "lightgrey",
    borderWidth: 1,
    marginHorizontal: 90,
    marginVertical: 10,
    borderRadius: 100,
  },

  mapContainer: {
    flex: 1,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height - 100,
    flex: 1,
  },
});
