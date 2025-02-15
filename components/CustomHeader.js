import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
} from "react-native";
import { Menu } from "react-native-paper";
import Icon from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import supabase from "../supabaseClient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";

const CustomHeader = ({ title, navigation }) => {
  const [visible, setVisible] = useState(false);
  const [initials, setInitials] = useState("");

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const { isDarkTheme, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data.user) {
        const email = data.user.email;
        const nameParts = email.split("@")[0].split(".");
        const userInitials = nameParts
          .map((part) => part[0].toUpperCase())
          .join("");
        setInitials(userInitials);
      }
      if (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
    StatusBar.setBackgroundColor(isDarkTheme ? "black" : "white");
  }, [isDarkTheme]);

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
    <SafeAreaView
      style={[
        styles.headerContainer,
        isDarkTheme ? styles.darkBackground : styles.lightBackground,
      ]}
      edges={["top", "left", "right"]}>
      <StatusBar barStyle={isDarkTheme ? "light-content" : "dark-content"} />
      <View style={styles.leftContainer}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="menu" size={25} color={isDarkTheme ? "white" : "black"} />
        </TouchableOpacity>
      </View>
      <Text
        style={[
          styles.title,
          isDarkTheme ? styles.darkText : styles.lightText,
        ]}>
        {title}
      </Text>
      <View style={styles.rightContainer}>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
          <Icon
            name={isDarkTheme ? "sun" : "moon"}
            size={24}
            color={isDarkTheme ? "#FFD700" : "#5C2D91"}
          />
        </TouchableOpacity>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity onPress={openMenu}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
            </TouchableOpacity>
          }>
          <Menu.Item onPress={handleLogout} title="Logout" />
          <Menu.Item
            onPress={() => navigation.navigate("ProfileScreen")}
            title="Profile"
          />
        </Menu>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  darkBackground: {
    backgroundColor: "black",
  },
  lightBackground: {
    backgroundColor: "white",
  },
  darkText: {
    color: "white",
  },
  lightText: {
    color: "black",
  },
  themeToggle: {
    marginRight: 15,
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
