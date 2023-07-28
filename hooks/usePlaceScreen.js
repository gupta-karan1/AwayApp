import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../firebaseConfig";

// display place data on the place screen based on the pathId prop passed to it.

// custom React Hook that fetches data from the Firestore database based on the provided pathId.
const usePlaceScreen = (pathId) => {
  const [singlePlaceData, setSinglePlaceData] = useState({});

  const [loading, setLoading] = useState(true);

  const getSinglePlaceData = async () => {
    // an asynchronous function that fetches data from the Firestore collection based on the provided pathId.

    try {
      const docRef = doc(FIREBASE_DB, pathId); // The doc function is used to create a reference to the document in the Firestore database based on the pathId prop passed to the hook.

      const docSnap = await getDoc(docRef); // The getDoc function is used to fetch the document from the database based on the reference created earlier.

      if (docSnap.exists()) {
        // The exists function is used to check if the document exists in the database.

        const data = docSnap.data(); // The data is then extracted from the docSnap using the data function to retrieve the actual data from the document using doc.data().

        setSinglePlaceData(data); // The data retrieved from the document is stored in the singlePlaceData state variable using the setSinglePlaceData function.
      } else {
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

  return { loading, singlePlaceData };
};

export default usePlaceScreen;
