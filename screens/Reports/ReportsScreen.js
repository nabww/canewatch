import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { availableWidgets } from "../../widgets/widgets";
import supabase from "../../supabaseClient";
import { useTheme } from "../../context/ThemeContext";

const ReportsScreen = () => {
  const [userWidgets, setUserWidgets] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { isDarkTheme } = useTheme();

  const fetchUserWidgets = async () => {
    setRefreshing(true);
    const { data, error } = await supabase
      .from("user_widgets")
      .select("*")
      .eq("user_id", supabase.auth.user().id);

    if (error) {
      console.error("Error fetching user widgets:", error);
    } else {
      setUserWidgets(data || []);
    }
    setRefreshing(false);
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
      {userWidgets.map((widget) => {
        const WidgetComponent = availableWidgets.find(
          (w) => w.id === widget.widget_id
        ).component;
        return <WidgetComponent key={widget.widget_id} />;
      })}
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
});

export default ReportsScreen;
