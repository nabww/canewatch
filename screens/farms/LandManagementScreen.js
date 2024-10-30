import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Button from "../../components/Button";

const LandManagementScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Land Management</Text>
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => navigation.navigate("RegisterLand")}>
        <Text style={styles.buttonText}>Register Lands</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => alert("Leased Lands - Coming Soon!")}>
        <Text style={styles.buttonText}>Leased Lands</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => alert("Owned Lands - Coming Soon!")}>
        <Text style={styles.buttonText}>Owned Lands</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F9F9FB",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    color: "#5C2D91",
    fontWeight: "bold",
    marginBottom: 20,
  },
  optionButton: {
    width: "80%",
    padding: 15,
    backgroundColor: "#5C2D91",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LandManagementScreen;
