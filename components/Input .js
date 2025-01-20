import React from "react";
import { TextInput, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

const Input = ({ placeholder, value, onChangeText, secureTextEntry }) => {
  const { isDarkTheme } = useTheme();

  return (
    <TextInput
      style={[styles.input, isDarkTheme ? styles.darkInput : styles.lightInput]}
      placeholder={placeholder}
      placeholderTextColor={isDarkTheme ? "#CCCCCC" : "#999999"}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  lightInput: {
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    color: "#000000",
  },
  darkInput: {
    borderColor: "#333333",
    backgroundColor: "#1E1E1E",
    color: "#FFFFFF",
  },
});

export default Input;
