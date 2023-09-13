import {
  KeyboardAvoidingView,
  StyleSheet,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
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
import { View } from "react-native";
import { InputToolbar } from "react-native-gifted-chat";
// import { InputToolbarProps } from "react-native-gifted-chat/lib/Models";
import { FontAwesome } from "@expo/vector-icons";
import { Send } from "react-native-gifted-chat";
import { Ionicons } from "@expo/vector-icons";
import { Bubble } from "react-native-gifted-chat";
import { Avatar } from "react-native-gifted-chat";

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
            avatar: user.photoURL,
          },
        };
        await addDoc(collection(tripRef, "messages"), messageData);
      }
    } catch (error) {
      Alert.alert("Error adding messages", error.message);
    }
  };

  // KeyboardAvoidingView to avoid the keyboard

  const InputToolbarNew = (props) => {
    return (
      <View style={{ backgroundColor: "#fff" }}>
        <InputToolbar
          {...props}
          containerStyle={{
            borderTopWidth: 0,
            borderRadius: 500,
            backgroundColor: "#E5E8E3",
            marginHorizontal: 10,
            // marginBottom: -20,
            padding: 5,
            elevation: 0,
          }}
        />
      </View>
    );
  };

  // GiftedChat library that provides a chat UI
  return (
    <KeyboardAvoidingView style={styles.container}>
      <GiftedChat
        isTyping={true}
        showAvatarForEveryMessage={false} // show avatar for every message
        showUserAvatar={true}
        messages={messages} // messages to display
        onSend={(messages) => onSend(messages)} // callback function to send messages
        user={{
          // user object
          _id: user ? user.uid : "",
          name: user ? user.displayName : "",
          avatar: user ? user.photoURL : "",
        }}
        placeholder="Message your trip mates..."
        infiniteScroll={true}
        // scrollToBottom={true}
        alwaysShowSend={true}
        messagesContainerStyle={{
          paddingBottom: 22,
        }}
        maxInputLength={100}
        maxComposerHeight={75}
        scrollToBottom={true}
        scrollToBottomComponent={() => {
          return (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginHorizontal: 10,
              }}
            >
              <FontAwesome name="angle-double-down" size={24} color="#63725A" />
            </View>
          );
        }}
        onLongPressAvatar={(user) => {
          //create a tooltip to show user name and photo
          Alert.alert(user.name);
        }}
        renderBubble={(props) => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: "#63725A",
                },

                left: {
                  backgroundColor: "#E5E8E3",
                },
              }}
              textStyle={{
                right: {
                  color: "#fff",
                  fontFamily: "Mulish-Regular",
                },
                left: {
                  color: "#000",
                  fontFamily: "Mulish-Regular",
                },
              }}
            />
          );
        }}
        // renderAccessory={() => {
        //   return (
        //     <View
        //       style={{
        //         flex: 1,
        //         justifyContent: "center",
        //         alignItems: "center",
        //         marginHorizontal: 10,
        //       }}
        //     >
        //       <FontAwesome name="smile-o" size={24} color="#63725A" />
        //     </View>
        //   );
        // }}
        // renderAvatar={(props) => {
        //   return (
        //     <Avatar
        //       {...props}
        //       imageStyle={{
        //         right: {
        //           backgroundColor: "#63725A",
        //         },
        //         left: {
        //           backgroundColor: "#E5E8E3",
        //         },
        //       }}
        //     />
        //   );
        // }}

        renderChatEmpty={() => {
          return (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginHorizontal: 10,
              }}
            >
              <FontAwesome name="comments-o" size={100} color="#63725A" />
            </View>
          );
        }}
        //render avatar for each message
        renderInputToolbar={(props) => {
          return (
            <InputToolbar
              {...props}
              containerStyle={{
                borderTopWidth: 0,
                borderRadius: 15,
                backgroundColor: "#E5E8E3",
                marginHorizontal: 10,
                marginBottom: 8,
                paddingTop: 5,
                paddingHorizontal: 4,
                elevation: 0,
              }}
            />
          );
        }}
        renderSend={(props) => {
          return (
            <Send
              {...props}
              alwaysShowSend={true}
              containerStyle={{
                justifyContent: "center",
                alignItems: "center",
                height: 40,
                marginHorizontal: 10,
                marginBottom: 5,
              }}
            >
              <View>
                <Ionicons name="md-send" size={22} color="#63725A" />
              </View>
            </Send>
          );
        }}
      />
    </KeyboardAvoidingView>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginBottom: 100,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "#fff",
    // paddingBottom: 100,
  },
});
