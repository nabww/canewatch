import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { ThemeProvider } from "./context/ThemeContext";
import LoginScreen from "./screens/users/LoginScreen";
import RegisterScreen from "./screens/users/RegisterScreen";
import HomeScreen from "./screens/Home/HomeScreen";
import LandManagementScreen from "./screens/farms/LandManagementScreen";
import ReportsScreen from "./screens/Reports/ReportsScreen";
import RegisterLandsScreen from "./screens/farms/RegisterLandScreen";
import LeasedLandsScreen from "./screens/farms/LeasedLandScreen";
import OwnedLandScreen from "./screens/farms/OwnedLandScreen";
import CustomHeader from "./components/CustomHeader";
import { PaperProvider } from "react-native-paper";
import { Keyboard, TouchableWithoutFeedback } from "react-native";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const DismissKeyboardWrapper = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const HomeStack = ({ navigation }) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{
        header: () => <CustomHeader title="Home" navigation={navigation} />,
      }}
    />
  </Stack.Navigator>
);

const LandManagementStack = ({ navigation }) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Land Management"
      component={LandManagementScreen}
      options={{
        header: () => (
          <CustomHeader title="Land Management" navigation={navigation} />
        ),
      }}
    />
  </Stack.Navigator>
);

const ReportsStack = ({ navigation }) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Reports"
      component={ReportsScreen}
      options={{
        header: () => <CustomHeader title="Reports" navigation={navigation} />,
      }}
    />
  </Stack.Navigator>
);

const RegisterLandStack = ({ navigation }) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Register Land"
      component={RegisterLandsScreen}
      options={{
        header: () => (
          <CustomHeader title="Register Land" navigation={navigation} />
        ),
      }}
    />
  </Stack.Navigator>
);

const LeasedLandsStack = ({ navigation }) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Leased Lands"
      component={LeasedLandsScreen}
      options={{
        header: () => (
          <CustomHeader title="Leased Lands" navigation={navigation} />
        ),
      }}
    />
  </Stack.Navigator>
);

const OwnedLandsStack = ({ navigation }) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Owned Lands"
      component={OwnedLandScreen}
      options={{
        header: () => (
          <CustomHeader title="Owned Lands" navigation={navigation} />
        ),
      }}
    />
  </Stack.Navigator>
);

const DrawerNavigator = () => (
  <Drawer.Navigator initialRouteName="Home">
    <Drawer.Screen
      name="Home"
      component={HomeStack}
      options={{ headerShown: false }}
    />
    <Drawer.Screen
      name="Land Management"
      component={LandManagementStack}
      options={{ headerShown: false }}
    />
    <Drawer.Screen
      name="Reports"
      component={ReportsStack}
      options={{ headerShown: false }}
    />
    <Drawer.Screen
      name="Register Land"
      component={RegisterLandStack}
      options={{ headerShown: false }}
    />
    <Drawer.Screen
      name="Leased Lands"
      component={LeasedLandsStack}
      options={{ headerShown: false }}
    />
    <Drawer.Screen
      name="Owned Lands"
      component={OwnedLandsStack}
      options={{ headerShown: false }}
    />
  </Drawer.Navigator>
);

export default function App() {
  return (
    <PaperProvider>
      <ThemeProvider>
        <DismissKeyboardWrapper>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Drawer"
                component={DrawerNavigator}
                options={{ headerShown: false, gestureEnabled: false }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </DismissKeyboardWrapper>
      </ThemeProvider>
    </PaperProvider>
  );
}
