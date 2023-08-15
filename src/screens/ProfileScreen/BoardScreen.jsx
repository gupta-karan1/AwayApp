import {
  StyleSheet,
  Text,
  View,
  Alert,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
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
  orderBy,
} from "firebase/firestore";
import PlaceCard from "../../components/ExploreComp/PlaceCard";
import GlobalStyles from "../../GlobalStyles";

const BoardScreen = () => {
  const route = useRoute();
  const { boardId, title, description, image, userId } = route.params;
  const [loading, setLoading] = useState(false);
  const [placeData, setPlaceData] = useState([]);
  const [showFullText, setShowFullText] = useState(false);

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
        return { ...doc.data(), placeId: doc.id };
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
      getBoardPlaces();
      console.log(placeData);
    }, [])
  );

  // PlaceCard component to render each place item
  const renderPlaceCard = useCallback(({ item }) => {
    return (
      <PlaceCard
        key={item.placeId}
        placeItem={item}
        // path={`${pathId}/${item.placeId}`} // path prop to navigate to the place screen using placeId
      />
    );
  }, []); // add an empty array as the second argument to useCallback to avoid re-rendering the component

  // Function to toggle the full text
  const toggleFullText = () => {
    setShowFullText(!showFullText);
  };

  return (
    <View>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
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
          ListHeaderComponent={
            <View>
              <Image
                source={image ? { uri: image } : null}
                style={styles.image}
              />
              <Text style={[GlobalStyles.titleLargeRegular, styles.titleText]}>
                {title}
              </Text>
              {showFullText ? (
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
                    {description.slice(0, 100)}
                    {"... "}
                  </Text>
                  <TouchableOpacity onPress={toggleFullText}>
                    <Text style={[GlobalStyles.bodySmallRegular, styles.para]}>
                      Read More
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          }
        />
      )}
    </View>
  );
};

export default BoardScreen;

const styles = StyleSheet.create({
  image: {
    height: 200,
    width: "100%",
    backgroundColor: "lightgrey",
    marginTop: 20,
    borderRadius: 10,
  },
  titleText: {
    marginBottom: 10,
    fontSize: 25,
  },
  bodyText: {
    overflow: "hidden",
    maxWidth: 350,
    marginBottom: 5,
  },
  para: {
    marginTop: 10,
    marginBottom: 30,
    textDecorationLine: "underline",
  },
});
