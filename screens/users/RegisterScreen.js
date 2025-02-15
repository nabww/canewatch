import React, { useState } from "react";
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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Input from "../../components/Input ";
import Button from "../../components/Button";
import supabase from "../../supabaseClient";
import { useTheme } from "../../context/ThemeContext";
import Icon from "react-native-vector-icons/Feather";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { isDarkTheme, toggleTheme } = useTheme();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      if (data.user) {
        alert(
          "Registration successful! Please check your email for verification."
        );
        navigation.navigate("Login");
      } else {
        console.warn("No user data returned from Supabase.");
      }
    } catch (err) {
      console.error("Registration error:", err.message);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        style={[
          styles.container,
          isDarkTheme ? styles.darkBackground : styles.lightBackground,
        ]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}>
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
              Register for CaneWatch
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
            <Input
              placeholder="Confirm Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={isDarkTheme ? styles.darkInput : styles.lightInput}
            />
            <Button title="Register" onPress={handleRegister} />
            <TouchableOpacity
              onPress={() => navigation.navigate("LoginScreen")}>
              <Text
                style={[
                  styles.loginText,
                  isDarkTheme ? styles.darkText : styles.lightText,
                ]}>
                Already have an account? Sign In
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
  loginText: {
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

export default RegisterScreen;
