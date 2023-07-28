import { useState, useEffect } from "react"; // These are used to manage state and side effects in functional components.
import { doc, getDoc } from "firebase/firestore"; // imported from the Firebase Firestore library. These are used to interact with the Firestore database and retrieve documents from a collection.
import { FIREBASE_DB } from "../firebaseConfig"; //  It represents the Firebase Firestore database instance

// display place data on the place screen based on the pathId prop passed to it.

const usePlaceScreen = (pathId) => {
  // custom React Hook that fetches data from the Firestore database based on the provided pathId.

  const [singlePlaceData, setSinglePlaceData] = useState({}); // This state variable holds an object that will contain the data fetched from the Firestore collection. It is initialized as an empty object.

  const [loading, setLoading] = useState(true); // This state variable holds a boolean value that indicates whether the data is still being fetched from the database. It is initialized as true.

  const getSinglePlaceData = async () => {
    // an asynchronous function that fetches data from the Firestore collection based on the provided pathId.

    try {
      //uses a try-catch block to handle any errors that may occur during the data retrieval process.

      const docRef = doc(FIREBASE_DB, pathId); // The doc function is used to create a reference to the document in the Firestore database based on the pathId prop passed to the hook.

      const docSnap = await getDoc(docRef); // The getDoc function is used to fetch the document from the database based on the reference created earlier.

      if (docSnap.exists()) {
        // The exists function is used to check if the document exists in the database.

        const data = docSnap.data(); // The data is then extracted from the docSnap using the data function to retrieve the actual data from the document using doc.data().

        setSinglePlaceData(data); // The data retrieved from the document is stored in the singlePlaceData state variable using the setSinglePlaceData function.
      } else {
        // If the document does not exist in the database, an error is logged to the console.

        console.log("No such document!");
      }
    } catch (error) {
      console.log(error);

      throw error; // The error is thrown so that it can be handled by the component that calls the usePlaceScreen hook.
    } finally {
      setLoading(false); // The loading state variable is set to false using the setLoading function to indicate that the data has been fetched.
    }
  };

  useEffect(() => {
    // The useEffect hook is used to trigger the getSinglePlaceData function whenever the pathId dependency changes. This ensures that the data is fetched whenever the pathId prop passed to the hook changes.

    getSinglePlaceData();
  }, [pathId]);

  // The loading state variable is returned from the hook so that it can be used to display a loading indicator while the data is being fetched.
  // The singlePlaceData state variable is returned from the hook so that it can be used to display the data fetched from the Firestore collection.

  return { loading, singlePlaceData };
};

export default usePlaceScreen; // The usePlaceScreen hook is exported so that it can be used in other parts of the application.
