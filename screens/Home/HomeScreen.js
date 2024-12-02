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

const HomeScreen = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivities();
  }, []);

  const fetchRecentActivities = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("activities")
        .select(
          `
          land_id, 
          type, 
          date, 
          status, 
          cost, 
          lands(landName)
        `
        )
        .order("date", { ascending: false })
        .limit(10);

      if (error) throw error;

      setActivities(data || []); // Ensure data is an array
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderActivityItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.activityType}>{item.type || "Unknown Activity"}</Text>
      <Text style={styles.date}>
        {item.date ? new Date(item.date).toDateString() : "No Date"}
      </Text>
      <Text>Land: {item.lands?.landName || "N/A"}</Text>
      <Text>Status: {item.status || "N/A"}</Text>
      {item.cost && <Text>Cost: KES {item.cost}</Text>}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#5C2D91" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>Recent Activities</Text> */}
      <FlatList
        data={activities}
        keyExtractor={(item, index) =>
          item.land_id?.toString() || index.toString()
        }
        renderItem={renderActivityItem}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchRecentActivities}
          />
        }
        contentContainerStyle={
          activities.length === 0 ? styles.emptyList : styles.list
        }
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>
            No recent activities to display.
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#5C2D91",
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyMessage: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
  },
  card: {
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    elevation: 3,
  },
  activityType: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#5C2D91",
  },
  date: {
    fontSize: 14,
    color: "#777",
    marginBottom: 8,
  },
});

export default HomeScreen;
