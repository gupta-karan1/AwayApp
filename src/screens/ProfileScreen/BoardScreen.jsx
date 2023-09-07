import {
  StyleSheet,
  Text,
  View,
  Alert,
  FlatList,
  ActivityIndicator,
  ImageBackground,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useState, useCallback } from "react";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { FIREBASE_DB } from "../../../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";

import GlobalStyles from "../../GlobalStyles";
import ProfilePlaceCard from "../../components/ProfileComp/ProfilePlaceCard";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

const BoardScreen = () => {
  const route = useRoute();
  const { boardId, title, description, image, userId } = route.params;
  const [loading, setLoading] = useState(false);
  const [placeData, setPlaceData] = useState([]);
  const [showFullText, setShowFullText] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const getBoardPlaces = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(FIREBASE_DB, "users"),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      const userRef = doc(FIREBASE_DB, "users", querySnapshot.docs[0].id);

      const q2 = query(
        collection(userRef, "boards"),
        where("boardId", "==", boardId)
      );

      const querySnapshot2 = await getDocs(q2);
      const boardRef = doc(userRef, "boards", querySnapshot2.docs[0].id);

      const q3 = query(
        collection(boardRef, "places")
        // orderBy("createdAt", "desc")
      );
      const querySnapshot3 = await getDocs(q3);
      const places = querySnapshot3.docs.map((doc) => {
        return { ...doc.data() };
      });
      setPlaceData(places);
    } catch (error) {
      Alert.alert("Error fetching places:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!deleteLoading) {
        getBoardPlaces();
      }
    }, [deleteLoading])
  );

  // PlaceCard component to render each place item
  const renderPlaceCard = useCallback(({ item }) => {
    return (
      <ProfilePlaceCard
        key={item.placeId}
        placeItem={item}
        onDelete={() => confirmDelete(item)}
      />
    );
  }, []); // add an empty array as the second argument to useCallback to avoid re-rendering the component

  // Function to toggle the full text
  const toggleFullText = () => {
    setShowFullText(!showFullText);
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
        collection(userRef, "boards"),
        where("boardId", "==", boardId)
      );
      const querySnapshot2 = await getDocs(q2);
      const boardRef = doc(userRef, "boards", querySnapshot2.docs[0].id);

      const q3 = query(
        collection(boardRef, "places"),
        where("placeId", "==", placeId)
        // orderBy("createdAt", "desc")
      );

      const querySnapshot3 = await getDocs(q3);
      const placeRef = doc(boardRef, "places", querySnapshot3.docs[0].id);

      await deleteDoc(placeRef);

      Alert.alert("Place deleted successfully");
    } catch (error) {
      Alert.alert("Error deleting place:", error.message);
    } finally {
      setDeleteLoading(false);
    }
  };
  const Navigation = useNavigation();

  return (
    <View>
      {loading && <ActivityIndicator size="large" />}
      {!loading && (
        <FlatList
          data={placeData}
          renderItem={renderPlaceCard}
          keyExtractor={(item) => item.placeId}
          numColumns={2} // display items in 2 columns
          removeClippedSubviews={true}
          initialNumToRender={2}
          maxToRenderPerBatch={2}
          updateCellsBatchingPeriod={50}
          windowSize={2}
          columnWrapperStyle={{
            justifyContent: "space-between", // add space between columns
          }}
          showsVerticalScrollIndicator={false} // hide scroll bar
          contentContainerStyle={{ paddingHorizontal: 15 }} // add padding to left and right
          // List header component to display the article details
          ListEmptyComponent={
            <Pressable
              onPress={() => Navigation.navigate("ExploreStackGroup")}
              style={styles.promptText}
            >
              <Text>
                Go to the Explore page to save a place to your travel board!
              </Text>
            </Pressable>
          }
          ListHeaderComponent={
            <View style={styles.container}>
              <View style={styles.imageContainer}>
                <ImageBackground
                  source={
                    image
                      ? { uri: image }
                      : require("../../../assets/image-placeholder.png")
                  }
                  style={styles.image}
                >
                  <Pressable
                    onPress={() =>
                      Navigation.navigate("CreateTravelBoard", {
                        boardId: boardId,
                        title: title,
                        description: description,
                        image: image,
                        userId: userId,
                      })
                    }
                    style={styles.backButton}
                  >
                    <Feather name="edit-2" size={22} color="black" />
                  </Pressable>
                </ImageBackground>
              </View>
              <Text style={[GlobalStyles.titleLargeRegular, styles.titleText]}>
                {title}
              </Text>
              {/* {showFullText ? (
                <View>
                  <Text
                    style={[GlobalStyles.bodySmallRegular, styles.bodyText]}
                  >
                    {description}
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
                    {description.slice(0, 50)}
                    {"... "}
                  </Text>
                  <TouchableOpacity onPress={toggleFullText}>
                    <Text style={[GlobalStyles.bodySmallRegular, styles.para]}>
                      Read More
                    </Text>
                  </TouchableOpacity>
                </View>
              )} */}
              {description ? (
                showFullText ? (
                  <View>
                    <Text
                      style={[GlobalStyles.bodySmallRegular, styles.bodyText]}
                    >
                      {description}
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
                      {description.slice(0, 50)}
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
                )
              ) : null}
            </View>
          }
        />
      )}
    </View>
  );
};

export default BoardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  image: {
    height: 200,
    width: "100%",
    backgroundColor: "lightgrey",
  },
  imageContainer: {
    width: "100%",
    height: 200,
    overflow: "hidden",
    borderRadius: 10,
  },
  titleText: {
    marginBottom: 10,
    fontSize: 25,
    marginTop: 10,
  },
  bodyText: {
    overflow: "hidden",
    maxWidth: 350,
    marginBottom: 5,
  },
  para: {
    marginTop: 10,
    // marginBottom: 30,
    textDecorationLine: "underline",
  },
  promptText: {
    // textAlign: "center",
    paddingHorizontal: 10,
    paddingVertical: 20,
    alignItems: "center",
    backgroundColor: "lightgrey",
    // marginBottom: 10,
    borderRadius: 10,
    // marginTop: -30,
  },
  backButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 8,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
});
