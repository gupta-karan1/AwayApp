// Used to fetch data for the explore page from the Firestore database. It is used to display articles from the Firestore collection based on the articleCategory prop passed to it.

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
    // an asynchronous function that fetches data from the Firestore collection based on the provided articleCategory.

    try {
      // The query function is used to create a query that fetches documents from the articles collection based on the articleCategory prop passed to the hook.

      const articlesRef = query(
        collectionGroup(FIREBASE_DB, "articles"),
        where("articleCategory", "==", articleCategory)
      );
      // limit is used to limit the number of documents fetched from the collection. This is useful for testing purposes, but it should be removed for production.
      const q = query(articlesRef, limit(2)); // limit for testing purposes only - remove for production

      // const q = query(articlesRef); // use without limit for production
      const querySnapshot = await getDocs(q); // The getDocs function is used to fetch the documents from the collection based on the query created earlier.

      // The data is then extracted from the querySnapshot using the map function to retrieve the actual data from each document using doc.data().
      const data = querySnapshot.docs.map((doc) => doc.data());

      // The data retrieved from the collection is stored in the categoryData state variable using the setCategoryData function.
      setCategoryData(data);
    } catch (error) {
      console.error("Error fetching explore data:", error);
      throw error; // The error is thrown so that it can be handled by the component that calls the useCategoryFeed hook.
    } finally {
      // The loading state variable is set to false using the setLoading function to indicate that the data has been fetched.
      setLoading(false);
    }
  };

  //The useEffect hook is used to trigger the getCategoryData function whenever the articleCategory dependency changes. This ensures that the data is fetched whenever the articleCategory prop passed to the hook changes.
  useEffect(() => {
    getCategoryData();
  }, [articleCategory]);

  return { loading, categoryData };
};

export default useCategoryFeed;

//SUMMARY:  Overall, this custom hook encapsulates the data fetching logic for a specific Firestore collection based on the provided articleCategory. It is designed to be used in React components, allowing them to fetch and manage data from Firestore easily and consistently.
