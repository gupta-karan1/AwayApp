import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { FIREBASE_DB } from "../../../firebaseConfig";
import PlaceCard from "../../components/ExploreComp/PlaceCard";
import GlobalStyles from "../../GlobalStyles";

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
  const [showFullText, setShowFullText] = useState(false);
  const toggleFullText = () => {
    setShowFullText(!showFullText);
  };

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
    <View>
      {loading && <ActivityIndicator size="large" />}

      {!loading && (
        <FlatList
          data={placeData}
          renderItem={renderPlaceCard}
          keyExtractor={(item) => item.placeId}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 15 }} // add padding only to the first and last item
          ListHeaderComponent={
            <View>
              <Image source={{ uri: articleImg }} style={styles.image} />
              <View style={styles.subtitleText}>
                <Text style={GlobalStyles.bodySmallRegular}>
                  {articleCategory}
                </Text>
                <Text style={GlobalStyles.bodySmallRegular}>
                  {articleSource}
                </Text>
              </View>
              <Text style={[GlobalStyles.titleLargeRegular, styles.titleText]}>
                {articleTitle}
              </Text>

              <Text
                style={[
                  GlobalStyles.bodySmallRegular,
                  styles.articleAuthorText,
                ]}
              >
                By {articleAuthor}
              </Text>
              <Text
                style={[GlobalStyles.labelMediumMedium, styles.articleDateText]}
              >
                {articleDate}
              </Text>

              {showFullText ? (
                <View>
                  <Text
                    style={[GlobalStyles.bodySmallRegular, styles.bodyText]}
                  >
                    {articleIntro}
                  </Text>
                  <TouchableOpacity onPress={toggleFullText}>
                    <Text style={[styles.para, GlobalStyles.bodySmallRegular]}>
                      Read Less
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <Text
                    style={[GlobalStyles.bodySmallRegular, styles.bodyText]}
                  >
                    {articleIntro.slice(0, 100)}
                    {"... "}
                  </Text>
                  <TouchableOpacity onPress={toggleFullText}>
                    <Text style={[GlobalStyles.bodySmallRegular, styles.para]}>
                      Read More
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          }
        />
      )}
    </View>
  );
};

export default ArticleScreen;

const styles = StyleSheet.create({
  image: {
    height: 250,
    // width: 365,
    marginTop: 20,
    borderRadius: 5,
  },
  subtitleText: {
    // marginTop: 30,
    // marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    marginBottom: 30,
  },
  titleText: {
    marginBottom: 10,
    fontSize: 25,
  },
  bodyText: {
    overflow: "hidden",
    // width: 350,
    maxWidth: 350,
    marginBottom: 5,
  },
  para: {
    marginTop: 10,
    marginBottom: 30,
    textDecorationLine: "underline",
  },
  articleSourceText: {
    // marginBottom: 10,
  },
  articleAuthorText: {},
  articleDateText: {
    marginBottom: 30,
  },
});
