import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../src/screens/tabScreens/Profile";
import Login from "../src/screens/Auth/Login";
import Register from "../src/screens/Auth/Register";

const ProfileStack = createNativeStackNavigator();
const ProfileStackGroup = () => {
  return (
    <ProfileStack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        headerTitleAlign: "center",
      }}
    >
      <ProfileStack.Screen name="Profile" component={Profile} />
      <ProfileStack.Screen name="Login" component={Login} />
      <ProfileStack.Screen name="Register" component={Register} />
    </ProfileStack.Navigator>
  );
};

export default ProfileStackGroup;
