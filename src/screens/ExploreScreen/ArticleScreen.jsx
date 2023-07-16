import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { FIREBASE_DB } from "../../../firebaseConfig";
import PlaceCard from "../../components/ExploreComp/PlaceCard";

const ArticleScreen = ({ route }) => {
  const {
    pathId,
    articleImg,
    articleTitle,
    articleCategory,
    articleAuthor,
    articleDate,
    articleIntro,
    articleSaved,
    articleSource,
    articleUrl,
  } = route.params;

  const [placeData, setPlaceData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getPlaceData = async () => {
    const querySnapshot = await getDocs(collection(FIREBASE_DB, pathId));
    const data = querySnapshot.docs.map((doc) => doc.data());
    setPlaceData(data);
  };

  const renderPlaceCard = useCallback(({ item }) => {
    return (
      <PlaceCard
        key={item.placeId}
        placeItem={item}
        path={`${pathId}/${item.placeId}`}
      />
    );
  }, []);

  useEffect(() => {
    getPlaceData();
    setLoading(false);
  }, []);

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" />}

      {!loading && (
        <FlatList
          data={placeData}
          renderItem={renderPlaceCard}
          keyExtractor={(item) => item.placeId}
          ListHeaderComponent={
            <View>
              <Image source={{ uri: articleImg }} style={styles.image} />
              <Text>{articleTitle}</Text>
              <Text>{articleCategory}</Text>
              <Text>{articleAuthor}</Text>
              <Text>{articleDate}</Text>
              <Text>{articleIntro}</Text>
              <Text>{articleSaved}</Text>
              <Text>{articleSource}</Text>
              <Text>{articleUrl}</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default ArticleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    width: 300,
    height: 150,
  },
});
