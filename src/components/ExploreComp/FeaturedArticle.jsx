import { StyleSheet, Text, View, Image, Pressable, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { FIREBASE_DB } from "../../../firebaseConfig";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import GlobalStyles from "../../GlobalStyles";

// display featured article on the explore page based on a random destination and article from the destinations collection

const FeaturedArticle = () => {
  const [featuredPost, setFeaturedPost] = useState({});

  const [destination, setDestination] = useState("");

  const [index, setIndex] = useState(0);

  const getFeaturedPost = async () => {
    // an asynchronous function that fetches data from the Firestore collection based on the provided pathId.

    try {
      const destinations = ["Null Destination"]; // This state variable holds an array that will contain the destination names of all the destinations in the destinations collection. It is initialized as an array with one element. This is done to avoid an error that occurs when the destinations array is empty.

      const destRef = collection(FIREBASE_DB, "destinations"); // The collection function is used to create a reference to the destinations collection in the Firestore database.

      const querySnapshot = await getDocs(destRef); // The getDocs function is used to fetch the documents from the collection based on the query created earlier.

      const data = querySnapshot.docs.map((doc) => doc.data()); // The data is then extracted from the querySnapshot using the map function to retrieve the actual data from each document using doc.data().

      data.forEach((doc) => {
        destinations.push(doc.destinationId); // The destinationId of each document is pushed to the destinations array. This ensures that the destinations array contains the destination names of all the destinations in the destinations collection.
      });

      // get random destination from destinations array
      // let index = Math.floor(Math.random() * destinations.length + 1); // random number between 1 and destinations.length
      let index = Math.floor(Math.random() * 4 + 1); // random number between 1 and 4

      // if index is equal to destinations.length, set index to index - 1 to avoid index out of bounds error
      // if (index === destinations.length) {
      //   index = index - 1;
      // } else {
      //   index = index;
      // }

      if (index === 4) {
        index = index - 1;
      } else {
        index = index;
      }

      // get random destination from destinations array
      const destination = destinations[index];

      // get featured article from random destination
      const featuredRef = doc(
        FIREBASE_DB,
        `/destinations/${destination}/articles/${destination}article${index}`
      ); // The doc function is used to create a reference to the document in the Firestore database based on the pathId prop passed to the hook.

      // get featured article from firebase
      const docSnap = await getDoc(featuredRef); // The getDoc function is used to fetch the document from the database based on the reference created earlier.

      if (docSnap.exists()) {
        // The exists function is used to check if the document exists in the database.
        const data = docSnap.data(); // The data is then extracted from the docSnap using the data function to retrieve the actual data from the document using doc.data().
        setFeaturedPost(data); // The data retrieved from the document is stored in the featuredPost state variable using the setFeaturedPost function.
        setDestination(destination); // The destination name of the destination that the featured article is from is stored in the destination state variable using the setDestination function.
        setIndex(index); // The index of the featured article is stored in the index state variable using the setIndex function.
      } else {
        Alert.alert("No such document!"); // If the document does not exist in the database, an error is logged to the console.
        // console.log("No such document");
      }
    } catch (error) {
      // console.log(error);
      Alert.alert(error); // If an error occurs, an error is logged to the console.
    }
  };

  // The useEffect hook is used to trigger the getFeaturedPost function
  useEffect(() => {
    getFeaturedPost();
  }, []);

  const { navigate } = useNavigation(); // The useNavigation hook is used to access the navigation prop of the component. This allows the component to navigate to other screens in the application.

  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        navigate("ArticleScreen", {
          pathId: `/destinations/${destination}/articles/${destination}article${index}/places`,
          articleImg: featuredPost.articleImg,
          articleTitle: featuredPost.articleTitle,
          articleCategory: featuredPost.articleCategory,
          articleAuthor: featuredPost.articleAuthor,
          articleDate: featuredPost.articleDate,
          articleIntro: featuredPost.articleIntro,
          articleSaved: featuredPost.articleSaved,
          articleSource: featuredPost.articleSource,
          articleUrl: featuredPost.articleUrl,
        });
      }}
    >
      <Text style={[GlobalStyles.titleLargeRegular, styles.titleText]}>
        Featured Article
      </Text>
      <View>
        <Image source={{ uri: featuredPost.articleImg }} style={styles.image} />
        <Text style={GlobalStyles.labelMediumMedium}>
          {featuredPost.articleSource}
        </Text>
        <Text style={GlobalStyles.bodyMediumBold}>
          {featuredPost.articleTitle}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#E5E8E3",
    marginBottom: 30,
  },
  titleText: {
    marginBottom: 15,
  },
  image: {
    width: "100%",
    height: 300,
    backgroundColor: "grey",
    borderRadius: 10,
    marginBottom: 5,
  },
});

export default FeaturedArticle;

// SUMMARY: This component is used to display a featured article on the explore page. It uses the useFeaturedArticle hook to fetch data from the Firestore database and display it in a Pressable component.
