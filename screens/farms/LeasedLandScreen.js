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
import Button from "../../components/Button";
import { ScrollView } from "react-native-gesture-handler";

const LeasedLandsScreen = () => {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeasedLands();
  }, []);

  const fetchLeasedLands = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("lands")
        .select("*")
        .eq("type", "Leased");

      if (error) {
        throw error;
      }

      if (data.length === 0) {
        Alert.alert("No Data", "No leased lands found.");
      }

      setLands(data);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderLandItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.landName}>{item.landName}</Text>
      <Text>Location: {item.location}</Text>
      <Text>Size: {item.size} acres</Text>
      <Text>Lease Start: {item.lease_start || "N/A"}</Text>
      <Text>Lease End: {item.lease_end || "N/A"}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  const onRefresh = async () => {
    setLoading(true);
    await fetchLeasedLands();
    setLoading(false);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }>
      <FlatList
        data={lands}
        keyExtractor={(item) => item.id}
        renderItem={renderLandItem}
        contentContainerStyle={styles.list}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    elevation: 3,
  },
  landName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
});

export default LeasedLandsScreen;
