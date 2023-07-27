import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import { FIREBASE_DB } from "../../../firebaseConfig";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import GlobalStyles from "../../GlobalStyles";

const FeaturedArticle = () => {
  const [featuredPost, setFeaturedPost] = useState({});
  // const [loading, setLoading] = useState(true);
  const [destination, setDestination] = useState("");
  const [index, setIndex] = useState(0);

  const getFeaturedPost = async () => {
    try {
      const destinations = ["Null Destination"]; // array to store all destinations

      // get all destinations from firebase
      const destRef = collection(FIREBASE_DB, "destinations");
      const querySnapshot = await getDocs(destRef);
      const data = querySnapshot.docs.map((doc) => doc.data());

      // push all destinations to destinations array
      data.forEach((doc) => {
        destinations.push(doc.destinationId);
      });

      // get random destination from destinations array
      // let index = Math.floor(Math.random() * destinations.length + 1); // random number between 1 and destinations.length
      let index = Math.floor(Math.random() * 4 + 1); // random number between 1 and destinations.length

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
      // console.log(destination);

      // get featured article from random destination
      const featuredRef = doc(
        FIREBASE_DB,
        `/destinations/${destination}/articles/${destination}article${index}`
      );

      // get featured article from firebase
      const docSnap = await getDoc(featuredRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setFeaturedPost(data);
        setDestination(destination);
        setIndex(index);
      } else {
        alert("No such document!");
        console.log("No such document");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFeaturedPost();
  }, []);

  const { navigate } = useNavigation();

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

export default FeaturedArticle;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "lightgrey",
    marginBottom: 30,
  },
  titleText: {
    marginBottom: 15,
  },
  image: {
    width: "100%",
    height: 300,
    // resizeMode: "cover",
    backgroundColor: "grey",
    borderRadius: 10,
    marginBottom: 5,
  },
});
