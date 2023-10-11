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
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { EvilIcons } from "@expo/vector-icons";
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
  updateDoc,
} from "firebase/firestore";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import uuid from "react-native-uuid";
import { AuthContext } from "../../../hooks/AuthContext";
import GlobalStyles from "../../GlobalStyles";
import Toast from "react-native-root-toast";

const CreateTravelBoard = () => {
  const [boardTitle, setBoardTitle] = useState("");
  const [boardDescription, setBoardDescription] = useState("");
  const [boardImage, setBoardImage] = useState("");
  const [searchImage, setSearchImage] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchResultsLoading, setSearchResultsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userId, setUserId] = useState();

  const { user } = useContext(AuthContext);
  useEffect(() => {
    setUserId(user.uid);
  }, []);

  const fetchImages = async () => {
    try {
      setSearchResultsLoading(true);
      const data = await fetch(
        `https://api.unsplash.com/search/photos?query=${searchImage}&client_id=${UNSPLASH_ACCESS_KEY}`
      );
      const images = await data.json();
      setSearchResults(images.results);
    } catch (error) {
      // console.log(error);
      Alert.alert("No images found", error.message);
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
      // Alert.alert("Board created successfully");
      Toast.show(`Board created successfully`, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM - 50,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: "#63725A",
      });
      Navigation.navigate("Profile");
    } catch (error) {
      // console.log(error);
      Alert.alert("Error creating board", error.message);
    } finally {
      setLoading(false);
    }
  };

  const route = useRoute();
  const { boardId, title, description, image } = route.params || {}; // if there are no existing parameters from the existing database, set it to empty object

  useEffect(() => {
    if (boardId) {
      setBoardTitle(title);
      setBoardDescription(description);
      setBoardImage(image);

      Navigation.setOptions({
        headerTitle: "Edit Board",
      });
    }
  }, [boardId]);

  const handleUpdateBoard = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(FIREBASE_DB, "users"),
        where("userId", "==", userId)
      );

      const querySnapshot = await getDocs(q); // get user documents from user collection based on user id
      const userRef = doc(FIREBASE_DB, "users", querySnapshot.docs[0].id); //Create a reference to this user's document

      const q2 = query(
        collection(userRef, "boards"),
        where("boardId", "==", boardId)
      );

      const querySnapshot2 = await getDocs(q2);
      const boardRef = doc(userRef, "boards", querySnapshot2.docs[0].id);

      // await addDoc(boardRef, {
      //   title: boardTitle,
      //   description: boardDescription,
      //   image: boardImage,
      //   createdAt: new Date(),
      //   boardId: boardId,
      // });

      await updateDoc(boardRef, {
        title: boardTitle,
        description: boardDescription,
        image: boardImage,
        // createdAt: createdAt,
        boardId: boardId,
      });

      // Alert.alert("Board updated successfully");
      Toast.show(`Board updated successfully`, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM - 50,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: "#63725A",
      });
      Navigation.navigate("BoardScreen", {
        boardId: boardId,
        title: boardTitle,
        description: boardDescription,
        image: boardImage,
      });
    } catch (error) {
      // console.log(error);
      Alert.alert("Error updating board", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.outerContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inputContainer}>
          <Text style={[styles.titleText, GlobalStyles.bodySmallRegular]}>
            Title:
          </Text>
          <TextInput
            label="Travel Board Title"
            value={boardTitle}
            onChangeText={(text) => setBoardTitle(text)}
            style={styles.input}
            placeholder="Travel Inspiration"
            placeholderTextColor="#A6A6A6"
            allowFontScaling={true}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.titleText, GlobalStyles.bodySmallRegular]}>
            Description:
          </Text>
          <TextInput
            label="Description"
            value={boardDescription}
            onChangeText={(text) => setBoardDescription(text)}
            style={[styles.descriptionInput, styles.input]}
            placeholder="Places I would like to visit..."
            multiline={true}
            numberOfLines={3}
            maxwidth={50}
            maxHeight={110} // Stop submit button from going of screen
            // returnKeyType="done"
            placeholderTextColor="#A6A6A6"
            allowFontScaling={true}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.titleText, GlobalStyles.bodySmallRegular]}>
            Cover Image:
          </Text>
          <View style={styles.searchContainer}>
            <TextInput
              label="Search for a cover image"
              value={searchImage}
              onChangeText={(text) => setSearchImage(text)}
              onSubmitEditing={fetchImages}
              style={[styles.searchInput, styles.input]}
              reg
              placeholder="Search with a keyword"
              allowFontScaling={true}
              placeholderTextColor="#A6A6A6"
            />

            <EvilIcons
              name="search"
              size={27}
              color="#63725A"
              style={styles.searchIcon}
              onPress={() => {
                fetchImages();
                // Keyboard.dismiss();
              }}
            />
          </View>

          {searchResultsLoading && <ActivityIndicator />}
          {searchResults && !searchResultsLoading && (
            <>
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
              {searchResults.length === 0 && boardImage !== "" && boardId && (
                <Image
                  source={{ uri: boardImage }}
                  style={styles.selectedImage}
                />
              )}
            </>
          )}
        </View>
        {loading && <ActivityIndicator />}
        {!loading && (
          // <Button
          //   title={boardId ? "Update Board" : "Save Board"}
          //   onPress={boardId ? handleUpdateBoard : handleSubmit}
          // />
          <Pressable
            style={styles.submitButton}
            onPress={boardId ? handleUpdateBoard : handleSubmit}
          >
            <Text
              style={[styles.saveButtonText, GlobalStyles.bodySmallRegular]}
            >
              {boardId ? "Update Board" : "Add Board"}
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateTravelBoard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  outerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    flexGrow: 1,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#63725A",
  },
  titleText: {
    color: "#63725A",
    marginBottom: 5,
  },
  descriptionInput: {
    textAlignVertical: "top",
  },
  imageWrapper: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    // marginBottom: 10,
    marginTop: 15,
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
    height: 180,
    width: 250,
    objectFit: "cover",
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 15,
  },
  submitButton: {
    backgroundColor: "#63725A",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 50,
    alignItems: "center",
    width: "100%",
  },
  saveButtonText: {
    color: "#EFFBB7",
  },
  searchContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 10,
  },
  searchInput: {
    flex: 1,
  },
  searchIcon: {
    paddingHorizontal: 9,
    paddingTop: 13,
    borderRadius: 10,
    height: "100%",
    color: "#63725A",
    borderWidth: 1,
    borderColor: "#63725A",
  },
});
