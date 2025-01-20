import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Text,
} from "react-native";
import { availableWidgets } from "../../widgets/widgets";
import supabase from "../../supabaseClient";
import { useTheme } from "../../context/ThemeContext";

const ReportsScreen = () => {
  const [userWidgets, setUserWidgets] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { isDarkTheme } = useTheme();

  const fetchUserWidgets = async () => {
    setRefreshing(true);
    try {
      // Fetch user ID from Supabase's auth module
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error("User not authenticated");
      }
      const userId = user.id;

      // Fetch user widgets
      const { data, error } = await supabase
        .from("user_widgets")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching user widgets:", error);
      } else {
        console.log("Fetched user widgets:", data);
        setUserWidgets(data || []);
      }
    } catch (error) {
      console.error("Unexpected error fetching user widgets:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserWidgets();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        isDarkTheme ? styles.darkBackground : styles.lightBackground,
      ]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchUserWidgets} />
      }>
      {userWidgets.length > 0 ? (
        userWidgets.map((widget) => {
          const WidgetComponent = availableWidgets.find(
            (w) => w.id === widget.widget_id
          )?.component;
          if (!WidgetComponent) {
            console.error("Widget not found:", widget.widget_id);
            return null;
          }
          return <WidgetComponent key={widget.widget_id} />;
        })
      ) : (
        <Text style={isDarkTheme ? styles.darkText : styles.lightText}>
          No widgets selected.
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  darkBackground: {
    backgroundColor: "#000000",
  },
  lightBackground: {
    backgroundColor: "#F9F9FB",
  },
  darkText: {
    color: "#FFFFFF",
  },
  lightText: {
    color: "#000000",
  },
});

export default ReportsScreen;
