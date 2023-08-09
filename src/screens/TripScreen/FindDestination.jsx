import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { useState, useEffect } from "react";
import { collectionGroup, getDocs, query, where } from "firebase/firestore";
import { FIREBASE_DB } from "../../../firebaseConfig";
import GlobalStyles from "../../GlobalStyles";
import useArticleData from "../../../hooks/useDestinationScreen";
import FindArticleCard from "../../components/TripsComp/FindArticleCard";

// Component to render destination content for Find screen, passing pathId and tripLocation props
const FindDestination = ({ tripLocation }) => {
  // State variables to store destination data and loading state
  const [destinationData, setDestinationData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTripLocation, setSearchTripLocation] = useState(
    tripLocation || "Paris"
  );

  const [searchResults, setSearchResults] = useState([]);
  // pathId for article data based on tripLocation. Lowercase to match database.
  const [pathId, setPathId] = useState(
    `destinations/${searchTripLocation.toLowerCase()}/articles`
  );

  // Function to fetch destination data from Firebase based on tripLocation
  const getDestinationData = async () => {
    try {
      // Query destinations collection group where the destinationName matches tripLocation
      // Extract the first letter and capitalize it
      const firstLetterCapitalized = searchTripLocation.charAt(0).toUpperCase();

      // Join the capitalized letter with the rest of the text
      const capitalizedLocation =
        firstLetterCapitalized + searchTripLocation.slice(1);
      const destinationRef = query(
        collectionGroup(FIREBASE_DB, "destinations"),
        where("destinationName", "==", capitalizedLocation)
      );
      // query reference to destinationRef
      const q = query(destinationRef);
      // getDocs to asynchronously fetch documents that match the query
      const querySnapshot = await getDocs(q);
      // Loop through query results for each document and set destinationData state variable
      querySnapshot.forEach((doc) => {
        setDestinationData(doc.data());
      });
      // Handle errors
    } catch (error) {
      console.log("Error:" + error);
      Alert.alert("Error", error.message);
      // Regardless of result set loading to false
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch destinations based on search query
  const fetchDestinations = async (queryText) => {
    try {
      const firstLetterCapitalized = queryText.charAt(0).toUpperCase();
      const capitalizedLocation = firstLetterCapitalized + queryText.slice(1);

      const destinationRef = query(
        collectionGroup(FIREBASE_DB, "destinations"),
        where("destinationName", ">=", capitalizedLocation), // Use startAt for "startsWith" query
        where("destinationName", "<", capitalizedLocation + "\uf8ff") // Use endAt for "endsWith" query
      );

      const q = query(destinationRef);
      const querySnapshot = await getDocs(q);

      const results = [];
      querySnapshot.forEach((doc) => {
        results.push(doc.data());
      });
      setSearchResults(results);
    } catch (error) {
      console.log("Error:" + error);
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (text) => {
    if (text) {
      // Fetch destinations only when there is some text in the search field
      fetchDestinations(text);
    } else {
      setSearchResults([]); // Clear search results when search field is empty
    }
  };

  const { loading, articleData } = useArticleData(pathId);

  // useEffect to call getDestinationData whenever searchTripLocation changes
  useEffect(() => {
    getDestinationData();
  }, [searchTripLocation]);

  // State variable to toggle text description
  const [showFullText, setShowFullText] = useState(false);

  // Function to toggle text description
  const toggleFullText = () => {
    setShowFullText(!showFullText);
  };

  // ArticleCard component for Find Destination screen with path prop
  const renderArticleCard = ({ item }) => {
    return (
      <FindArticleCard
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
          keyExtractor={(item) => item.articleId} // extract unique key for each item
          numColumns={2} // display items in 2 columns
          removeClippedSubviews={true}
          initialNumToRender={2}
          maxToRenderPerBatch={2}
          updateCellsBatchingPeriod={100}
          windowSize={2}
          columnWrapperStyle={{
            justifyContent: "space-between", //items spaced evenly
          }}
          contentContainerStyle={{ paddingHorizontal: 15 }} // add padding to left and right
          ListHeaderComponent={
            <View>
              <TextInput
                style={styles.input}
                placeholder="Search Destination"
                onChangeText={handleSearchChange} // Add onChangeText handler
              />
              <View style={styles.searchResultContainer}>
                {searchResults.map((result) => (
                  <TouchableOpacity
                    key={result.destinationName}
                    onPress={() => {
                      setDestinationData(result);
                      setSearchTripLocation(result.destinationName);
                      setPathId(
                        `destinations/${result.destinationName.toLowerCase()}/articles`
                      );
                      setSearchResults([]);
                    }}
                  >
                    <Text style={styles.searchResult}>
                      {result.destinationName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {isLoading ? (
                <ActivityIndicator />
              ) : (
                <View>
                  <View>
                    <Text
                      style={[
                        GlobalStyles.bodySmallRegular,
                        styles.subtitleText,
                      ]}
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
                          style={[
                            GlobalStyles.bodySmallRegular,
                            styles.bodyText,
                          ]}
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
                          style={[
                            GlobalStyles.bodySmallRegular,
                            styles.bodyText,
                          ]}
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
                </View>
              )}
            </View>
          }
          // hide scroll indicator
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default FindDestination;

const styles = StyleSheet.create({
  // image: {
  //   height: 250,
  //   // width: 365,
  //   marginTop: 20,
  //   borderRadius: 5,
  // },
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
    maxWidth: 350,
  },
  para: {
    marginTop: 10,
    marginBottom: 30,
    textDecorationLine: "underline",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 50,
    marginTop: 15,
    marginBottom: 8,
  },
  searchResult: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 15,
    // marginTop: 5,
    // borderRadius: 10,
  },
  searchResultContainer: {
    borderRadius: 10,
  },
});

// SUMMARY: This code sets up the destination screen in the Find section of the Trip Plan. It fetches the destination data from Firebase using the tripLocation prop, where the tripLocation matches the destinationName. It also uses the useArticleData hook to fetch the article data from Firebase using the pathId. It renders an ArticleCardDestination component for each article in the articleData state variable. It renders the cards in a grid format using FlatList. The ListHeader Component is used to display the destination data.
