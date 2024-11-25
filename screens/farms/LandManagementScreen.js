import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const LandManagementScreen = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* <Text style={styles.title}>Land Management</Text> */}

      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => navigation.navigate("Register Land")}>
        <Text style={styles.buttonText}>Register Lands</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => navigation.navigate("Leased Land")}>
        <Text style={styles.buttonText}>Leased Lands</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => navigation.navigate("Owned Land")}>
        <Text style={styles.buttonText}>Owned Lands</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9FB",
    alignItems: "center",
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    color: "#5C2D91",
    fontWeight: "bold",
    marginBottom: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 10,
    margin: 10,
  },
  optionButton: {
    width: 320,
    height: 200,
    padding: 15,
    backgroundColor: "#5C2D91",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LandManagementScreen;
