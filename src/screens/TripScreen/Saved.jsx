import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useState } from "react";
// import { AuthContext } from "../../../hooks/AuthContext";
import { Alert } from "react-native";
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { FIREBASE_DB } from "../../../firebaseConfig";
import { FlatList } from "react-native";
import SavedPlaceCard from "../../components/TripsComp/SavedPlaceCard";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import GlobalStyles from "../../GlobalStyles";
// import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import ViewMapModal from "./ViewMapModal";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import Toast from "react-native-root-toast";

const Saved = () => {
  const route = useRoute();
  const { tripId, userId } = route.params;
  const [savedPlaces, setSavedPlaces] = useState([]); // State to store saved places
  const [isLoading, setIsLoading] = useState(false); // State to show loading indicator
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // State to show modal

  // Access user object from AuthContext to get user id
  // const { user } = useContext(AuthContext);

  const Navigation = useNavigation();

  const getSavedPlaces = async () => {
    try {
      setIsLoading(true); // show loading indicator
      const q = query(
        collection(FIREBASE_DB, "users"),
        where("userId", "==", userId)
      );

      const querySnapshot = await getDocs(q); // get user documents from user collection based on user id
      const userRef = doc(FIREBASE_DB, "users", querySnapshot.docs[0].id); //Create a reference to this user's document

      // create a trip reference to the trip document
      const q2 = query(
        collection(userRef, "trips"),
        where("tripId", "==", tripId)
      );
      const querySnapshot2 = await getDocs(q2);
      const tripRef = doc(userRef, "trips", querySnapshot2.docs[0].id);

      // get documents from the "saved" subcollection under specific user
      const q3 = query(
        collection(tripRef, "saved"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot3 = await getDocs(q3);
      const saved = querySnapshot3.docs.map((doc) => doc.data());

      setSavedPlaces(saved);

      // Add the place data to the "saved" subcollection under specific user
    } catch (error) {
      Alert.alert("Error getting saved places:", error.message);
    } finally {
      setIsLoading(false); // set loading state to false after form submission
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!deleteLoading) {
        getSavedPlaces();
      }
    }, [deleteLoading])
  );

  const renderPlaceCard = ({ item }) => {
    return (
      <SavedPlaceCard
        key={item.placeId}
        placeItem={item}
        onDelete={() => confirmDelete(item)}
      />
    );
  };

  const confirmDelete = (item) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this place?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => handleDeletePlace(item.placeId),
        },
      ]
    );
  };

  const handleDeletePlace = async (placeId) => {
    try {
      setDeleteLoading(true);
      const q = query(
        collection(FIREBASE_DB, "users"),
        where("userId", "==", userId)
      );

      const querySnapshot = await getDocs(q);
      const userRef = doc(FIREBASE_DB, "users", querySnapshot.docs[0].id);

      const q2 = query(
        collection(userRef, "trips"),
        where("tripId", "==", tripId)
      );
      const querySnapshot2 = await getDocs(q2);
      const tripRef = doc(userRef, "trips", querySnapshot2.docs[0].id);

      const q3 = query(
        collection(tripRef, "saved"),
        where("placeId", "==", placeId)
      );
      const querySnapshot3 = await getDocs(q3);
      const placeRef = doc(tripRef, "saved", querySnapshot3.docs[0].id);

      await deleteDoc(placeRef);
      Toast.show(`Place removed from Wishlist`, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM - 50,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: "#63725A",
      });
    } catch (error) {
      Alert.alert("Error deleting place:", error.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading && <ActivityIndicator size="large" />}
      {savedPlaces.length === 0 && !isLoading && (
        <Pressable
          style={styles.emptyContainer}
          onPress={() => {
            Navigation.navigate("FindStack");
            setModalVisible(false);
          }}
        >
          <Text style={GlobalStyles.bodySmallRegular}>
            You have no places in your Wishlist
          </Text>
          <Text style={styles.navText}>Go to Explore</Text>
        </Pressable>
      )}
      {!isLoading && savedPlaces.length > 0 && (
        <FlatList
          data={savedPlaces}
          renderItem={renderPlaceCard}
          keyExtractor={(item) => item.placeId}
          showsVerticalScrollIndicator={false} // hide scroll bar
          contentContainerStyle={styles.contentContainer}
          removeClippedSubviews={true}
          initialNumToRender={3}
          maxToRenderPerBatch={3}
          updateCellsBatchingPeriod={100}
          windowSize={3}
          ListHeaderComponent={
            <View style={styles.headerContainer}>
              <Text style={GlobalStyles.titleLargeRegular}>Wishlist</Text>
              <TouchableOpacity
                style={styles.mapButton}
                title="View Map"
                onPress={() => setModalVisible(true)}
              >
                <Ionicons name="map-outline" size={22} color="#63725A" />
                {/* <Text>Map</Text> */}
              </TouchableOpacity>
              {modalVisible && (
                <ViewMapModal
                  onClose={() => setModalVisible(false)}
                  modalVisible={modalVisible}
                  placeData={savedPlaces}
                />
              )}
            </View>
          }
        />
      )}
    </View>
  );
};

export default Saved;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#fff",
    // marginTop: StatusBar.currentHeight || 0,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 15,
    marginTop: -10,
  },
  contentContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 80,
  },
  // button: {
  //   paddingVertical: 10,
  //   paddingHorizontal: 10,
  //   borderRadius: 5,
  //   flexDirection: "row",
  //   gap: 10,
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  mapButton: {
    backgroundColor: "#E5E8E3",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    flexDirection: "row",
    gap: 10,
  },
  instructionText: {
    padding: 10,
    alignItems: "center",
    backgroundColor: "lightgrey",
    margin: 10,
    borderRadius: 10,
  },
  emptyContainer: {
    // flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E5E8E3",
    borderRadius: 10,
    marginHorizontal: 10,
    // marginTop: 10,
    padding: 20,
    marginBottom: 20,
  },
  navText: {
    textDecorationLine: "underline",
    color: "#63725A",
  },
});
