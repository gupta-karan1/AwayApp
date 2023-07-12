import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

const ArticleCard = ({ author, category, date, image, intro, saved, source, title, url, path }) => {
  const { navigate } = useNavigation();

  return (
    <View>
      <Pressable
      onPress={() =>
        navigate("ArticleScreen", {
          pathId: path,
        })
      }
    >
      <Image source={{ uri: image }} style={styles.image} />
      <Text>{title}</Text>
      <Text>{date}</Text>
      <Text>{author}</Text>
      <Text>{category}</Text>
      <Text>{intro}</Text>
      <Text>{saved}</Text>
      <Text>{source}</Text>
      <Text>{url}</Text>
      <Text>{path}</Text>
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