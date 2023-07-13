import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import { FIREBASE_DB } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const FeaturedArticle = () => {
  const [featuredPost, setFeaturedPost] = useState({});
  const [loading, setLoading] = useState(true);

  const getFeaturedPost = async () => {
    const featuredRef = doc(
      FIREBASE_DB,
      "/destinations/paris/articles/parisarticle1"
    );
    const docSnap = await getDoc(featuredRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setFeaturedPost(data);
    } else {
      console.log("No such document");
    }
  };

  useEffect(() => {
    getFeaturedPost();
    setLoading(false);
  }, []);

  const { navigate } = useNavigation();

  return (
    <View>
      {loading && <ActivityIndicator />}
      {!loading && (
        <Pressable
          onPress={() => {
            navigate("ArticleScreen", {
              pathId: "/destinations/paris/articles/parisarticle1/places",
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
          <View>
            <Image
              source={{ uri: featuredPost.articleImg }}
              style={styles.image}
            />
            <Text>{featuredPost.articleTitle}</Text>
            <Text>{featuredPost.articleSource}</Text>
          </View>
        </Pressable>
      )}
    </View>
  );
};

export default FeaturedArticle;

const styles = StyleSheet.create({
  image: {
    width: 450,
    height: 450,
    resizeMode: "cover",
  },
});
