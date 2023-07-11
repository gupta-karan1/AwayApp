import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Explore from "../screens/tabScreens/Explore";
import Trips from "../../src/screens/tabScreens/Trips";
import Profile from "../../src/screens/tabScreens/Profile";
import { Feather } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tab.Screen
        name={"Explore"}
        component={Explore}
        options={{
          tabBarIcon: ({ focused }) => (
            <Feather
              name={"globe"}
              size={25}
              color={focused ? "tomato" : "black"}
            />
          ),
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
};

export default Tabs;
