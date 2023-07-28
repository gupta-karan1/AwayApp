import { StyleSheet, View, FlatList, Text } from "react-native";
import { useCallback } from "react";
import ArticleCard from "./ArticleCard";
import GlobalStyles from "../../GlobalStyles";
import useCategoryFeed from "../../../hooks/useCategoryFeed";

// display articles on the explore page based on the articleCategory prop passed to it. It is used to display articles from the Firestore collection based on the articleCategory prop passed to it.
const CategoryFeed = ({ articleCategory }) => {
  const { categoryData } = useCategoryFeed(articleCategory); // The useCategoryFeed hook is used to fetch data from the Firestore database based on the provided articleCategory.

  // The useCallback hook is used to memoize the renderArticleCard function so that it is not re-created every time the component re-renders. This ensures that the FlatList component does not re-render unnecessarily. The renderArticleCard function is used to render the ArticleCard component for each item in the categoryData array.
  const renderArticleCard = useCallback(({ item }) => {
    return (
      <ArticleCard
        key={item.articleId}
        articleItem={item}
        path={`destinations/${item.destinationId}/articles/${item.articleId}/places`}
      />
    );
  }, []);

  // The FlatList component is used to render the ArticleCard component for each item in the categoryData array. It is used to display articles from the Firestore collection based on the articleCategory prop passed to it.
  return (
    <View style={styles.container}>
      <Text style={[GlobalStyles.titleLargeRegular, styles.titleText]}>
        {articleCategory}
      </Text>
      <FlatList
        data={categoryData} // The data prop is used to pass the categoryData array to the FlatList component.
        renderItem={renderArticleCard} // The renderItem prop is used to pass the renderArticleCard function to the FlatList component.
        keyExtractor={(item) => item.articleId} // The keyExtractor prop is used to specify the unique key for each item in the categoryData array.
        horizontal // The horizontal prop is used to specify that the FlatList component should be rendered horizontally.
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
