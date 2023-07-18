import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { FIREBASE_DB } from "../../../firebaseConfig";
import ArticleCard from "../../components/ExploreComp/ArticleCard";

const DestinationScreen = ({ route }) => {
  const {
    pathId,
    destinationName,
    destinationCountry,
    destinationDescription,
    destinationImage,
  } = route.params;

  const [articleData, setArticleData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getArticleData = async () => {
    const querySnapshot = await getDocs(collection(FIREBASE_DB, pathId));
    const data = querySnapshot.docs.map((doc) => doc.data());
    setArticleData(data);
  };

  useEffect(() => {
    getArticleData();
    setLoading(false);
  }, []);

  const renderArticleCard = ({ item }) => {
    return (
      <ArticleCard
        key={item.articleId}
        articleItem={item}
        path={`${pathId}/${item.articleId}/places`}
        containerStyle={styles.articleCardContainer}
      />
    );
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" />}
      {!loading && (
        <FlatList
          data={articleData}
          renderItem={renderArticleCard}
          keyExtractor={(item) => item.articleId}
          numColumns={2}
          ListHeaderComponent={
            <View>
              <Image source={{ uri: destinationImage }} style={styles.image} />
              <Text>{destinationName}</Text>
              <Text>{destinationCountry}</Text>
              <Text>{destinationDescription}</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default DestinationScreen;

const styles = StyleSheet.create({
  columnWrapper: {
    justifyContent: "space-between", // Adjust as per your requirements
  },
  container: {
    // flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
  },
  articleCardContainer: {
    flex: 1,
    aspectRatio: 1, // Maintain aspect ratio of the ArticleCard
    margin: 5,
  },
  image: {
    height: 150,
    width: 300,
  },
});
