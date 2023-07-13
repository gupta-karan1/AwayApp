import { StyleSheet, View, ActivityIndicator, FlatList } from "react-native";
import {
  getDocs,
  limit,
  query,
  collectionGroup,
  where,
} from "firebase/firestore";
import React, { useState, useEffect, useCallback } from "react";
import { FIREBASE_DB } from "../../firebaseConfig";
import ArticleCard from "./ArticleCard";

const ThingsToDo = () => {
  const [loading, setLoading] = useState(true);
  const [thingsToDo, setThingsToDo] = useState([]); // things to do state
  // function to get things to do from firebase

  const getThingsToDo = async () => {
    const thingsToDoRef = query(
      collectionGroup(FIREBASE_DB, "articles"),
      where("articleCategory", "==", "Things to do")
    );
    const q = query(thingsToDoRef, limit(2));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => doc.data());
    setThingsToDo(data);
  };

  const renderArticleCard = useCallback(({ item }) => {
    return (
      <ArticleCard
        key={item.articleId}
        articleItem={item}
        path={`destinations/${item.destinationId}/articles/${item.articleId}/places`}
      />
    );
  });

  useEffect(() => {
    getThingsToDo();
    setLoading(false);
  }, []);
  return (
    <View>
      {loading && <ActivityIndicator size="large" />}
      {!loading && (
        <View>
          <FlatList
            data={thingsToDo}
            renderItem={renderArticleCard}
            keyExtractor={(item) => item.articleId}
            horizontal
            // Performance settings
            removeClippedSubviews={true} // Unmount components when outside of window
            initialNumToRender={2} // Reduce initial render amount
            maxToRenderPerBatch={2} // Reduce number in each render batch
            updateCellsBatchingPeriod={100} // Increase time between renders
            windowSize={2} // Reduce the window size
          />
        </View>
      )}
    </View>
  );
};

export default ThingsToDo;

const styles = StyleSheet.create({});
