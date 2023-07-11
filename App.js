// install react navigation for bottom tabs

// import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Tabs from "./src/components/Tabs";
import ExploreFeed from "./src/components/ExploreFeed";

// refer this for firestore functions: https://firebase.google.com/docs/firestore/query-data/get-data

export default function App() {
  // const [allData, setAllData] = useState([]); // this is the array of all the data from the firestore database

  // const db = getFirestore(app); // this is the firestore database
  // // console.log(db);

  // // get all documents from a collection
  // const getAllDocs = async () => {
  //   const querySnapshot = await getDocs(collection(db, "Destinations"));

  //   const data = querySnapshot.docs.map((doc) => doc.data());
  //   console.log("Destinations", data);
  // };

  // const getAllDocs = async () => {
  //   const querySnapshot = await getDocs(
  //     collection(db, "Destinations", "Lisbon", "Articles")
  //   );
  //   // convert the data into an array of objects
  //   const data = querySnapshot.docs.map((doc) => doc.data());
  //   console.log("Articles", data);
  // };
  // const getAllDocs = async () => {
  //   const querySnapshot = await getDocs(
  //     collection(
  //       db,
  //       "Destinations",
  //       "Lisbon",
  //       "Articles",
  //       "Article 1",
  //       "Places"
  //     )
  //   );
  //   // convert the data into an array of objects
  //   const data = querySnapshot.docs.map((doc) => doc.data());
  //   console.log("Places", data);
  //   setAllData(data);
  // };

  // useEffect(() => {
  //   getAllDocs();
  // }, []);

  return (
    <NavigationContainer>
      <Tabs />
      {/* <StatusBar style="auto" /> */}
      {/* <Button title="Get All Data" onPress={getAllDocs} />
      <FlatList
        data={allData}
        renderItem={({ item }) => {
          return (
            <View style={styles.container}>
              <Text>{item.placeTitle}</Text>
              <Text>{item.placeId}</Text>
            </View>
          );
        }}
        keyExtractor={(item) => item.placeId}
      /> */}
      <ExploreFeed />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: StatusBar.currentHeight || 0,
  },
});
