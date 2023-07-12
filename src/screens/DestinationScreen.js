import { StyleSheet, Text, View, Image, StatusBar } from "react-native";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebaseConfig";
import ArticleCard from "../components/ArticleCard";

const DestinationScreen = ({ route, navigation }) => {
  const { pathId } = route.params;

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
      {!loading &&
        articleData.map((item) => (
          <ArticleCard 
          key={item.articleId} 
          author={item.articleAuthor}
          category={item.articleCategory}
          date={item.articleDate}
          image={item.articleImg}
          intro={item.articleIntro}ç
          saved={item.articleSaved}
          source={item.articleSource}
          title={item.articleTitle}
          url={item.articleUrl}
          path={`${pathId}/${item.articleId}/places`}
          />
        ))}
    </View>
  );
};

export default DestinationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: StatusBar.currentHeight || 0,
  },
});
