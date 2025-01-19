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

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          bounces={false}>
          <View style={styles.innerContainer}>
            <Text style={styles.title}>Register for CaneWatch</Text>
            <Image
              source={require("../../assets/logo.png")}
              style={styles.logo}
            />
            <Input placeholder="Email" value={email} onChangeText={setEmail} />
            <Input
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <Input
              placeholder="Confirm Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <Button title="Register" onPress={handleRegister} />
            <TouchableOpacity
              onPress={() => navigation.navigate("LoginScreen")}>
              <Text style={styles.loginText}>
                Already have an account? Login
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
    backgroundColor: "#F9F9FB",
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
    color: "#5C2D91",
    marginBottom: 20,
  },
  loginText: {
    textAlign: "center",
    color: "#6B3FA0",
    marginTop: 20,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 20,
  },
});

export default RegisterScreen;
