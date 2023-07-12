import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Explore from "./src/screens/tabScreens/Explore"
import Trips from "./src/screens/tabScreens/Trips";
import Profile from "./src/screens/tabScreens/Profile";
import { Feather } from "@expo/vector-icons";
import DestinationScreen from "./src/screens/DestinationScreen";
import ArticleScreen from "./src/screens/ArticleScreen";
import PlaceScreen from "./src/screens/PlaceScreen";

const ExploreStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function ExploreStackGroup() {
  return (
    <ExploreStack.Navigator>
      <ExploreStack.Screen name="Explore" component={Explore} />
      <ExploreStack.Screen name="DestinationScreen" component={DestinationScreen} />
      <ExploreStack.Screen name="ArticleScreen" component={ArticleScreen} />
      <ExploreStack.Screen name="PlaceScreen" component={PlaceScreen} />
    </ExploreStack.Navigator>
  );
}

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
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
          tabBarLabel: 'Explore'
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
