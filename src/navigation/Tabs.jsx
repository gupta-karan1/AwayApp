import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import ExploreStackGroup from "./ExploreStackGroup";
import TripsStackGroup from "./TripsStackGroup";
import ProfileStackGroup from "./ProfileStackGroup";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { Text, BottomNavigation } from "react-native-paper";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";
// import React from "react";
// import { CommonActions } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
        // tabBarLabelStyle: { fontFamily: "Mulish-Medium" },
        tabBarHideOnKeyboard: true,
        tabBarAllowFontScaling: true,
      }}
      // tabBar={({ navigation, state, descriptors, insets }) => (
      //   <BottomNavigation.Bar
      //     navigationState={state}
      //     safeAreaInsets={insets}
      //     onTabPress={({ route, preventDefault }) => {
      //       const event = navigation.emit({
      //         type: "tabPress",
      //         target: route.key,
      //         canPreventDefault: true,
      //       });

      //       if (event.defaultPrevented) {
      //         preventDefault();
      //       } else {
      //         navigation.dispatch({
      //           ...CommonActions.navigate(route.name, route.params),
      //           target: state.key,
      //         });
      //       }
      //     }}
      //     renderIcon={({ route, focused, color }) => {
      //       const { options } = descriptors[route.key];
      //       if (options.tabBarIcon) {
      //         return options.tabBarIcon({ focused, color, size: 24 });
      //       }

      //       return null;
      //     }}
      //     getLabelText={({ route }) => {
      //       const { options } = descriptors[route.key];
      //       const label =
      //         options.tabBarLabel !== undefined
      //           ? options.tabBarLabel
      //           : options.title !== undefined
      //           ? options.title
      //           : route.title;

      //       return label;
      //     }}
      //   />
      // )}
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
        name={"TripsStackGroup"}
        component={TripsStackGroup}
        options={{
          tabBarIcon: ({ focused }) => (
            <Feather
              name={"clipboard"}
              size={25}
              color={focused ? "tomato" : "black"}
            />
          ),
          headerShown: false,
          tabBarLabel: "Trips",
        }}
      />

      <Tab.Screen
        name={"ProfileStackGroup"}
        component={ProfileStackGroup}
        options={{
          tabBarIcon: ({ focused }) => (
            <Feather
              name={"user"}
              size={25}
              color={focused ? "tomato" : "black"}
            />
          ),
          headerShown: false,
          tabBarLabel: "Profile",
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;
