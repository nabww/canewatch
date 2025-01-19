import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ModalDropdown from "react-native-modal-dropdown";
import Icon from "react-native-vector-icons/MaterialIcons";
import supabase from "../../supabaseClient";
import { useTheme } from "../../context/ThemeContext";

// LandList Component
const LandList = ({ type }) => {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const { isDarkTheme } = useTheme();

  const fetchLands = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("lands")
        .select("*")
        .eq("type", type);

      if (error) throw error;

      setLands(data || []);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchLands();
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLands();
  }, [type]);

  const goToFarmDetails = (farmName, landId) => {
    const routeName =
      type === "Owned" ? "OwnedFarmDetails" : "LeasedFarmDetails";
    navigation.navigate(routeName, { landId, farmName });
  };

  const handleOptionSelect = (index, land) => {
    console.log("handleOptionSelect called with index:", index);
    console.log("handleOptionSelect called with land:", land);
    if (parseInt(index) === 0) {
      // Handle update action
      const routeName = "UpdateLandScreen";
      console.log("Navigating to RegisterScreen with land:", land);
      navigation.navigate(routeName, { land });
    } else if (parseInt(index) === 1) {
      // Handle delete action
      console.log("Prompting delete confirmation for land:", land);
      Alert.alert(
        "Confirm Delete",
        "Are you sure you want to delete this land?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              console.log("Delete confirmed for land:", land);
              deleteLand(land.id);
            },
          },
        ]
      );
    }
  };

  const deleteLand = async (landId) => {
    console.log("Deleting land with ID: ", landId);
    try {
      const { error } = await supabase.from("lands").delete().eq("id", landId);
      if (error) throw error;
      console.log("Land deleted successfully.");
      fetchLands(); // Refresh the list after deleting
    } catch (error) {
      console.error("Error deleting land: ", error.message);
      Alert.alert("Error", error.message);
    }
  };

  const getRemainingDays = (leaseEndDate) => {
    const currentDate = new Date();
    const endDate = new Date(leaseEndDate);
    const timeDiff = endDate - currentDate;
    const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysRemaining;
  };

  const renderLandItem = ({ item }) => {
    const daysRemaining = getRemainingDays(item.lease_end);

    return (
      <View
        style={[styles.card, isDarkTheme ? styles.darkCard : styles.lightCard]}>
        {item.lease_end && (
          <View style={styles.badgeContainer}>
            <Text
              style={[
                styles.badge,
                daysRemaining <= 30 && styles.badgeWarning,
              ]}>
              {daysRemaining > 0 ? `${daysRemaining}d` : "Expired"}
            </Text>
          </View>
        )}
        <View style={styles.cardContent}>
          <TouchableOpacity
            onPress={() => goToFarmDetails(item.landName, item.id)}>
            <Text
              style={[
                styles.landName,
                isDarkTheme ? styles.darkText : styles.lightText,
              ]}>
              {item.landName}
            </Text>
            <Text style={isDarkTheme ? styles.darkText : styles.lightText}>
              Location: {item.location}
            </Text>
            <Text style={isDarkTheme ? styles.darkText : styles.lightText}>
              Size: {item.size} acres
            </Text>
            <Text style={isDarkTheme ? styles.darkText : styles.lightText}>
              Lease Start: {item.lease_start || "N/A"}
            </Text>
            <Text style={isDarkTheme ? styles.darkText : styles.lightText}>
              Lease End: {item.lease_end || "N/A"}
            </Text>
          </TouchableOpacity>
          <ModalDropdown
            options={["Update", "Delete"]}
            style={styles.optionsButton}
            textStyle={styles.optionsButtonText}
            dropdownStyle={[
              styles.dropdownStyle,
              isDarkTheme ? styles.darkDropdown : styles.lightDropdown,
            ]}
            onSelect={(index) => handleOptionSelect(index, item)}>
            <Icon name="more-vert" size={24} color="#5C2D91" />
          </ModalDropdown>
        </View>
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#5C2D91" />
      </View>
    );
  }

  return (
    <FlatList
      data={lands}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderLandItem}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListEmptyComponent={
        <Text
          style={[
            styles.emptyMessage,
            isDarkTheme ? styles.darkText : styles.lightText,
          ]}>
          No {type} lands found.
        </Text>
      }
    />
  );
};

const LeasedLands = () => <LandList type="Leased" />;
const OwnedLands = () => <LandList type="Owned" />;

// Main Component
const LeasedOwnedToggleScreen = () => {
  const [activeTab, setActiveTab] = useState("Leased");
  const { isDarkTheme } = useTheme();

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
    <View
      style={[
        styles.container,
        isDarkTheme ? styles.darkBackground : styles.lightBackground,
      ]}>
      <View
        style={[
          styles.tabBar,
          isDarkTheme ? styles.darkTabBar : styles.lightTabBar,
        ]}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "Leased" && styles.activeTab]}
          onPress={() => setActiveTab("Leased")}>
          <Text
            style={[
              styles.tabText,
              isDarkTheme ? styles.darkText : styles.lightText,
            ]}>
            Leased Lands
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "Owned" && styles.activeTab]}
          onPress={() => setActiveTab("Owned")}>
          <Text
            style={[
              styles.tabText,
              isDarkTheme ? styles.darkText : styles.lightText,
            ]}>
            Owned Lands
          </Text>
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
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
  },
  darkTabBar: {
    backgroundColor: "#333333",
  },
  lightTabBar: {
    backgroundColor: "#ffffff",
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
  },
  darkText: {
    color: "#ffffff",
  },
  lightText: {
    color: "#000000",
  },
  content: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    padding: 16,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 3,
    margin: 6,
    position: "relative",
  },
  darkCard: {
    backgroundColor: "#333333",
  },
  lightCard: {
    backgroundColor: "#ffffff",
  },
  badgeContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  badge: {
    backgroundColor: "#5C2D91",
    color: "#FFFFFF",
    borderRadius: 12,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  badgeWarning: {
    backgroundColor: "#FF0000",
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  landName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  emptyMessage: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  optionsButton: {
    alignItems: "center",
    padding: 5,
  },
  optionsButtonText: {
    display: "none",
  },
  dropdownStyle: {
    width: 100,
    borderColor: "#5C2D91",
    borderWidth: 1,
    borderRadius: 8,
    height: 80,
    fontSize: 12,
  },
  darkDropdown: {
    backgroundColor: "#333333",
    color: "#FFFFFF",
  },
  lightDropdown: {
    backgroundColor: "#ffffff",
    color: "#000000",
  },
  darkBackground: {
    backgroundColor: "#000000",
  },
  lightBackground: {
    backgroundColor: "#FFFFFF",
  },
});

export default LeasedOwnedToggleScreen;
