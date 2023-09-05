import { StyleSheet } from "react-native";
import React, { useState, useCallback, useEffect, useContext } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { useRoute, useIsFocused } from "@react-navigation/native";
import { Alert } from "react-native";
import {
  collection,
  doc,
  addDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { FIREBASE_DB } from "../../../firebaseConfig";
import { AuthContext } from "../../../hooks/AuthContext";

const Chat = () => {
  const route = useRoute();
  const { tripId, invitees, userId } = route.params || {};
  const [messages, setMessages] = useState([]);
  const isFocused = useIsFocused(); // Track component focus

  const { user } = useContext(AuthContext); // AuthContext to get user id
  // console.log(user);

  // const unsubscribe = () => {
  //   // Implement the logic to clean up your message listener here
  //   // Check if there is an active listener and stop it
  //   if (unsubscribe) {
  //     unsubscribe();
  //   }
  // };

  useEffect(() => {
    let unsubscribeTripListener; // Store the trip listener unsubscribe function
    let unsubscribeMessagesListener; // Store the messages listener unsubscribe function

    const setupMessageListener = async () => {
      if (!tripId) {
        // Handle the case where tripId is not available
        return;
      }

      const q3 = query(
        collection(FIREBASE_DB, "users"),
        where("userId", "==", userId)
      );

      const querySnapshot1 = await getDocs(q3);
      const userRef = doc(FIREBASE_DB, "users", querySnapshot1.docs[0].id);

      const q = query(
        collection(userRef, "trips"),
        where("tripId", "==", tripId)
      );

      unsubscribeTripListener = onSnapshot(q, (querySnapshot1) => {
        if (querySnapshot1.empty) {
          // Handle the case where the trip document no longer exists
          return;
        }

        const tripRef = doc(userRef, "trips", querySnapshot1.docs[0].id);
        const messagesQuery = query(
          collection(tripRef, "messages"),
          orderBy("createdAt", "desc")
        );

        unsubscribeMessagesListener = onSnapshot(
          messagesQuery,
          (querySnapshot2) => {
            const messagesData = querySnapshot2.docs.map((doc) => doc.data());
            const transformedMessages = messagesData.map((message) => ({
              _id: message._id,
              text: message.text,
              createdAt: message.createdAt.toDate(),
              user: {
                _id: message.user._id,
                name: message.user.name,
              },
            }));
            setMessages(transformedMessages);
          }
        );
      });
    };

    if (isFocused) {
      setupMessageListener();
    }

    return () => {
      // Unsubscribe from both listeners when the component is unmounted
      if (unsubscribeTripListener) {
        unsubscribeTripListener();
      }
      if (unsubscribeMessagesListener) {
        unsubscribeMessagesListener();
      }
    };
  }, [isFocused, tripId, userId]);

  // useEffect(() => {
  //   if (isFocused && tripId) {
  //     // Start message listener only when the component is focused and tripId is available
  //     setupMessageListener();
  //   }

  //   return () => {
  //     // Clean up the listener when leaving the component
  //     cleanupMessageListener();
  //   };
  // }, [isFocused, tripId]);

  // const cleanupMessageListener = () => {
  //   // Implement the logic to clean up your message listener here
  //   // Check if there is an active listener and stop it
  //   if (unsubscribe) {
  //     unsubscribe();
  //   }
  // };

  // const setupMessageListener = async () => {
  //   const q3 = query(
  //     collection(FIREBASE_DB, "users"),
  //     where("userId", "==", userId)
  //   );

  //   const querySnapshot1 = await getDocs(q3);
  //   const userRef = doc(FIREBASE_DB, "users", querySnapshot1.docs[0].id);

  //   const q = query(
  //     collection(userRef, "trips"),
  //     where("tripId", "==", tripId)
  //   );

  //   const unsubscribe = onSnapshot(q, (querySnapshot1) => {
  //     const tripRef = doc(userRef, "trips", querySnapshot1.docs[0].id);
  //     const messagesQuery = query(
  //       collection(tripRef, "messages"),
  //       orderBy("createdAt", "desc")
  //     );

  //     const unsubscribeMessages = onSnapshot(
  //       messagesQuery,
  //       (querySnapshot2) => {
  //         const messagesData = querySnapshot2.docs.map((doc) => doc.data());
  //         const transformedMessages = messagesData.map((message) => ({
  //           _id: message._id,
  //           text: message.text,
  //           createdAt: message.createdAt.toDate(),
  //           user: {
  //             _id: message.user._id,
  //             name: message.user.name,
  //           },
  //         }));
  //         setMessages(transformedMessages);
  //       }
  //     );

  //     return () => {
  //       unsubscribeMessages();
  //     };
  //   });

  //   return () => {
  //     unsubscribe();
  //   };
  // };

  const onSend = useCallback((newMessages = []) => {
    addMessages(newMessages);
  }, []);

  // Add messages to the "messages" subcollection under specific trip
  const addMessages = async (newMessages) => {
    try {
      const q3 = query(
        collection(FIREBASE_DB, "users"),
        where("userId", "==", userId)
      );

      const querySnapshot3 = await getDocs(q3);
      const userRef = doc(FIREBASE_DB, "users", querySnapshot3.docs[0].id);

      const q2 = query(
        collection(userRef, "trips"),
        where("tripId", "==", tripId)
      );
      const querySnapshot1 = await getDocs(q2);
      const tripRef = doc(userRef, "trips", querySnapshot1.docs[0].id);

      // for loop to add each message to the "messages" subcollection
      for (const message of newMessages) {
        const messageData = {
          _id: message._id,
          text: message.text,
          createdAt: message.createdAt,
          user: {
            _id: user.uid,
            name: user.displayName,
          },
        };
        await addDoc(collection(tripRef, "messages"), messageData);
      }
    } catch (error) {
      Alert.alert("Error adding messages", error.message);
    }
  };

  // GiftedChat library that provides a chat UI
  return (
    <GiftedChat
      isTyping={true}
      showAvatarForEveryMessage={true} // show avatar for every message
      showUserAvatar={true}
      messages={messages} // messages to display
      onSend={(messages) => onSend(messages)} // callback function to send messages
      user={{
        // user object
        _id: user ? user.uid : "",
        name: user ? user.displayName : "",
      }}
    />
  );
};

export default Chat;

const styles = StyleSheet.create({});
