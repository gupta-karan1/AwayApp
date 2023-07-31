import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Plan from "./Plan";
import Chat from "./Chat";
import Find from "./Find";
import { View } from "react-native";
import { useRoute } from "@react-navigation/native";

import FindDestination from "./FindDestination";
import FindArticle from "./FindArticle";
import FindPlace from "./FindPlace";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Create Material Top Tab Navigator instance for Trip Screen
const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

// Functional componenet to render top navigation, passing tripLocation prop
function TripTopNav({ tripLocation }) {
  return (
    <View style={{ flex: 1 }}>
      {/* Create Material Top Tab Navigator with 3 screens */}
      <Tab.Navigator
        screenOptions={{
          // tabBarScrollEnabled: true,
          swipeEnabled: false,
        }}
      >
        <Tab.Screen name="Plan" component={Plan} />
        <Tab.Screen name="Chat" component={Chat} />
        <Tab.Screen
          name="FindStack"
          component={FindStack}
          // tripLocation prop as initial parameter
          initialParams={{ tripLocation }}
          options={{
            tabBarLabel: "Find",
            lazy: true,
          }}
        />
      </Tab.Navigator>
    </View>
  );
}

// stack navigator for Find screen and its components like FindDestination and FindArticle and FindPlace
function FindStack() {
  const route = useRoute();
  const { tripLocation } = route.params;
  return (
    <Stack.Navigator
      screenOptions={{
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="Find"
        component={Find}
        initialParams={{ tripLocation }}
        options={{
          headerShown: false,
          // headerSearchBarOptions: {
          //   headerTitle: "Find",
          //   headerTitleAlign: "center",
          // },
        }}
      />
      <Stack.Screen name="FindDestination" component={FindDestination} />
      <Stack.Screen
        name="FindArticle"
        component={FindArticle}
        options={{
          headerTitle: "Article",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="FindPlace"
        component={FindPlace}
        options={{
          headerTitle: "Place",
          headerTitleAlign: "center",
        }}
      />
    </Stack.Navigator>
  );
}

export default TripTopNav;

// SUMMARY: This code sets up the top tab navigator using React Navigation's createMaterialTopTabNavigator and defines three screens: Plan, Chat, and Find. The Find screen is passed the tripLocation prop as an initial parameter. This is so the Find screen can use the tripLocation prop to fetch the destination data from Firebase.
