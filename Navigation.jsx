import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import React, { useCallback } from "react";

//Components and Screens
import Explore from "./src/screens/tabScreens/Explore";
import Trips from "./src/screens/tabScreens/Trips";
import Profile from "./src/screens/tabScreens/Profile";
import DestinationScreen from "./src/screens/ExploreScreen/DestinationScreen";
import ArticleScreen from "./src/screens/ExploreScreen/ArticleScreen";
import PlaceScreen from "./src/screens/ExploreScreen/PlaceScreen";

const ExploreStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function ExploreStackGroup() {
  return (
    <ExploreStack.Navigator
      initialRouteName="Explore"
      screenOptions={{
        headerTitleAlign: "center",
        // headerTitleStyle: { fontFamily: "Mulish-Bold" },
      }}
    >
      <ExploreStack.Screen name="Explore" component={Explore} />
      <ExploreStack.Screen
        name="DestinationScreen"
        component={DestinationScreen}
        options={{
          title: "Destination",
        }}
      />
      <ExploreStack.Screen
        name="ArticleScreen"
        component={ArticleScreen}
        options={{
          title: "Article",
        }}
      />
      <ExploreStack.Screen
        name="PlaceScreen"
        component={PlaceScreen}
        options={{
          title: "Place",
        }}
      />
    </ExploreStack.Navigator>
  );
}

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
        // tabBarLabelStyle: { fontFamily: "Mulish-Medium" },
      }}
    >
      <Tab.Screen
        name={"ExploreStackGroup"}
        component={ExploreStackGroup}
        options={{
          tabBarIcon: ({ focused }) => (
            <Feather
              name={"globe"}
              size={25}
              color={focused ? "tomato" : "black"}
            />
          ),
          headerShown: false,
          tabBarLabel: "Explore",
        }}
      />
      <Tab.Screen
        name={"Trips"}
        component={Trips}
        options={{
          tabBarIcon: ({ focused }) => (
            <Feather
              name={"clipboard"}
              size={25}
              color={focused ? "tomato" : "black"}
            />
          ),
        }}
      />

      <Tab.Screen
        name={"Profile"}
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => (
            <Feather
              name={"user"}
              size={25}
              color={focused ? "tomato" : "black"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <Tabs />
    </NavigationContainer>
  );
}
