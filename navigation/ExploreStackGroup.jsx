import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DestinationScreen from "../src/screens/ExploreScreen/DestinationScreen";
import ArticleScreen from "../src/screens/ExploreScreen/ArticleScreen";
import PlaceScreen from "../src/screens/ExploreScreen/PlaceScreen";
import Explore from "../src/screens/tabScreens/Explore";

const ExploreStack = createNativeStackNavigator();

const ExploreStackGroup = () => {
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
};

export default ExploreStackGroup;
