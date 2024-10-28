import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  BackHandler,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Feather";

const HomeScreen = ({ navigation }) => {
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert("Hold on!", "Are you sure you want to exit?", [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel",
          },
          { text: "YES", onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="menu" size={25} color="#000" />
        </TouchableOpacity>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>UN</Text>
        </View>
      </View>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.bigButton}
          onPress={() => navigation.navigate("LandManagement")}>
          <Text style={styles.buttonText}>Land Management</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bigButton}
          onPress={() => navigation.navigate("Reports")}>
          <Text style={styles.buttonText}>Reports</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.footerText}>Home Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F9F9FB",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#5C2D91",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bigButton: {
    width: 200,
    height: 60,
    marginBottom: 20,
    backgroundColor: "#5C2D91",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  footerText: {
    textAlign: "center",
    color: "#6B3FA0",
    marginBottom: 20,
  },
});

HomeScreen.navigationOptions = {
  gestureEnabled: false, // Disables the swipe back gesture
};

export default HomeScreen;
