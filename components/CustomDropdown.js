// Dropdown.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Dropdown = ({ label, options, value, onSelect }) => {
  const [isSelected, setIsSelected] = useState();

  return (
    <View style={styles.dropdownContainer}>
      <Text style={styles.label}>{label}</Text>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[styles.option, value === option && styles.selectedOption]}
          onPress={() => onSelect(option)}>
          <Text
            style={[
              styles.optionText,
              { color: isSelected ? "#FFFFFF" : "#000000" },
            ]}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#4B5563",
  },
  option: {
    padding: 10,
    backgroundColor: "#F3F4F6",
    borderRadius: 5,
    marginVertical: 3,
  },
  selectedOption: {
    backgroundColor: "#5C2D91",
  },
  optionText: {
    color: "#FFFFFF",
  },
});

export default Dropdown;
