import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import supabase from "../../supabaseClient";

const LandList = ({ type }) => {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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

  const renderLandItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.landName}>{item.landName}</Text>
      <Text>Location: {item.location}</Text>
      <Text>Size: {item.size} acres</Text>
      <Text>Lease Start: {item.lease_start || "N/A"}</Text>
      <Text>Lease End: {item.lease_end || "N/A"}</Text>
    </View>
  );

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
});

export default LandList;
