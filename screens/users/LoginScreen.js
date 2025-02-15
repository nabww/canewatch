import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Input from "../../components/Input ";
import Button from "../../components/Button";
import supabase from "../../supabaseClient";
import { useTheme } from "../../context/ThemeContext";
import Icon from "react-native-vector-icons/Feather";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isDarkTheme, toggleTheme } = useTheme();

  const handleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      if (data.session) {
        await AsyncStorage.setItem(
          "supabase_session",
          JSON.stringify(data.session)
        );
        navigation.replace("MainDrawer");
      } else {
        console.warn("No session returned from Supabase.");
      }
    } catch (err) {
      console.error("Login error:", err.message);
      alert("An unexpected error occurred.");
    }
  };

  useEffect(() => {
    StatusBar.setBackgroundColor(isDarkTheme ? "black" : "white");
  }, [isDarkTheme]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        style={[
          styles.container,
          isDarkTheme ? styles.darkBackground : styles.lightBackground,
        ]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}>
        <StatusBar barStyle={isDarkTheme ? "light-content" : "dark-content"} />
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          bounces={false}>
          <View style={styles.innerContainer}>
            <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
              <Icon
                name={isDarkTheme ? "sun" : "moon"}
                size={24}
                color={isDarkTheme ? "#FFD700" : "#5C2D91"}
              />
            </TouchableOpacity>
            {/* <Text
              style={[
                styles.title,
                isDarkTheme ? styles.darkText : styles.lightText,
              ]}>
              Login to FarmHand
            </Text> */}
            <Image
              source={require("../../assets/logo2.png")}
              style={styles.logo}
            />
            <Input
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={isDarkTheme ? styles.darkInput : styles.lightInput}
            />
            <Input
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={isDarkTheme ? styles.darkInput : styles.lightInput}
            />
            <Button title="Sign In" onPress={handleLogin} />
            <TouchableOpacity
              onPress={() => navigation.navigate("RegisterScreen")}>
              <Text
                style={[
                  styles.registerText,
                  isDarkTheme ? styles.darkText : styles.lightText,
                ]}>
                Don’t have an account? Sign up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  innerContainer: {
    justifyContent: "center",
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  registerText: {
    textAlign: "center",
    marginTop: 20,
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 30,
  },
  themeToggle: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
  },
  lightBackground: {
    backgroundColor: "#F9F9FB",
  },
  darkBackground: {
    backgroundColor: "#000000",
  },
  lightText: {
    color: "#5C2D91",
  },
  darkText: {
    color: "#FFFFFF",
  },
  lightInput: {
    backgroundColor: "#FFFFFF",
    color: "#000000",
  },
  darkInput: {
    backgroundColor: "#333333",
    color: "#FFFFFF",
  },
});

export default LoginScreen;
