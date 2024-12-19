import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Menu } from "react-native-paper";
import Icon from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import supabase from "../supabaseClient";
// import { useTheme } from "../context/ThemeContext";
import { useColorScheme } from "react-native";

const CustomHeader = ({ title, navigation }) => {
  // const { theme, toggleTheme } = useTheme();
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const theme = useColorScheme();
  const [isDarkTheme, setIsDarkTheme] = useState(theme === "dark");

  const toggleTheme = () => {
    setIsDarkTheme((prevTheme) => !prevTheme);
  };

  // Use isDarkTheme to conditionally set the theme in your components

  const handleLogout = () => {
    Alert.alert("Hold on!", "Are you sure you want to logout?", [
      { text: "Cancel", onPress: () => null, style: "cancel" },
      {
        text: "YES",
        onPress: async () => {
          await supabase.auth.signOut();
          await AsyncStorage.removeItem("supabase_session");
          navigation.replace("LoginScreen");
        },
      },
    ]);
  };

  return (
    <View
      style={[
        styles.headerContainer,
        isDarkTheme
          ? { backgroundColor: "black" }
          : { backgroundColor: "white" },
      ]}>
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Icon
          name="menu"
          size={25}
          color={isDarkTheme ? { color: "white" } : { color: "black" }}
        />
      </TouchableOpacity>
      <Text
        style={[
          styles.title,
          isDarkTheme ? { color: "white" } : { color: "black" },
        ]}>
        {title}
      </Text>
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
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 39,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
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
});

export default CustomHeader;
