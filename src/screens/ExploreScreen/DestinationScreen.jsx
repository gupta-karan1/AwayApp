import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import ArticleCardDestination from "../../components/ExploreComp/ArticleCardDestination";
import GlobalStyles from "../../GlobalStyles";
import useArticleData from "../../../hooks/useDestinationScreen";

// DestinationScreen component with route params
const DestinationScreen = ({ route }) => {
  // Deconstruct the route params
  const {
    pathId,
    destinationName,
    destinationCountry,
    destinationDescription,
    destinationImage,
  } = route.params;

  // Custom hook to fetch the loading state and article data based on the pathId
  const { loading, articleData } = useArticleData(pathId);

  // State variable to toggle the full text
  const [showFullText, setShowFullText] = useState(false);

  // Function to toggle the full text
  const toggleFullText = () => {
    setShowFullText(!showFullText);
  };

  // ArticleCard component to render each article item
  const renderArticleCard = ({ item }) => {
    return (
      <ArticleCardDestination
        key={item.articleId}
        articleItem={item}
        path={`${pathId}/${item.articleId}/places`} // path prop to navigate to the place screen
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
          numColumns={2} // display items in 2 columns
          columnWrapperStyle={{
            justifyContent: "space-between",
          }}
          contentContainerStyle={{ paddingHorizontal: 15 }} // add padding to left and right
          // ListHeaderComponenet to render destination details
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
    borderRadius: 10,
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

// SUMMARY: Destination Screen with article cards that redirect user to Place Screen. Using a custom hook to fetch the article data from Firebase using a pathId to specify the destination. The pathId is passed as a route param from the Explore Screen. The route params are deconstructed to get the pathId, destination name, country, description, and image. Flatlist is used to render the article cards and ListHeaderComponent is used to render the destination details. The ArticleCardDestination component is used to render each article card. The path prop is passed to the ArticleCardDestination component to specify the path to the place screen.
