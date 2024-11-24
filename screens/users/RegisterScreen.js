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
import Input from "../../components/Input ";
import Button from "../../components/Button";
import supabase from "../../supabaseClient";

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const { data: user, error: supabaseError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (supabaseError) throw supabaseError;

      const userProfile = {
        id: user.user.id,
        email: user.user.email,
        username: username,
        created_at: new Date().toISOString(),
      };

      const { error: dbError } = await supabase
        .from("users")
        .insert([userProfile]);

      if (dbError) throw dbError;

      console.log("User registered and profile created successfully:", user);
    } catch (err) {
      console.error("Error:", err.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss()}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.innerContainer}>
            <Text style={styles.title}>Register for</Text>
            <Image
              source={require("../../assets/logo.png")}
              style={styles.logo}
            />
            <Input
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />
            <Input placeholder="Email" value={email} onChangeText={setEmail} />
            <Input
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <Button title="Register" onPress={handleRegister} />
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.registerText}>
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
  registerText: {
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
