import { StyleSheet, Text, Pressable, Image } from "react-native"; // These components are imported from the React Native library. They are used to build the user interface of the component.
import { useNavigation } from "@react-navigation/native"; // This component is used to navigate between screens in the app.
import GlobalStyles from "../../GlobalStyles"; // This is used to import the GlobalStyles stylesheet which contains commonly used styling properties and values.

// This component is used to display articles on the explore screen based on the path and articleItem props passed to it.

const ArticleCard = ({ path, articleItem }) => {
  // The path prop is used to determine the path to the article screen. The articleItem prop is used to display the article data on the explore screen.

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

  // The component returns a Pressable component that displays the article data passed to it as props.

  // The navigate function is used to navigate to the ArticleScreen component when the Pressable component is pressed. The article data is passed to the ArticleScreen component as props.
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

// The styles for the component are defined using the StyleSheet.create method.
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
