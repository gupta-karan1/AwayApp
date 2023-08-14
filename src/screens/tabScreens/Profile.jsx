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
import React, { useContext, useEffect, useState } from "react";
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
} from "firebase/firestore";
import { ActivityIndicator } from "react-native";

export default function Profile() {
  const [travelBoards, setTravelBoards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useContext(AuthContext);
  const Navigation = useNavigation();

  const handleCreateTravelBoard = () => {
    Navigation.navigate("CreateTravelBoard", {
      userId: user.uid,
    });
  };

  useEffect(() => {
    getTravelBoards();
  }, []);

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

  // console.log("travelBoards:", travelBoards);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../../assets/headerDefault.jpg")}
        style={styles.headerImage}
      ></ImageBackground>
      <View style={styles.textContainer}>
        <Text style={GlobalStyles.titleLargeRegular}>
          {user.displayName ? user.displayName : `User Name`}
        </Text>
        <Text style={GlobalStyles.labelMediumMedium}>{user.email}</Text>
      </View>

      <Image
        source={
          user.photoURL
            ? { uri: user.photoURL }
            : require("../../../assets/profileDefault.png")
        }
        style={styles.profileImg}
      />
      {isLoading && <ActivityIndicator size="large" />}
      {travelBoards.length === 0 && !isLoading && (
        <Text>
          You don't have any travel boards yet. Create your first travelboard
          for inspiration!
        </Text>
      )}
      {!isLoading && travelBoards.length > 0 && (
        <FlatList
          data={travelBoards}
          keyExtractor={(item) => item.travelBoardId}
          numColumns={2} // display items in 2 columns
          removeClippedSubviews={true}
          initialNumToRender={2}
          maxToRenderPerBatch={2}
          updateCellsBatchingPeriod={100}
          windowSize={2}
          columnWrapperStyle={{
            justifyContent: "space-between", // add space between columns
          }}
          showsVerticalScrollIndicator={false} // hide scroll bar
          contentContainerStyle={{ padding: 15 }} // add padding to left and right
          renderItem={({ item }) => (
            <Pressable
              style={styles.travelBoard}
              // onPress={() => handleTravelBoardPress(item.travelBoardId)}
            >
              <Image
                source={{ uri: item.image }}
                style={styles.travelBoardImg}
              />
              <Text style={styles.travelBoardTitle}>{item.title}</Text>
            </Pressable>
          )}
        />
      )}
      {/* FAB to add a new travel board */}
      <Pressable style={styles.fabButton} onPress={handleCreateTravelBoard}>
        <AntDesign name="plus" size={18} color="white" />
        <Text style={styles.fabText}> Travel Board</Text>
      </Pressable>
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
  fabButton: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    right: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#0D47A1",
    elevation: 4,
  },
  fabText: {
    fontSize: 15,
    color: "white",
  },
  travelBoardImg: {
    height: 100,
    width: 160,
    borderRadius: 10,
    backgroundColor: "lightgrey",
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
