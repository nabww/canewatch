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
import { useTheme } from "../../context/ThemeContext";

const HomeScreen = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDarkTheme } = useTheme();

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
        .limit(30);

      if (error) throw error;

      setActivities(data || []); // Ensure data is an array
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderActivityItem = ({ item }) => (
    <View
      style={[styles.card, isDarkTheme ? styles.darkCard : styles.lightCard]}>
      <Text
        style={[
          styles.activityType,
          isDarkTheme ? styles.darkText : styles.lightText,
        ]}>
        {item.type || "Unknown Activity"}
      </Text>
      <Text
        style={[styles.date, isDarkTheme ? styles.darkText : styles.lightText]}>
        {item.date ? new Date(item.date).toDateString() : "No Date"}
      </Text>
      <Text style={isDarkTheme ? styles.darkText : styles.lightText}>
        Land: {item.lands?.landName || "N/A"}
      </Text>
      <Text style={isDarkTheme ? styles.darkText : styles.lightText}>
        Status: {item.status || "N/A"}
      </Text>
      {item.cost && (
        <Text style={isDarkTheme ? styles.darkText : styles.lightText}>
          Cost: KES {item.cost}
        </Text>
      )}
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
    <View
      style={[
        styles.container,
        isDarkTheme ? styles.darkBackground : styles.lightBackground,
      ]}>
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
          <Text
            style={[
              styles.emptyMessage,
              isDarkTheme ? styles.darkText : styles.lightText,
            ]}>
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
    padding: 16,
  },
  darkBackground: {
    backgroundColor: "#000000",
  },
  lightBackground: {
    backgroundColor: "#f9f9f9",
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
    textAlign: "center",
  },
  darkText: {
    color: "#FFFFFF",
  },
  lightText: {
    color: "#000000",
  },
  card: {
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 3,
  },
  darkCard: {
    backgroundColor: "#333333",
  },
  lightCard: {
    backgroundColor: "#ffffff",
  },
  activityType: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    marginBottom: 8,
  },
});

export default HomeScreen;
