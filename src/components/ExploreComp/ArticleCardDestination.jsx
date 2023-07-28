import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import GlobalStyles from "../../GlobalStyles";

// This component is used to display articles on the destination screen based on the path and articleItem props passed to it.

const ArticleCardDestination = ({ path, articleItem }) => {
  // The articleItem prop is destructured to extract the data to be displayed from the articleItem object.
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
      <Text style={[GlobalStyles.labelMediumMedium, styles.sourceText]}>
        {articleSource}
      </Text>
      <Text style={GlobalStyles.bodyMediumBold} numberOfLines={2}>
        {articleTitle}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "48%",
    marginBottom: 30,
  },
  image: {
    height: 130,
    width: "100%",
    borderRadius: 10,
    backgroundColor: "lightgrey",
  },
  sourceText: {
    marginTop: 10,
  },
});

export default ArticleCardDestination;
