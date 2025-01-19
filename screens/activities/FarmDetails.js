import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import supabase from "../../supabaseClient";
import { useTheme } from "../../context/ThemeContext";

const FarmDetails = ({ route }) => {
  const { farmName, landId } = route.params;
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isDarkTheme } = useTheme();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { data, error } = await supabase
          .from("activities")
          .select("*")
          .eq("land_id", landId)
          .order("date", { ascending: false });

        if (error) {
          console.error("Error fetching activities:", error);
        } else {
          setActivities(data || []);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [landId]);

  const renderActivityCard = ({ item }) => (
    <View
      style={[styles.card, isDarkTheme ? styles.darkCard : styles.lightCard]}>
      <Text
        style={[
          styles.cardTitle,
          isDarkTheme ? styles.darkText : styles.lightText,
        ]}>
        {item.activity_title}
      </Text>
      <Text
        style={[
          styles.cardDate,
          isDarkTheme ? styles.darkText : styles.lightText,
        ]}>
        {new Date(item.date).toLocaleDateString()}
      </Text>
      <Text
        style={[
          styles.cardTitle,
          isDarkTheme ? styles.darkText : styles.lightText,
        ]}>
        Activity: {item.type || "N/A"}
      </Text>
      <Text
        style={[
          styles.cardNotes,
          isDarkTheme ? styles.darkText : styles.lightText,
        ]}>
        Notes: {item.notes || "N/A"}
      </Text>
      <Text
        style={[
          styles.cardCost,
          isDarkTheme ? styles.darkText : styles.lightText,
        ]}>
        Cost: {item.cost ? `KES ${item.cost}` : "N/A"}
      </Text>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        isDarkTheme ? styles.darkBackground : styles.lightBackground,
      ]}>
      <Text
        style={[
          styles.title,
          isDarkTheme ? styles.darkText : styles.lightText,
        ]}>
        {farmName}
      </Text>
      {loading ? (
        <ActivityIndicator size="large" color="#5C2D91" />
      ) : activities.length > 0 ? (
        <FlatList
          data={activities}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderActivityCard}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text
          style={[
            styles.noActivitiesText,
            isDarkTheme ? styles.darkText : styles.lightText,
          ]}>
          No activities available.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  darkCard: {
    backgroundColor: "#333333",
  },
  lightCard: {
    backgroundColor: "#ffffff",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardDate: {
    fontSize: 16,
    marginBottom: 10,
  },
  cardNotes: {
    fontSize: 16,
    marginBottom: 10,
  },
  cardCost: {
    fontSize: 16,
  },
  noActivitiesText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  darkText: {
    color: "#FFFFFF",
  },
  lightText: {
    color: "#000000",
  },
  darkBackground: {
    backgroundColor: "#000000",
  },
  lightBackground: {
    backgroundColor: "#F9F9FB",
  },
});

export default FarmDetails;
