import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import { availableWidgets } from "../../widgets/widgets";
import { useNavigation } from "@react-navigation/native";
import supabase from "../../supabaseClient";
import { useTheme } from "../../context/ThemeContext";

const CustomizeDashboardScreen = () => {
  const [selectedWidgets, setSelectedWidgets] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { isDarkTheme } = useTheme();

  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        // Fetch user ID from Supabase's auth module
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();
        if (authError || !user) {
          console.error("Error fetching user:", authError);
          throw new Error("User not authenticated");
        }

        const userId = user.id;

        // Fetch user preferences from Supabase
        const { data, error } = await supabase
          .from("user_widgets")
          .select("widget_id")
          .eq("user_id", userId);

        if (error) {
          console.error("Error fetching user preferences:", error);
          return;
        }

        setSelectedWidgets(data.map((item) => item.widget_id));
      } catch (error) {
        console.error("Error fetching user preferences:", error.message);
      }
    };

    fetchUserPreferences();
  }, []);

  const toggleWidgetSelection = (widgetId) => {
    setSelectedWidgets((prevState) =>
      prevState.includes(widgetId)
        ? prevState.filter((id) => id !== widgetId)
        : [...prevState, widgetId]
    );
  };

  const savePreferences = async () => {
    try {
      // Fetch user ID from Supabase's auth module
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        console.error("Error fetching user:", authError);
        throw new Error("User not authenticated");
      }

      const userId = user.id;

      setLoading(true);

      // Clear existing preferences
      const { error: deleteError } = await supabase
        .from("user_widgets")
        .delete()
        .eq("user_id", userId);
      if (deleteError) {
        console.error("Error deleting preferences:", deleteError);
        throw new Error("Failed to clear existing preferences.");
      }

      // Insert new preferences in a batch
      const preferences = selectedWidgets.map((widgetId, index) => ({
        user_id: userId,
        widget_id: widgetId,
        position: index,
      }));
      const { error: insertError } = await supabase
        .from("user_widgets")
        .insert(preferences);
      if (insertError) {
        console.error("Error inserting preferences:", insertError);
        throw new Error("Failed to save new preferences.");
      }

      Alert.alert("Success", "Preferences saved successfully!");
      navigation.navigate("ReportsScreen");
    } catch (error) {
      console.error("Error saving preferences:", error);
      Alert.alert(
        "Error",
        error.message || "An error occurred while saving preferences."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        isDarkTheme ? styles.darkBackground : styles.lightBackground,
      ]}>
      <Text style={[styles.title]}>
        This is a list of available widgets. Please select the ones you'd
        like...
      </Text>
      <FlatList
        data={availableWidgets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.widgetButton,
              selectedWidgets.includes(item.id)
                ? isDarkTheme
                  ? styles.selectedDarkWidgetButton
                  : styles.selectedLightWidgetButton
                : isDarkTheme
                ? styles.unselectedDarkWidgetButton
                : styles.unselectedLightWidgetButton,
            ]}
            onPress={() => toggleWidgetSelection(item.id)}>
            <Text
              style={[
                styles.widgetText,
                selectedWidgets.includes(item.id)
                  ? styles.selectedText
                  : isDarkTheme
                  ? styles.unselectedDarkText
                  : styles.unselectedLightText,
              ]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={styles.saveButton}
        onPress={savePreferences}
        disabled={loading}>
        <Text
          style={[
            styles.saveButtonText,
            isDarkTheme ? styles.darkTextButton : styles.lightTextButton,
          ]}>
          {loading ? "Saving..." : "Save Preferences"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 12,
    marginBottom: 16,
    color: "#5C2D91",
  },
  widgetButton: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  selectedLightWidgetButton: {
    backgroundColor: "#5C2D91",
    color: "#FFFFFF",
  },
  selectedDarkWidgetButton: {
    backgroundColor: "#5C2D91",
    color: "#FFFFFF",
  },
  unselectedLightWidgetButton: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D1D5DB",
    borderWidth: 1,
  },
  unselectedDarkWidgetButton: {
    backgroundColor: "#333333",
    borderColor: "#4F4F4F",
    borderWidth: 1,
  },
  widgetText: {
    fontSize: 16,
  },
  selectedText: {
    color: "#FFFFFF",
  },
  unselectedLightText: {
    color: "#000000",
  },
  unselectedDarkText: {
    color: "#FFFFFF",
  },
  saveButton: {
    padding: 16,
    backgroundColor: "#5C2D91",
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  darkBackground: {
    backgroundColor: "#000000",
  },
  lightBackground: {
    backgroundColor: "#ffffff",
  },
  darkTextButton: {
    color: "#ffffff",
  },
  lightTextButton: {
    color: "#ffffff",
  },
});

export default CustomizeDashboardScreen;
