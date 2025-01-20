import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import LoginScreen from "./screens/users/LoginScreen";
import RegisterScreen from "./screens/users/RegisterScreen";
import HomeScreen from "./screens/Home/HomeScreen";
import ReportsScreen from "./screens/Reports/ReportsScreen";
import RegisterLandScreen from "./screens/farms/RegisterLandScreen"; // Updated import
import LeasedOwnedToggleScreen from "./screens/farms/LeasedOwnedToggleScreen";
import CustomHeader from "./components/CustomHeader";
import { PaperProvider } from "react-native-paper";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import MainActivityScreen from "./screens/activities/MainActivityScreen";
import FarmDetails from "./screens/activities/FarmDetails";
import HarvestScreen from "./screens/activities/HarvestScreen";
import CustomizeDashboardScreen from "./screens/Reports/CustomizeDashBoardScreen";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const DismissKeyboardWrapper = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

// Home Stack
const HomeStack = ({ navigation }) => (
  <Stack.Navigator>
    <Stack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{
        header: () => (
          <CustomHeader title="Upcoming Activities" navigation={navigation} />
        ),
      }}
    />
  </Stack.Navigator>
);

// Register Land Stack
const RegisterLandStack = ({ navigation }) => (
  <Stack.Navigator>
    <Stack.Screen
      name="RegisterLandScreen"
      component={RegisterLandScreen} // Ensure correct component name
      options={{
        header: () => (
          <CustomHeader title="Register Land" navigation={navigation} />
        ),
      }}
    />
  </Stack.Navigator>
);

// Lands Stack
const LandsStack = ({ navigation }) => (
  <Stack.Navigator>
    <Stack.Screen
      name="LeasedOwnedToggleScreen"
      component={LeasedOwnedToggleScreen}
      options={{
        header: () => <CustomHeader title="Lands" navigation={navigation} />,
      }}
    />
    <Stack.Screen
      name="LeasedFarmDetails"
      component={FarmDetails}
      options={{
        header: () => <CustomHeader title="Details" navigation={navigation} />,
      }}
    />
    <Stack.Screen
      name="OwnedFarmDetails"
      component={FarmDetails}
      options={{
        header: () => (
          <CustomHeader title="All Activities" navigation={navigation} />
        ),
      }}
    />
    <Stack.Screen
      name="UpdateLandScreen" // Adding RegisterScreen here for navigation
      component={RegisterLandScreen}
      options={{
        header: () => (
          <CustomHeader title="Update Land" navigation={navigation} />
        ),
      }}
    />
  </Stack.Navigator>
);

// Activities Stack
const ActivityStack = ({ navigation }) => (
  <Stack.Navigator>
    <Stack.Screen
      name="MainActivityScreen"
      component={MainActivityScreen}
      options={{
        header: () => (
          <CustomHeader title="Farm Activities" navigation={navigation} />
        ),
      }}
    />
  </Stack.Navigator>
);

// Reports Stack
const ReportsStack = ({ navigation }) => (
  <Stack.Navigator>
    <Stack.Screen
      name="ReportsScreen"
      component={ReportsScreen}
      options={{
        header: () => (
          <CustomHeader title="Farm Reports" navigation={navigation} />
        ),
      }}
    />
    <Stack.Screen
      name="CustomizeDashBoardScreen"
      component={CustomizeDashboardScreen}
      options={{
        header: () => (
          <CustomHeader
            title="Customize Report Dashboard"
            navigation={navigation}
          />
        ),
      }}
    />
  </Stack.Navigator>
);

const HarvestStack = ({ navigation }) => (
  <Stack.Navigator>
    <Stack.Screen
      name="HarvestScreen"
      component={HarvestScreen}
      options={{
        header: () => (
          <CustomHeader title="Record Harvest" navigation={navigation} />
        ),
      }}
    />
  </Stack.Navigator>
);

// const CustomizeReportStack = ({ navigation }) => (
//   <Stack.Navigator>
//     <Stack.Screen
//       name="CustomizeDashBoardScreen"
//       component={CustomizeDashboardScreen}
//       options={{
//         header: () => (
//           <CustomHeader title="Customize Report Dashboard" navigation={navigation} />
//         ),
//       }}
//     />
//   </Stack.Navigator>
// );

const DrawerNavigator = () => {
  const { currentTheme } = useTheme();

  return (
    <Drawer.Navigator
      initialRouteName="DrawerHome"
      screenOptions={{
        drawerStyle: { backgroundColor: currentTheme.background },
        drawerActiveTintColor: currentTheme.text,
        drawerInactiveTintColor: currentTheme.text,
        drawerItemStyle: { marginVertical: 5 },
      }}>
      <Drawer.Screen
        name="DrawerHome"
        component={HomeStack}
        options={{ headerShown: false, title: "Home" }}
      />
      <Drawer.Screen
        name="DrawerRegisterLand"
        component={RegisterLandStack}
        options={{ headerShown: false, title: "Register Land" }}
      />
      <Drawer.Screen
        name="DrawerLands"
        component={LandsStack}
        options={{ headerShown: false, title: "View Lands" }}
      />
      <Drawer.Screen
        name="DrawerActivities"
        component={ActivityStack}
        options={{ headerShown: false, title: "Record Activity" }}
      />
      <Drawer.Screen
        name="DrawerHarvests"
        component={HarvestStack}
        options={{ headerShown: false, title: "Record Harvest" }}
      />
      <Drawer.Screen
        name="DrawerReports"
        component={ReportsStack}
        options={{ headerShown: false, title: "View Reports" }}
      />
      {/* <Drawer.Screen
        name="Customize Reports"
        component={CustomizeReportStack}
        options={{ headerShown: false, title: "Customize Reports" }}
      /> */}
    </Drawer.Navigator>
  );
};

// App Entry Point
export default function App() {
  return (
    <PaperProvider>
      <ThemeProvider>
        <DismissKeyboardWrapper>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="LoginScreen">
              <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="RegisterScreen"
                component={RegisterScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="MainDrawer"
                component={DrawerNavigator}
                options={{ headerShown: false, gestureEnabled: false }}
              />
              <Stack.Screen
                name="CustomizeDashboard"
                component={CustomizeDashboardScreen}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </DismissKeyboardWrapper>
      </ThemeProvider>
    </PaperProvider>
  );
}
