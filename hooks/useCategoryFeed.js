import { useState, useEffect } from "react";
import {
  getDocs,
  limit,
  query,
  collectionGroup,
  where,
} from "firebase/firestore";
import { FIREBASE_DB } from "../firebaseConfig";

const useCategoryFeed = (articleCategory) => {
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState([]);

  const getCategoryData = async () => {
    try {
      const articlesRef = query(
        collectionGroup(FIREBASE_DB, "articles"),
        where("articleCategory", "==", articleCategory)
      );
      const q = query(articlesRef, limit(2)); // limit to 2 articles for development purposes
      // const q = query(articlesRef); // use without limit for production
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => doc.data());
      setCategoryData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching explore data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategoryData();
  }, [articleCategory]);

  return { loading, categoryData };
};

export default useCategoryFeed;
