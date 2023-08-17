import {
  StyleSheet,
  View,
  ImageBackground,
  Text,
  Image,
  Pressable,
  Alert,
  FlatList,
} from "react-native";
import { AuthContext } from "../../../hooks/AuthContext";
import React, { useContext, useEffect, useState, useCallback } from "react";
import GlobalStyles from "../../GlobalStyles";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { FIREBASE_DB } from "../../../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function Profile() {
  const [travelBoards, setTravelBoards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { user } = useContext(AuthContext);
  const Navigation = useNavigation();

  const handleCreateTravelBoard = () => {
    Navigation.navigate("CreateTravelBoard");
  };

  // Fetch user's trip data when the screen mounted

  useFocusEffect(
    useCallback(() => {
      if (!deleteLoading) {
        const delay = 1000; // 5000 milliseconds (5 seconds)

        const timerId = setTimeout(() => {
          getTravelBoards();
        }, delay);

        return () => {
          clearTimeout(timerId); // Clear the timeout if the effect is cleaned up
        };
      }
    }, [deleteLoading])
  );

  const confirmDelete = (boardId) => {
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
          onPress: () => deleteSingleBoard(boardId),
        },
      ]
    );
  };

  const getTravelBoards = async () => {
    try {
      setIsLoading(true); // show loading indicator
      const q = query(
        collection(FIREBASE_DB, "users"),
        where("userId", "==", user.uid)
      );

      const querySnapshot = await getDocs(q); // get user documents from user collection based on user id
      const userRef = doc(FIREBASE_DB, "users", querySnapshot.docs[0].id); //Create a reference to this user's document

      const q2 = query(
        collection(userRef, "boards"), // get boards collection from user
        orderBy("createdAt", "desc") // order by createdAt in descending order
      );

      const querySnapshot2 = await getDocs(q2); // get all documents from boards collection
      const boards = querySnapshot2.docs.map((doc) => doc.data()); // map through the documents and return data
      // console.log("boards:", boards);
      setTravelBoards(boards); // set travel boards state
    } catch (error) {
      Alert.alert("Error fetching travel boards:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSingleBoard = async (boardId) => {
    try {
      setDeleteLoading(true);
      const q = query(
        collection(FIREBASE_DB, "users"),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const userRef = doc(FIREBASE_DB, "users", querySnapshot.docs[0].id);

      const q2 = query(
        collection(userRef, "boards"),
        where("boardId", "==", boardId)
      );

      const querySnapshot2 = await getDocs(q2);
      const boardRef = doc(userRef, "boards", querySnapshot2.docs[0].id);

      await deleteDoc(boardRef);

      Alert.alert("Board deleted successfully");
    } catch (error) {
      Alert.alert("Error deleting board:", error.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleTravelBoardPress = (item) => {
    Navigation.navigate("BoardScreen", {
      title: item.title,
      description: item.description,
      image: item.image,
      boardId: item.boardId,
      userId: user.uid,
    });
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../../assets/headerDefault.jpg")}
        style={styles.headerImage}
      ></ImageBackground>
      <View style={styles.textContainer}>
        <Text style={GlobalStyles.titleLargeRegular}>
          {user ? user.displayName : null}
        </Text>
        <Text style={GlobalStyles.labelMediumMedium}>
          {user ? user.email : null}
        </Text>
      </View>

      {user && (
        <Image
          source={
            user.photoURL
              ? { uri: user.photoURL }
              : require("../../../assets/profileDefault.png")
          }
          style={styles.profileImg}
        />
      )}

      {isLoading && <ActivityIndicator size="large" />}
      {travelBoards.length === 0 && !isLoading && (
        <View>
          <View style={styles.headerContainer}>
            <Text style={GlobalStyles.bodyMediumBold}>My Travel Boards</Text>
            <Pressable
              onPress={handleCreateTravelBoard}
              style={styles.fabButton}
            >
              <AntDesign name="plus" size={18} color="black" />
              <Text style={styles.fabText}> Travel Board</Text>
            </Pressable>
          </View>
          <Pressable
            onPress={() =>
              Navigation.navigate("CreateTravelBoard", {
                userId: user.uid,
              })
            }
            style={styles.promptText}
          >
            <Text>Create your first Travel Board for inspiration!</Text>
          </Pressable>
        </View>
      )}
      {!isLoading && travelBoards.length > 0 && (
        <FlatList
          data={travelBoards}
          keyExtractor={(item) => item.boardId}
          numColumns={2} // display items in 2 columns
          removeClippedSubviews={true}
          initialNumToRender={2}
          maxToRenderPerBatch={2}
          updateCellsBatchingPeriod={100}
          windowSize={2}
          columnWrapperStyle={{
            alignItems: "center",
            justifyContent: "space-between", // add space between columns
          }}
          showsVerticalScrollIndicator={false} // hide scroll bar
          contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 60 }} // add padding to left and right
          ListHeaderComponent={
            <View style={styles.headerContainer}>
              <Text style={GlobalStyles.bodyMediumBold}>My Travel Boards</Text>
              <Pressable
                onPress={handleCreateTravelBoard}
                style={styles.fabButton}
              >
                <AntDesign name="plus" size={18} color="black" />
                <Text style={styles.fabText}> Travel Board</Text>
              </Pressable>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              style={styles.travelBoard}
              key={item.boardId}
              onPress={() => handleTravelBoardPress(item)}
            >
              <Image
                source={
                  item.image
                    ? { uri: item.image }
                    : require("../../../assets/image-placeholder.png")
                }
                style={styles.travelBoardImg}
              />
              <View style={styles.cardFooter}>
                <Text style={GlobalStyles.bodySmallRegular} numberOfLines={2}>
                  {item.title}
                </Text>
                <View style={styles.iconBox}>
                  <Ionicons
                    onPress={() => confirmDelete(item.boardId)}
                    name="md-trash-outline"
                    size={22}
                    color="black"
                  />
                </View>
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    borderRadius: 30,
  },
  textContainer: {
    backgroundColor: "lightgrey",
    height: 80,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: 155,
  },
  headerImage: {
    height: 140,
    width: "100%",
  },
  profileImg: {
    borderRadius: 120,
    height: 120,
    width: 120,
    position: "absolute",
    top: 80,
    left: 20,
    objectFit: "cover",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  fabButton: {
    flexDirection: "row",
    alignItems: "center",
    // position: "absolute",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "lightblue",
    // elevation: 2,
  },
  fabText: {
    fontSize: 15,
    color: "black",
  },
  travelBoard: {
    width: "48%",
    marginBottom: 15,
  },
  travelBoardImg: {
    height: 130,
    width: "100%",
    borderRadius: 10,
    backgroundColor: "lightgrey",
  },
  promptText: {
    textAlign: "center",
    paddingHorizontal: 10,
    paddingVertical: 20,
    alignItems: "center",
    backgroundColor: "lightgrey",
    margin: 10,
    borderRadius: 10,
  },
  iconBox: {
    paddingRight: 4,
  },
  cardFooter: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
});

// SUMMARY: Profile Screen with logout button that redirects user to Login screen.

// <View style={styles.buttonContainer}>
// <Pressable
//   onPress={() => handleTabView("all")}
//   style={[styles.button, tabView === "all" && styles.selected]}
// >
//   <Text>All</Text>
// </Pressable>
// <Pressable
//   onPress={() => handleTabView("personal")}
//   style={[styles.button, tabView === "personal" && styles.selected]}
// >
//   <Text>My Trips</Text>
// </Pressable>
// <Pressable
//   onPress={() => handleTabView("invited")}
//   style={[styles.button, tabView === "invited" && styles.selected]}
// >
//   <Text>Invited</Text>
// </Pressable>
// </View>
// {loading && <ActivityIndicator size="large" />}
// {!loading && tripData.length === 0 && invitedTrips.length === 0 && (
// <Pressable style={styles.emptyContainer} onPress={handleAddTrip}>
//   <Text style={{ textAlign: "center" }}>
//     You don't have any trips yet. Start planning your first trip now!
//   </Text>
// </Pressable>
// )}
// {!loading && tripData && invitedTrips && (
// <ScrollView showsVerticalScrollIndicator={false}>
//   {tabView === "all" && <AllTrips />}
//   {tabView === "personal" && <MyTrips />}
//   {tabView === "invited" && <InvitedTrips />}
// </ScrollView>
// )}
