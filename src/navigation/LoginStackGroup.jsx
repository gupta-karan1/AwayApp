import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Auth/Login";
import Register from "../screens/Auth/Register";
import GlobalStyles from "../GlobalStyles";

const LoginStack = createNativeStackNavigator(); // The createNativeStackNavigator function is used to create a stack navigator for the login screens.

// The LoginStackGroup component is used to group the login screens together. It is used to navigate between the login screens.
const LoginStackGroup = () => {
  return (
    <LoginStack.Navigator
      initialRouteName="Login"
      // screenOptions={{
      //   animation: "slide_from_right",
      //   headerTitleAlign: "center",
      // }}
      screenOptions={{
        headerTitleAlign: "center",
        animation: "slide_from_right", // The animation prop is used to set the animation for the screen transitions in the stack navigator.
        headerTintColor: "#63725A",
        headerTitleStyle: GlobalStyles.titleLargeBold,
      }}
    >
      <LoginStack.Screen name="Login" component={Login} />
      <LoginStack.Screen
        name="Register"
        component={Register}
        options={{
          title: "Sign Up",
        }}
      />
    </LoginStack.Navigator>
  );
};

export default LoginStackGroup;

// SUMMARY: Overall, this component is used to group the login screens together. It is used to navigate between the login screens.
