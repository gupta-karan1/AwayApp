import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Auth/Login";
import Register from "../screens/Auth/Register";
import ExploreStackGroup from "./ExploreStackGroup";
import TripsStackGroup from "./TripsStackGroup";
import ProfileStackGroup from "./ProfileStackGroup";

const LoginStack = createNativeStackNavigator(); // The createNativeStackNavigator function is used to create a stack navigator for the login screens.

// The LoginStackGroup component is used to group the login screens together. It is used to navigate between the login screens.
const LoginStackGroup = () => {
  return (
    <LoginStack.Navigator
      initialRouteName="Login"
      screenOptions={{
        animation: "slide_from_right", // This option is used to set the animation for the screens in the stack navigator. It is set to slide_from_right to ensure that the screens slide in from the right when they are displayed.
        presentation: "formSheet", // This option is used to set the presentation style of the screens in the stack navigator. It is set to formSheet to ensure that the screens are presented as modal screens.
        headerTitleAlign: "center", // This option is used to set the alignment of the header title. It is set to center to ensure that the header title is centered.
      }}
    >
      <LoginStack.Screen name="Login" component={Login} />
      <LoginStack.Screen name="Register" component={Register} />
    </LoginStack.Navigator>
  );
};

export default LoginStackGroup;
