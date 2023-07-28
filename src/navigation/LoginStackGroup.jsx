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
        animation: "slide_from_right",
        presentation: "formSheet",
        headerTitleAlign: "center",
      }}
    >
      <LoginStack.Screen name="Login" component={Login} />
      <LoginStack.Screen name="Register" component={Register} />
    </LoginStack.Navigator>
  );
};

export default LoginStackGroup;

// SUMMARY: Overall, this component is used to group the login screens together. It is used to navigate between the login screens.
