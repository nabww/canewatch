import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import supabase from "../../supabaseClient";

const ReportsScreen = () => {
  const [expenditure, setExpenditure] = useState(0);
  const [income, setIncome] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    setLoading(true);
    try {
      // Fetch total expenditure
      const { data: activityData, error: activityError } = await supabase
        .from("activities")
        .select("cost");
      if (activityError) throw activityError;

      const totalExpenditure = activityData.reduce(
        (total, item) => total + item.cost,
        0
      );
      setExpenditure(totalExpenditure);

      // Fetch total income
      const { data: harvestData, error: harvestError } = await supabase
        .from("harvests")
        .select("no_of_bags, value_at_harvest");
      if (harvestError) throw harvestError;

      const totalIncome = harvestData.reduce(
        (total, item) => total + item.number_of_bags * item.value_at_harvest,
        0
      );
      setIncome(totalIncome);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const netProfitOrLoss = income - expenditure;

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#5C2D91" />
      </View>
    );
  }

  return (
    <View
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={fetchFinancialData} />
      }>
      <Text style={styles.header}>Financial Dashboard</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Expenditure</Text>
        <Text style={styles.cardContent}>KES {expenditure.toFixed(2)}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Income</Text>
        <Text style={styles.cardContent}>KES {income.toFixed(2)}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Net Profit/Loss</Text>
        <Text style={styles.cardContent}>
          {netProfitOrLoss >= 0
            ? `KES${netProfitOrLoss.toFixed(2)}`
            : `-KES${Math.abs(netProfitOrLoss).toFixed(2)}`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F9F9FB",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    elevation: 3,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  cardContent: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#5C2D91",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ReportsScreen;
