import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import LeasedLands from "./LeasedLand";
import OwnedLands from "./OwnedLand";

const LeasedOwnedToggleScreen = () => {
  const [activeTab, setActiveTab] = useState("Leased");

  const renderContent = () => {
    switch (activeTab) {
      case "Leased":
        return <LeasedLands />;
      case "Owned":
        return <OwnedLands />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "Leased" && styles.activeTab]}
          onPress={() => setActiveTab("Leased")}>
          <Text style={styles.tabText}>Leased Lands</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "Owned" && styles.activeTab]}
          onPress={() => setActiveTab("Owned")}>
          <Text style={styles.tabText}>Owned Lands</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>{renderContent()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
  },
  tabButton: {
    paddingVertical: 15,
    width: Dimensions.get("window").width / 2,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#5C2D91",
  },
  tabText: {
    fontSize: 16,
    color: "#5C2D91",
  },
  content: {
    flex: 1,
  },
});

export default LeasedOwnedToggleScreen;
