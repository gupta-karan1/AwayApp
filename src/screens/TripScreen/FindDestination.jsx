import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import ArticleCardDestination from "../../components/ExploreComp/ArticleCardDestination";
import GlobalStyles from "../../GlobalStyles";
import useArticleData from "../../../hooks/useDestinationScreen";
import { useState, useEffect } from "react";
import { collectionGroup, getDocs, query, where } from "firebase/firestore";
import { FIREBASE_DB } from "../../../firebaseConfig";

const DestinationScreen = ({ pathId, tripLocation }) => {
  const [destinationData, setDestinationData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const getDestinationData = async () => {
    try {
      const destinationRef = query(
        collectionGroup(FIREBASE_DB, "destinations"),
        where("destinationName", "==", tripLocation)
      );
      const q = query(destinationRef);
      const querySnapshot = await getDocs(q);
      //   const data = querySnapshot.docs[0].data();
      querySnapshot.forEach((doc) => {
        setDestinationData(doc.data());
      });

      //   const data = querySnapshot.docs.map((doc) => doc.data());
      //   setDestinationData(data);
    } catch (error) {
      console.log("Error:" + error);
    } finally {
      setIsLoading(false);
    }
  };
  const { loading, articleData } = useArticleData(pathId);

  useEffect(() => {
    getDestinationData();
    console.log(destinationData);
  }, []);

  const [showFullText, setShowFullText] = useState(false);

  const toggleFullText = () => {
    setShowFullText(!showFullText);
  };

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
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
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
              {isLoading ? (
                <ActivityIndicator />
              ) : (
                <View>
                  <Text
                    style={[GlobalStyles.bodySmallRegular, styles.subtitleText]}
                  >
                    {destinationData.country}
                  </Text>
                  <Text
                    style={[GlobalStyles.titleLargeRegular, styles.titleText]}
                  >
                    {destinationData.destinationName}
                  </Text>
                  {showFullText ? (
                    <View>
                      <Text
                        style={[GlobalStyles.bodySmallRegular, styles.bodyText]}
                      >
                        {destinationData.description}
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
                        {destinationData.description?.slice(0, 50)}
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
              )}
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
