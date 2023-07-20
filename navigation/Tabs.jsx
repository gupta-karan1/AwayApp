import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import ExploreStackGroup from "./ExploreStackGroup";
import TripsStackGroup from "./TripsStackGroup";
import ProfileStackGroup from "./ProfileStackGroup";

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
