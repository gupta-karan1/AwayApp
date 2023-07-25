import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Auth/Login";
import Register from "../screens/Auth/Register";
import ExploreStackGroup from "./ExploreStackGroup";
import TripsStackGroup from "./TripsStackGroup";
import ProfileStackGroup from "./ProfileStackGroup";

const LoginStack = createNativeStackNavigator();

const LoginStackGroup = () => {
  return (
    <LoginStack.Navigator initialRouteName="Login">
      <LoginStack.Screen name="Login" component={Login} />
      <LoginStack.Screen name="Register" component={Register} />
      <LoginStack.Screen
        name="ExploreStackGroup"
        component={ExploreStackGroup}
      />
      <LoginStack.Screen name="TripsStackGroup" component={TripsStackGroup} />
      <LoginStack.Screen
        name="ProfileStackGroup"
        component={ProfileStackGroup}
      />
    </LoginStack.Navigator>
  );
};

export default LoginStackGroup;
