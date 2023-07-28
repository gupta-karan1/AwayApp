import { Feather } from "@expo/vector-icons";
import ExploreStackGroup from "./ExploreStackGroup";
import TripsStackGroup from "./TripsStackGroup";
import ProfileStackGroup from "./ProfileStackGroup";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// This component is used to create the bottom tab navigation for the application.
const Tab = createBottomTabNavigator(); // The createBottomTabNavigator function is used to create the bottom tab navigation.

const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
        tabBarHideOnKeyboard: true, // hide tab bar when keyboard is open
        tabBarAllowFontScaling: true, // allow font scaling for tab bar
        headerShown: false, // hide header
        freezeOnBlur: true, // freeze tab bar when screen is not focused
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
              color={focused ? "tomato" : "gray"}
            />
          ),

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
              color={focused ? "tomato" : "gray"}
            />
          ),

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
              color={focused ? "tomato" : "gray"}
            />
          ),

          tabBarLabel: "Profile",
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;

// Overall this tabs component is used to create the bottom tab navigation for the application.
