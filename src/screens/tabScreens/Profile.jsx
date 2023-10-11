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
import { Feather } from "@expo/vector-icons";
import Toast from "react-native-root-toast";

export default function Profile() {
  const [travelBoards, setTravelBoards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [headerImage, setHeaderImage] = useState("");

  const { user } = useContext(AuthContext);
  // console.log(user);
  const Navigation = useNavigation();

  const handleCreateTravelBoard = () => {
    Navigation.navigate("CreateTravelBoard");
  };

  // Fetch user's trip data when the screen mounted

  const getSingleUserData = async () => {
    try {
      setIsLoading(true);
      const q = query(
        collection(FIREBASE_DB, "users"),
        where("userId", "==", user.uid)
      );

      const querySnapshot = await getDocs(q);
      const userData = querySnapshot.docs.map((doc) => doc.data());
      setHeaderImage(userData[0].headerImage);
    } catch (error) {
      Alert.alert("Error fetching user data:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!deleteLoading) {
        const delay = 1000; // 5000 milliseconds (5 seconds)

        const timerId = setTimeout(() => {
          getTravelBoards();
          getSingleUserData();
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

      // Alert.alert("Board deleted successfully");
      Toast.show(`Board Removed Successfully`, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM - 50,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: "#63725A",
      });
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
        source={
          headerImage
            ? { uri: headerImage }
            : require("../../../assets/headerDefault.jpg")
        }
        style={styles.headerImage}
      >
        <Pressable
          onPress={() =>
            Navigation.navigate("EditProfile", {
              username: user.displayName,
              profileImage: user.photoURL,
              userId: user.uid,
              headerImage: headerImage,
            })
          }
          style={styles.backButton}
        >
          <Feather name="edit-2" size={22} color="#000" />
        </Pressable>
      </ImageBackground>
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

      <View style={styles.headerContainer}>
        <Text style={GlobalStyles.bodyMediumRegular}>My Travel Boards</Text>
        <Pressable onPress={handleCreateTravelBoard} style={styles.fabButton}>
          {/* <Feather name="plus" size={20} color="#EFFBB7" /> */}
          <Text style={[GlobalStyles.bodySmallRegular, styles.fabText]}>
            Add Board
          </Text>
        </Pressable>
      </View>

      {isLoading && <ActivityIndicator size="large" />}
      {travelBoards.length === 0 && !isLoading && (
        <View>
          {/* <View style={styles.headerContainer}>
            <Text style={GlobalStyles.bodyMediumRegular}>My Travel Boards</Text>
            <Pressable
              onPress={handleCreateTravelBoard}
              style={styles.fabButton}
            >
              <Feather name="plus" size={24} color="#63725A" />
              <Text style={styles.fabText}> Add Board</Text>
            </Pressable>
          </View> */}
          <Pressable
            onPress={() =>
              Navigation.navigate("CreateTravelBoard", {
                userId: user.uid,
              })
            }
            style={styles.emptyContainer}
          >
            <Text>Create a travel board for inspiration</Text>
            {/* <Text style={styles.navText}>Add a Board</Text> */}
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
          contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 15 }} // add padding to left and right
          // ListHeaderComponent={
          //   <View style={styles.headerContainer}>
          //     <Text style={GlobalStyles.bodyMediumRegular}>
          //       My Travel Boards
          //     </Text>
          //     <Pressable
          //       onPress={handleCreateTravelBoard}
          //       style={styles.fabButton}
          //     >
          //       {/* <Feather name="plus" size={20} color="#EFFBB7" /> */}
          //       <Text style={[GlobalStyles.bodySmallRegular, styles.fabText]}>
          //         Add Board
          //       </Text>
          //     </Pressable>
          //   </View>
          // }
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
                <Text
                  style={[GlobalStyles.bodyMediumBold, styles.title]}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                <View style={styles.iconBox}>
                  <Ionicons
                    onPress={() => confirmDelete(item.boardId)}
                    name="md-trash-outline"
                    size={20}
                    color="#000"
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
    // justifyContent: "flex-start",
    // borderRadius: 30,
    backgroundColor: "#fff",
  },
  textContainer: {
    backgroundColor: "#E5E8E3",
    height: 80,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: 155,
  },
  headerImage: {
    height: 120,
    width: "100%",
  },
  profileImg: {
    borderRadius: 120,
    height: 120,
    width: 120,
    position: "absolute",
    top: 65,
    left: 20,
    objectFit: "cover",
    borderWidth: 5,
    borderColor: "#E5E8E3",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    // padding: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  fabButton: {
    flexDirection: "row",
    alignItems: "center",
    // position: "absolute",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#63725A",
    paddingVertical: 12,
    paddingHorizontal: 20,
    // elevation: 2,
  },
  saveButton: {
    backgroundColor: "#63725A",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  fabText: {
    // fontSize: 15,
    color: "#EFFBB7",
  },
  travelBoard: {
    width: "48%",
    marginBottom: 30,
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
  // iconBox: {
  //   paddingLeft: 4,
  // },
  title: {
    width: "80%",
  },
  cardFooter: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 5,
    paddingHorizontal: 3,
    // gap: 10,
  },
  backButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 8,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  emptyContainer: {
    backgroundColor: "#E5E8E3",
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    alignItems: "center",
    // marginHorizontal: 10,
    // marginTop: 10,
    padding: 20,
    marginBottom: 20,
    marginHorizontal: 15,
  },
  navText: {
    textDecorationLine: "underline",
    color: "#63725A",
  },
  text: {
    color: "#63725A",
  },
});

// SUMMARY: Profile Screen with logout button that redirects user to Login screen.
