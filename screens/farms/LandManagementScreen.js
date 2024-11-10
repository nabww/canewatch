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
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* <Text style={styles.title}>Land Management</Text> */}

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate("Register Land")}>
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9FB",
    alignItems: "center",
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    color: "#5C2D91",
    fontWeight: "bold",
    marginBottom: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  optionButton: {
    width: 350,
    height: 200,
    padding: 15,
    backgroundColor: "#5C2D91",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LandManagementScreen;
