import {
  StyleSheet,
  View,
  ImageBackground,
  Text,
  Image,
  Pressable,
} from "react-native";
import { AuthContext } from "../../../hooks/AuthContext";
import React, { useContext } from "react";
import GlobalStyles from "../../GlobalStyles";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const Navigation = useNavigation();

  const handleCreateTravelBoard = () => {
    Navigation.navigate("CreateTravelBoard", {
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
