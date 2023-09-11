import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DestinationScreen from "../screens/ExploreScreen/DestinationScreen";
import ArticleScreen from "../screens/ExploreScreen/ArticleScreen";
import PlaceScreen from "../screens/ExploreScreen/PlaceScreen";
import Explore from "../screens/tabScreens/Explore";
import SavePlaceModal from "../screens/ExploreScreen/SavePlaceModal";
import GlobalStyles from "../GlobalStyles";

const ExploreStack = createNativeStackNavigator(); // The createNativeStackNavigator function is used to create a stack navigator for the Explore tab.

// The ExploreStackGroup component is used to group the screens in the Explore tab together. It is used to display the screens in the Explore tab.
const ExploreStackGroup = () => {
  return (
    <ExploreStack.Navigator
      initialRouteName="Explore"
      screenOptions={{
        headerTitleAlign: "center",
        animation: "slide_from_right", // The animation prop is used to set the animation for the screen transitions in the stack navigator.
        headerTintColor: "#63725A",
        headerTitleStyle: GlobalStyles.titleLargeBold,
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
      {/* <ExploreStack.Screen
        name="SavePlaceModal"
        component={SavePlaceModal}
        options={{
          title: "Save Place",
          animation: "slide_from_bottom",
        }}
      /> */}
    </ExploreStack.Navigator>
  );
};

export default ExploreStackGroup;

// SUMMARY: Overall, this component is used to group the screens in the Explore tab together. It is used to display the screens in the Explore tab.
