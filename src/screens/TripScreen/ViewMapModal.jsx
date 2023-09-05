import { StyleSheet, Text, View, Modal, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import { Dimensions } from "react-native";

// Map Modal to view saved/itinerary by date places on a map
const ViewMapModal = ({
  placeData, // array of saved places
  selectedMapDate, // selected itinerary date
  selectedMapPlaces, // array of places for selected itinerary date
  onClose,
  modalVisible,
}) => {
  const [mapInitialized, setMapInitialized] = useState(false); // State to check if map is initialized
  const [selectedPlaces, setSelectedPlaces] = useState([]); // State to store selected places
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if selectedMapDate and selectedMapPlaces are not null
    if (selectedMapDate && selectedMapPlaces) {
      // convert itinerary data to match PlaceData structure
      const flattenedSelectedPlaces = selectedMapPlaces.flatMap(
        (innerArray) => innerArray
      );
      // Set selected places to flattened array
      setSelectedPlaces(flattenedSelectedPlaces);
      setIsLoading(false);
    } else {
      // Otherwsie set selected places to placeData
      setSelectedPlaces(placeData);
      setIsLoading(false);
    }
  }, [selectedMapDate, selectedMapPlaces, placeData]);

  return (
    <Modal
      animationType="slide"
      visible={modalVisible}
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
      transparent={true}
    >
      {isLoading ? (
        <View style={styles.centeredView}>
          <ActivityIndicator size="large" color="black" />
        </View>
      ) : (
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalText}>
                {selectedMapDate
                  ? "Itinerary: " + selectedMapDate
                  : "Saved Places"}
              </Text>
              <Ionicons
                name="close-outline"
                size={30}
                color="black"
                onPress={onClose}
              />
            </View>
            {selectedMapPlaces && selectedMapPlaces.length === 0 ? (
              <Text style={styles.promptMsg}>
                No places in the itinerary for this date.
              </Text>
            ) : (
              // Otherwise display map
              <View style={styles.mapContainer}>
                <MapView
                  style={styles.map}
                  provider="google"
                  onMapReady={() => setMapInitialized(true)}
                  loadingEnabled={true}
                  initialRegion={{
                    // If selected places is not null and has length > 0, display first place in array
                    latitude:
                      selectedPlaces && selectedPlaces.length > 0
                        ? selectedPlaces[0].placeLatitude
                        : 0,
                    longitude:
                      selectedPlaces && selectedPlaces.length > 0
                        ? selectedPlaces[0].placeLongitude
                        : 0,
                    // Zoom on map
                    latitudeDelta: 0.15,
                    longitudeDelta: 0.15,
                  }}
                >
                  {mapInitialized &&
                    selectedPlaces &&
                    // Map through selected places array
                    selectedPlaces.map((place) => (
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
      )}
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
    paddingHorizontal: 15,
    paddingTop: 15,
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
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height - 100,
  },
});

/* {placeData.length === 0 ? (
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
}; */
