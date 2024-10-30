import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Menu, Provider, DefaultTheme, DarkTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import supabase from "../../supabaseClient";

const HomeScreen = ({ navigation }) => {
  const [visible, setVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleLogout = () => {
    Alert.alert("Hold on!", "Are you sure you want to logout?", [
      { text: "Cancel", onPress: () => null, style: "cancel" },
      {
        text: "YES",
        onPress: async () => {
          await supabase.auth.signOut();
          await AsyncStorage.removeItem("supabase_session");
          navigation.replace("Login");
        },
      },
    ]);
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert("Hold on!", "Are you sure you want to exit?", [
          { text: "Cancel", onPress: () => null, style: "cancel" },
          { text: "YES", onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [])
  );

  return (
    <Provider theme={isDarkMode ? DarkTheme : DefaultTheme}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Icon name="menu" size={25} color="#000" />
          </TouchableOpacity>
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <TouchableOpacity onPress={openMenu}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>UN</Text>
                </View>
              </TouchableOpacity>
            }>
            <Menu.Item onPress={handleLogout} title="Logout" />
            <Menu.Item onPress={toggleTheme} title="Toggle Dark Mode" />
          </Menu>
        </View>
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.bigButton}
            onPress={() => navigation.navigate("LandManagement")}>
            <Text style={styles.buttonText}>Land Management</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bigButton}
            onPress={() => navigation.navigate("Reports")}>
            <Text style={styles.buttonText}>Reports</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.footerText}>Home Screen</Text>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9FB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 30,
    paddingHorizontal: 10,
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: "#5C2D91",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bigButton: {
    width: 200,
    height: 60,
    marginBottom: 20,
    backgroundColor: "#5C2D91",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  footerText: {
    textAlign: "center",
    color: "#6B3FA0",
    marginBottom: 20,
  },
});

export default HomeScreen;
