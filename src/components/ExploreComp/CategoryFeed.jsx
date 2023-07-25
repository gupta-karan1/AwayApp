import {
  StyleSheet,
  View,
  ActivityIndicator,
  FlatList,
  Text,
} from "react-native";
// import {
//   getDocs,
//   limit,
//   query,
//   collectionGroup,
//   where,
// } from "firebase/firestore";
// import React, { useState, useEffect, useCallback } from "react";
// import { FIREBASE_DB } from "../../../firebaseConfig";
import { useCallback } from "react";
import ArticleCard from "./ArticleCard";
import GlobalStyles from "../../GlobalStyles";
import useCategoryFeed from "../../../hooks/useCategoryFeed";

const CategoryFeed = ({ articleCategory }) => {
  // const [loading, setLoading] = useState(true);
  // const [data, setData] = useState([]);

  // const getData = async () => {
  //   try {
  //     const articlesRef = query(
  //       collectionGroup(FIREBASE_DB, "articles"),
  //       where("articleCategory", "==", articleCategory)
  //     );
  //     const q = query(articlesRef, limit(2)); // limit to 2 articles for development purposes
  //     // const q = query(articlesRef); // use without limit for production
  //     const querySnapshot = await getDocs(q);
  //     const data = querySnapshot.docs.map((doc) => doc.data());
  //     setData(data);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error("Error fetching explore data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const { loading, categoryData } = useCategoryFeed(articleCategory);

  const renderArticleCard = useCallback(({ item }) => {
    return (
      <ArticleCard
        key={item.articleId}
        articleItem={item}
        path={`destinations/${item.destinationId}/articles/${item.articleId}/places`}
      />
    );
  }, []);

  // useEffect(() => {
  //   getData();
  // }, []);

  return (
    <View>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <View style={styles.container}>
          <Text style={[GlobalStyles.titleLargeRegular, styles.titleText]}>
            {articleCategory}
          </Text>
          <FlatList
            data={categoryData}
            renderItem={renderArticleCard}
            keyExtractor={(item) => item.articleId}
            horizontal
            // Performance settings
            removeClippedSubviews={true} // Unmount components when outside of window
            initialNumToRender={2} // Reduce initial render amount
            maxToRenderPerBatch={2} // Reduce number in each render batch
            updateCellsBatchingPeriod={100} // Increase time between renders
            windowSize={2} // Reduce the window size
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ width: 15 }}></View>} // add space between items
            contentContainerStyle={{ paddingHorizontal: 15 }} // add padding only to the first and last item
          />
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
  titleText: {
    marginLeft: 15,
    marginBottom: 15,
  },
});

export default CategoryFeed;
