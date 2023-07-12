import { StyleSheet, Text, View, FlatList, Image } from "react-native";
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
        <FlatList
          data={articleData}
          renderItem={({ item }) => (
            <ArticleCard
              key={item.articleId}
              articleItem={item}
              path={`${pathId}/${item.articleId}/places`}
            />
          )}
          keyExtractor={(item) => item.articleId}
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
