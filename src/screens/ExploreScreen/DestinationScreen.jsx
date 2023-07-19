import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { FIREBASE_DB } from "../../../firebaseConfig";
import ArticleCardDestination from "../../components/ExploreComp/ArticleCardDestination";
import GlobalStyles from "../../GlobalStyles";

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
  const [showFullText, setShowFullText] = useState(false);

  const toggleFullText = () => {
    setShowFullText(!showFullText);
  };

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
      <ArticleCardDestination
        key={item.articleId}
        articleItem={item}
        path={`${pathId}/${item.articleId}/places`}
      />
    );
  };

  return (
    <View>
      {loading && <ActivityIndicator size="large" />}
      {!loading && (
        <FlatList
          data={articleData}
          renderItem={renderArticleCard}
          keyExtractor={(item) => item.articleId}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
          }}
          contentContainerStyle={{ paddingHorizontal: 15 }} // add padding only to the first and last item
          ListHeaderComponent={
            <View>
              <Image source={{ uri: destinationImage }} style={styles.image} />
              <View>
                <Text
                  style={[GlobalStyles.bodySmallRegular, styles.subtitleText]}
                >
                  {destinationCountry}
                </Text>
                <Text
                  style={[GlobalStyles.titleLargeRegular, styles.titleText]}
                >
                  {destinationName}
                </Text>
                {showFullText ? (
                  <View>
                    <Text
                      style={[GlobalStyles.bodySmallRegular, styles.bodyText]}
                    >
                      {destinationDescription}
                    </Text>
                    <TouchableOpacity onPress={toggleFullText}>
                      <Text
                        style={[styles.para, GlobalStyles.bodySmallRegular]}
                      >
                        Read Less
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View>
                    <Text
                      style={[GlobalStyles.bodySmallRegular, styles.bodyText]}
                    >
                      {destinationDescription.slice(0, 150)}
                      {"... "}
                    </Text>
                    <TouchableOpacity onPress={toggleFullText}>
                      <Text
                        style={[GlobalStyles.bodySmallRegular, styles.para]}
                      >
                        Read More
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default DestinationScreen;

const styles = StyleSheet.create({
  image: {
    height: 250,
    // width: 365,
    marginTop: 20,
    borderRadius: 5,
  },
  subtitleText: {
    marginTop: 30,
    marginBottom: 10,
  },
  titleText: {
    marginBottom: 10,
    fontSize: 25,
  },
  bodyText: {
    overflow: "hidden",
    // width: 350,
    maxWidth: 350,
  },
  para: {
    marginTop: 10,
    marginBottom: 30,
    textDecorationLine: "underline",
  },
});
