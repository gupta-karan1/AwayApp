import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useState, useCallback } from "react";
import useArticleScreen from "../../../hooks/useArticleScreen";
import GlobalStyles from "../../GlobalStyles";
import FindPlaceCard from "../../components/TripsComp/FindPlaceCard";
import { ImageBackground } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
// import { Animated } from "react-native";

// ArticleScreen component with route params to display article with places within the find section
const FindArticle = ({ route }) => {
  // Deconstruct the route params
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

  // Custom hook to fetch the loading state and place data based on the pathId
  const { loading, placeData } = useArticleScreen(pathId);

  // State variable to toggle the full text
  const [showFullText, setShowFullText] = useState(false);

  // Function to toggle the full text
  const toggleFullText = () => {
    setShowFullText(!showFullText);
  };

  // PlaceCard component to render each place item
  const renderPlaceCard = useCallback(({ item }) => {
    return (
      <FindPlaceCard
        key={item.placeId}
        placeItem={item}
        path={`${pathId}/${item.placeId}`} // path prop to navigate to the place screen using placeId
      />
    );
  }, []); // add an empty array as the second argument to useCallback to avoid re-rendering the component

  // const Navigation = useNavigation();

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={placeData}
          renderItem={renderPlaceCard}
          keyExtractor={(item) => item.placeId}
          numColumns={2} // display items in 2 columns
          removeClippedSubviews={true}
          initialNumToRender={2}
          maxToRenderPerBatch={2}
          updateCellsBatchingPeriod={100}
          windowSize={2}
          columnWrapperStyle={{
            justifyContent: "space-between", // add space between columns
          }}
          showsVerticalScrollIndicator={false} // hide scroll bar
          contentContainerStyle={{ paddingHorizontal: 15 }} // add padding to left and right
          ListHeaderComponent={
            <View>
              <ImageBackground
                source={{ uri: articleImg }}
                style={styles.image}
                imageStyle={{ borderRadius: 10 }}
              ></ImageBackground>
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

              {articleAuthor && (
                <Text
                  style={[
                    GlobalStyles.bodySmallRegular,
                    styles.articleAuthorText,
                  ]}
                >
                  By {articleAuthor}
                </Text>
              )}

              {articleAuthor && (
                <Text
                  style={[
                    GlobalStyles.labelMediumMedium,
                    styles.articleDateText,
                  ]}
                >
                  {articleDate}
                </Text>
              )}

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

export default FindArticle;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    height: 250,
    marginTop: 20,
  },
  subtitleText: {
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
    maxWidth: 350,
    marginBottom: 5,
  },
  para: {
    marginTop: 10,
    marginBottom: 30,
    textDecorationLine: "underline",
  },
  articleAuthorText: {},
  articleDateText: {
    marginBottom: 30,
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    padding: 5,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    // zIndex: 1, // Add zIndex property
  },
});

// SUMMARY: The ArticleScreen component displays article details and a list of related places. The useArticleScreen hook fetches place data from Firebase based on given pathId. It sets the data in the placeData state variable, which is then used to render individual place cards using the renderPlaceCard function. The FlatList is used to render the list of places. The ListHeaderComponent is used to display the article details.
