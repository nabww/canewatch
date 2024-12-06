import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import supabase from "../../supabaseClient";

const FarmDetails = ({ route }) => {
  const { farmName, landId } = route.params; // Ensure `landId` is passed correctly
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { data, error } = await supabase
          .from("activities") // Replace with your actual table name
          .select("*")
          .eq("land_id", landId) // Fetch activities linked to the land ID
          .order("date", { ascending: false }); // Sort by most recent activity

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
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.activity_title}</Text>
      <Text style={styles.cardDate}>
        {new Date(item.date).toLocaleDateString()}
      </Text>
      <Text style={styles.cardTitle}>Activity: {item.type || "N/A"}</Text>
      <Text style={styles.cardCost}>Notes: {item.notes || "N/A"}</Text>

      <Text style={styles.cardCost}>
        Cost: {item.cost ? `KES ${item.cost}` : "N/A"}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{farmName} Activities</Text>
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
        <Text style={styles.noActivitiesText}>No activities available.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F9F9FB",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#5C2D91",
    marginBottom: 20,
    textAlign: "center",
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 10,
  },
  cardDate: {
    fontSize: 16,
    color: "#777777",
    marginBottom: 10,
  },
  cardNotes: {
    fontSize: 16,
    color: "#555555",
    marginBottom: 10,
  },
  cardCost: {
    fontSize: 16,
    // fontWeight: "bold",
    // color: "#5C2D91",
  },
  noActivitiesText: {
    fontSize: 18,
    color: "#777777",
    textAlign: "center",
    marginTop: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#5C2D91",
  },
});

export default FarmDetails;
