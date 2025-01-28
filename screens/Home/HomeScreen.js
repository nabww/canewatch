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
import { scheduleEventNotifications } from "../../notifications/notificationConfig";
import * as Notifications from "expo-notifications";

const HomeScreen = () => {
  const [activities, setActivities] = useState([]);
  const [todayActivities, setTodayActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDarkTheme } = useTheme();

  useEffect(() => {
    fetchUpcomingActivities();
  }, []);

  const requestNotificationPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission not granted",
        "Allow notifications to receive updates."
      );
    }
  };

  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  const fetchUpcomingActivities = async () => {
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
        .order("date", { ascending: true });

      if (error) throw error;

      console.log("Data from Supabase:", data); // Debugging: Log the data

      const upcomingActivities = data.filter((activity) => {
        if (!activity.date) return false; // Skip activities with missing dates
        const activityDate = new Date(activity.date);
        return activityDate >= new Date();
      });

      setActivities(upcomingActivities || []);

      // Filter activities for today
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison

      const todaysActivities = data.filter((activity) => {
        if (!activity.date) return false; // Skip activities with missing dates
        const activityDate = new Date(activity.date);
        activityDate.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison
        return activityDate.getTime() === today.getTime();
      });

      setTodayActivities(todaysActivities);

      // Schedule notifications for each upcoming activity
      upcomingActivities.forEach((activity) => {
        scheduleEventNotifications(activity);
      });
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
      <Text
        style={[
          styles.header,
          isDarkTheme ? styles.darkText : styles.lightText,
        ]}>
        Today's Activities
      </Text>
      <FlatList
        data={todayActivities}
        keyExtractor={(item, index) =>
          item.land_id?.toString() || index.toString()
        }
        renderItem={renderActivityItem}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchUpcomingActivities}
          />
        }
        contentContainerStyle={
          todayActivities.length === 0 ? styles.emptyList : styles.list
        }
        ListEmptyComponent={
          <Text
            style={[
              styles.emptyMessage,
              isDarkTheme ? styles.darkText : styles.lightText,
            ]}>
            No activities for today.
          </Text>
        }
      />
      <Text
        style={[
          styles.header,
          isDarkTheme ? styles.darkText : styles.lightText,
        ]}>
        Upcoming Activities
      </Text>
      <FlatList
        data={activities}
        keyExtractor={(item, index) =>
          item.land_id?.toString() || index.toString()
        }
        renderItem={renderActivityItem}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchUpcomingActivities}
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
            No upcoming activities to display.
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
