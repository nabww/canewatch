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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ModalDropdown from "react-native-modal-dropdown";
import Icon from "react-native-vector-icons/MaterialIcons";
import supabase from "../../supabaseClient";

const LandList = ({ type }) => {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

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
    if (index === "0") {
      // Handle update action
      navigation.navigate("RegisterScreen", { land });
    } else if (index === "1") {
      // Handle delete action
      Alert.alert(
        "Confirm Delete",
        "Are you sure you want to delete this land?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => deleteLand(land.id),
          },
        ]
      );
    }
  };

  const deleteLand = async (landId) => {
    try {
      const { error } = await supabase.from("lands").delete().eq("id", landId);
      if (error) throw error;
      fetchLands(); // Refresh the list after deleting
    } catch (error) {
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
      <View style={styles.card} key={item.id}>
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
            <Text style={styles.landName}>{item.landName}</Text>
            <Text>Location: {item.location}</Text>
            <Text>Size: {item.size} acres</Text>
            <Text>Lease Start: {item.lease_start || "N/A"}</Text>
            <Text>Lease End: {item.lease_end || "N/A"}</Text>
          </TouchableOpacity>
          <ModalDropdown
            options={["Update", "Delete"]}
            style={styles.optionsButton}
            textStyle={styles.optionsButtonText}
            dropdownStyle={styles.dropdownStyle}
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
      keyExtractor={(item) => item.id}
      renderItem={renderLandItem}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListEmptyComponent={
        <Text style={styles.emptyMessage}>No {type} lands found.</Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    padding: 16,
    marginVertical: 5,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    elevation: 3,
    margin: 6,
    position: "relative", // Ensure badge is positioned relative to the card
  },
  badgeContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1, // Ensure badge is above other content
  },
  badge: {
    backgroundColor: "#5C2D91",
    color: "#FFFFFF",
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
    color: "gray",
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
    backgroundColor: "#ffffff",
    borderColor: "#5C2D91",
    borderWidth: 1,
    borderRadius: 8,
    height: 80,
    fontSize: 12,
  },
});

export default LandList;
