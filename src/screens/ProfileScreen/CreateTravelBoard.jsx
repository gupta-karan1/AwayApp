import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  Image,
  ActivityIndicator,
  Pressable,
  Button,
  Alert,
} from "react-native";
import React, { useState } from "react";
// import { EvilIcons } from "@expo/vector-icons";
import { UNSPLASH_ACCESS_KEY } from "@env";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { FIREBASE_DB } from "../../../firebaseConfig";
import {
  collection,
  addDoc,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { FlatList } from "react-native-gesture-handler";
import uuid from "react-native-uuid";

const CreateTravelBoard = () => {
  const [boardTitle, setBoardTitle] = useState("");
  const [boardDescription, setBoardDescription] = useState("");
  const [boardImage, setBoardImage] = useState("");
  const [searchImage, setSearchImage] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchResultsLoading, setSearchResultsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchImages = async () => {
    try {
      setSearchResultsLoading(true);
      const data = await fetch(
        `https://api.unsplash.com/search/photos?query=${searchImage}&client_id=${UNSPLASH_ACCESS_KEY}`
      );
      const images = await data.json();
      setSearchResults(images.results);
    } catch (error) {
      console.log(error);
    } finally {
      setSearchResultsLoading(false);
    }
  };

  const handleImageSelection = (image) => {
    setBoardImage(image.urls.small);
    setSelectedImage(image);
    // set search results to one selected image
    setSearchResults([image]);
  };

  const Navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;

  const saveBoardDetails = async (userId, boardData) => {
    try {
      const q = query(
        collection(FIREBASE_DB, "users"),
        where("userId", "==", userId)
      );

      const querySnapshot = await getDocs(q); // get user documents from user collection based on user id
      const userRef = doc(FIREBASE_DB, "users", querySnapshot.docs[0].id); //Create a reference to this user's document

      await addDoc(collection(userRef, "boards"), boardData); // Add the trip data to the "trips" subcollection under specific user
    } catch (error) {
      Alert.alert("Error saving board details:", error.message);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const boardData = {
        title: boardTitle,
        description: boardDescription,
        image: boardImage,
        createdAt: new Date(),
        boardId: uuid.v4(),
      };

      await saveBoardDetails(userId, boardData);
      Alert.alert("Board created successfully");
      Navigation.navigate("Profile");
    } catch (error) {
      console.log(error);
      Alert.alert("Error creating board", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.titleText}>Title:</Text>
        <TextInput
          label="Travel Board Title"
          value={boardTitle}
          onChangeText={(text) => setBoardTitle(text)}
          style={styles.input}
          placeholder="Title"
        />
        <Text style={styles.titleText}>Description:</Text>
        <TextInput
          label="Description"
          value={boardDescription}
          onChangeText={(text) => setBoardDescription(text)}
          style={[styles.descriptionInput, styles.input]}
          placeholder="Description"
          multiline={true}
          numberOfLines={3}
          maxLength={250}
          maxHeight={110} // Stop submit button from going of screen
          returnKeyType="done" // To hide keyboard when done typing
        />
        <Text style={styles.titleText}>Cover Image (Unsplash):</Text>
        {/* <View style={styles.searchContainer}> */}
        <TextInput
          label="Search for a cover image"
          value={searchImage}
          onChangeText={(text) => setSearchImage(text)}
          onSubmitEditing={fetchImages}
          style={[styles.input, styles.inputStyle]}
          placeholder="Search for an image"
        />
        {/* <EvilIcons name="search" size={20} color="black" />
          </View> */}
        {searchResults?.length === 0 && (
          <Text>Nothing found. Try a different query</Text>
        )}

        {searchResultsLoading && <ActivityIndicator />}

        {searchResults && !searchResultsLoading && (
          <>
            {/* {searchResults.map((image) => (
              <Pressable
                onPress={() => handleImageSelection(image)}
                key={image.urls.small}
                style={styles.imageWrapper}
              >
                <Image
                  source={{ uri: image.urls.small }}
                  style={styles.image}
                />
              </Pressable>
            ))} */}
            {searchResults.length > 1 && (
              <FlatList
                data={searchResults}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => handleImageSelection(item)}
                    key={item.urls.small}
                    style={styles.imageWrapper}
                  >
                    <Image
                      source={{ uri: item.urls.small }}
                      style={styles.image}
                    />
                  </Pressable>
                )}
                keyExtractor={(item) => item.id}
                horizontal
                ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
                showsHorizontalScrollIndicator={false}
              />
            )}
            {searchResults.length === 1 && (
              <Image
                source={{ uri: selectedImage.urls.small }}
                style={styles.selectedImage}
              />
            )}
          </>
        )}
      </View>
      {loading && <ActivityIndicator />}
      {!loading && <Button title="Submit" onPress={handleSubmit} />}
    </KeyboardAvoidingView>
  );
};

export default CreateTravelBoard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingBottom: 30,
  },
  inputContainer: {
    width: "85%",
    paddingTop: 25,
    marginBottom: 30,
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 15,
  },
  descriptionInput: {
    textAlignVertical: "top",
  },
  imageWrapper: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 10,
    justifyContent: "center",
  },
  image: {
    height: 180,
    width: 250,
    objectFit: "cover",
    borderRadius: 10,
  },
  selectedImage: {
    alignSelf: "center",
    // marginHorizontal: "auto",
    height: 180,
    width: 250,
    objectFit: "cover",
    borderRadius: 10,
    marginBottom: 10,
  },
  //   searchContainer: {
  //     alignItems: "center",
  //     // justifyContent: "center",
  //     borderRadius: 10,
  //     flexDirection: "row",
  //     backgroundColor: "white",
  //     paddingBottom: 10,
  //     paddingHorizontal: 10,
  //     // height: 50,
  //     marginBottom: 30,
  //   },
  //   inputStyle: {
  //     flex: 1,
  //     // marginLeft: 10
  //   },
});
