import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";
import supabase from "../../supabaseClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../context/ThemeContext";

const ProfileScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const { isDarkTheme } = useTheme();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .single();
      if (data) {
        setName(data.name);
      }
      if (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .upsert({ id: 1, name });
      if (error) {
        Alert.alert("Error", "Failed to save profile.");
        console.error("Error saving profile:", error);
      } else {
        Alert.alert("Success", "Profile updated successfully.");
      }
    } catch (err) {
      Alert.alert("Error", "An unexpected error occurred.");
      console.error("Error:", err);
    }
  };

  return (
    <View
      style={[
        styles.container,
        isDarkTheme ? styles.darkBackground : styles.lightBackground,
      ]}>
      <Text
        style={[
          styles.label,
          isDarkTheme ? styles.darkText : styles.lightText,
        ]}>
        Name
      </Text>
      <TextInput
        style={[
          styles.input,
          isDarkTheme ? styles.darkInput : styles.lightInput,
        ]}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
      />
      <Button title="Save" onPress={handleSaveProfile} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  darkText: {
    color: "white",
  },
  lightText: {
    color: "black",
  },
  darkBackground: {
    backgroundColor: "black",
  },
  lightBackground: {
    backgroundColor: "white",
  },
  darkInput: {
    backgroundColor: "#333333",
    color: "#FFFFFF",
    borderColor: "#666666",
  },
  lightInput: {
    backgroundColor: "#FFFFFF",
    color: "#000000",
    borderColor: "#dddddd",
  },
});

export default ProfileScreen;
