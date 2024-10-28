import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    // Handle registration logic here
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={styles.title}>Register for </Text>
        <Image
          source={require("./../../assets/logo.png.png")} // Update the path to your logo file
          style={styles.logo}
        />

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F9F9FB",
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    color: "#5C2D91",
    marginBottom: 20,
  },
  input: {
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
  },
  button: {
    backgroundColor: "#5C2D91",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginText: {
    textAlign: "center",
    color: "#6B3FA0",
    marginTop: 20,
  },
  logo: {
    width: 150, // Adjust the size to fit your needs
    height: 150,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 20,
  },
});

export default RegisterScreen;
