import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

const ArticleCard = ({ path, articleItem }) => {
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
  const { navigate } = useNavigation();

  return (
    <View>
      <Pressable
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
        <Text>{articleTitle}</Text>
        <Text>{articleSource}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 200,
    width: 200,
  },
});

export default ArticleCard;
