import { StyleSheet, Text } from "react-native";
import React, { useState, useCallback, useEffect, useContext } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { useRoute } from "@react-navigation/native";
import { Alert, ActivityIndicator } from "react-native";
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
  const { tripId, invitees, userId } = route.params;
  const [messages, setMessages] = useState([]);

  const { user } = useContext(AuthContext);
  // console.log(user);

  useEffect(() => {
    setupMessageListener();
  }, []);

  const setupMessageListener = async () => {
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
    const unsubscribe = onSnapshot(q, (querySnapshot1) => {
      const tripRef = doc(userRef, "trips", querySnapshot1.docs[0].id);
      const messagesQuery = query(
        collection(tripRef, "messages"),
        orderBy("createdAt", "desc")
      );

      const unsubscribeMessages = onSnapshot(
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

      return () => {
        unsubscribeMessages();
      };
    });

    return () => {
      unsubscribe();
    };
  };

  const onSend = useCallback((newMessages = []) => {
    addMessages(newMessages);
  }, []);

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

  return (
    <GiftedChat
      // isTyping={true}
      showAvatarForEveryMessage={true}
      showUserAvatar={true}
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: user.uid,
        name: user.displayName,
      }}
    />
  );
};

export default Chat;

const styles = StyleSheet.create({});
