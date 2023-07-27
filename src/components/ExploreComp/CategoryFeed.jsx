import { StyleSheet, View, FlatList, Text } from "react-native";
import { useCallback } from "react";
import ArticleCard from "./ArticleCard";
import GlobalStyles from "../../GlobalStyles";
import useCategoryFeed from "../../../hooks/useCategoryFeed";

const CategoryFeed = ({ articleCategory }) => {
  const { categoryData } = useCategoryFeed(articleCategory);

  const renderArticleCard = useCallback(({ item }) => {
    return (
      <ArticleCard
        key={item.articleId}
        articleItem={item}
        path={`destinations/${item.destinationId}/articles/${item.articleId}/places`}
      />
    );
  }, []);

  return (
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
