import { StyleSheet, Text, Pressable, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import GlobalStyles from "../../GlobalStyles";

// This component is used to display articles on the explore screen based on the path and articleItem props passed to it.

const ArticleCard = ({ path, articleItem }) => {
  // The articleItem prop is destructured to extract the article data.
  const {
    articleAuthor,
    articleCategory,
    articleDate,
    articleImg,
    articleIntro,
    articleSaved,
    articleSource,
    articleTitle,
    articleUrl,
  } = articleItem;

  // The useNavigation hook is used to access the navigation prop of the component.
  const { navigate } = useNavigation();

  return (
    <Pressable
      style={styles.container}
      onPress={() =>
        navigate("ArticleScreen", {
          pathId: path,
          articleImg,
          articleTitle,
          articleCategory,
          articleAuthor,
          articleDate,
          articleIntro,
          articleSaved,
          articleSource,
          articleUrl,
        })
      }
    >
      <Image source={{ uri: articleImg }} style={styles.image} />
      <Text style={GlobalStyles.labelMediumMedium}>{articleSource}</Text>
      <Text style={GlobalStyles.bodyMediumBold} numberOfLines={2}>
        {articleTitle}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 220,
  },
  image: {
    height: 150,
    width: 220,
    borderRadius: 10,
    marginBottom: 5,
    backgroundColor: "lightgrey",
  },
});

export default ArticleCard;
