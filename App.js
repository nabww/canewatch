import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import LoginScreen from "./screens/users/LoginScreen";
import RegisterScreen from "./screens/users/RegisterScreen";
import HomeScreen from "./screens/Home/HomeScreen";
import LandManagementScreen from "./screens/farms/LandManagementScreen";
import ReportsScreen from "./screens/Reports/ReportsScreen";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Drawer Navigator for the authenticated screens
const DrawerNavigator = () => (
  <Drawer.Navigator initialRouteName="Home">
    <Drawer.Screen
      name="Home"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <Drawer.Screen
      name="Land Management"
      component={LandManagementScreen}
      options={{ headerShown: false }}
    />
    <Drawer.Screen
      name="Reports"
      component={ReportsScreen}
      options={{ headerShown: false }}
    />
  </Drawer.Navigator>
);

// Main App Navigator
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen
          name="Drawer"
          component={DrawerNavigator}
          options={{ gestureEnabled: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
