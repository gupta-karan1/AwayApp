import { StyleSheet, Text, View, Image, StatusBar } from "react-native";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { FIREBASE_APP, FIREBASE_DB } from "../../firebaseConfig";
import { useRoute } from "@react-navigation/native";

const DestinationScreen = ({ route, navigation }) => {
  const { pathId } = route.params;
  //   const articlePath = JSON.stringify(pathId);

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

  const ArticleCard = ({ author }) => {
    return (
      <View>
        <Text>{author}</Text>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      {loading && <Text>Loading...</Text>}
      {!loading &&
        articleData.map((item) => (
          <ArticleCard key={item.articleId} author={item.articleId} />
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
