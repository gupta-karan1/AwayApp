import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebaseConfig";
import ArticleCard from "../components/ArticleCard";

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

  return (
    <View style={styles.container}>
      {loading && <Text>Loading...</Text>}
      {!loading && (
        <ScrollView>
          <Image source={{ uri: destinationImage }} style={styles.image} />
          <Text>{destinationName}</Text>
          <Text>{destinationCountry}</Text>
          <Text>{destinationDescription}</Text>

          <ScrollView>
            <FlatList
              data={articleData}
              renderItem={({ item }) => (
                <ArticleCard
                  key={item.articleId}
                  author={item.articleAuthor}
                  category={item.articleCategory}
                  date={item.articleDate}
                  image={item.articleImg}
                  intro={item.articleIntro}
                  saved={item.articleSaved}
                  source={item.articleSource}
                  title={item.articleTitle}
                  url={item.articleUrl}
                  path={`${pathId}/${item.articleId}/places`}
                />
              )}
              keyExtractor={(item) => item.articleId}
            />
          </ScrollView>
        </ScrollView>
      )}
    </View>
  );
};

export default DestinationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    height: 150,
    width: 300,
  },
});
