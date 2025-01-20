import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Text,
  TouchableOpacity,
} from "react-native";
import { availableWidgets } from "../../widgets/widgets";
import supabase from "../../supabaseClient";
import { useTheme } from "../../context/ThemeContext";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";

const ReportsScreen = () => {
  const [userWidgets, setUserWidgets] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { isDarkTheme } = useTheme();
  const navigation = useNavigation();

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

  const goToSettings = () => {
    navigation.navigate("CustomizeDashBoardScreen");
  };

  return (
    <View
      style={[
        styles.container,
        isDarkTheme ? styles.darkBackground : styles.lightBackground,
      ]}>
      <TouchableOpacity style={styles.settingsIcon} onPress={goToSettings}>
        <Icon
          name="settings"
          size={20}
          color={isDarkTheme ? "#FFFFFF" : "#000000"}
        />
      </TouchableOpacity>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isDarkTheme ? styles.darkBackground : styles.lightBackground,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchUserWidgets}
          />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  scrollContent: {
    flexGrow: 1,
    marginTop: 15,
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
  settingsIcon: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
    marginBottom: 20,
  },
});

export default ReportsScreen;
