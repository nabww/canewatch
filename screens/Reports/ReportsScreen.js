import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  RefreshControl,
} from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import supabase from "../../supabaseClient";

const screenWidth = Dimensions.get("window").width;

const ReportsScreen = () => {
  const [expenditureByFarm, setExpenditureByFarm] = useState([]);
  const [expenditureByActivity, setExpenditureByActivity] = useState([]);
  const [generalReport, setGeneralReport] = useState({
    expenditure: 0,
    income: 0,
  });
  const [farmNames, setFarmNames] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReportsData();
  }, []);

  const fetchReportsData = async () => {
    setLoading(true);
    try {
      console.log("Fetching farm names...");
      // Fetch farm names
      const { data: landsData, error: landsError } = await supabase
        .from("lands")
        .select("id, landName");
      if (landsError) throw landsError;

      const farmNamesMap = landsData.reduce((acc, item) => {
        acc[item.id] = item.landName;
        return acc;
      }, {});
      setFarmNames(farmNamesMap);

      console.log("Fetching expenditure by farm...");
      // Fetch expenditure by farm
      const { data: expenditureFarmData, error: expenditureFarmError } =
        await supabase.from("activities").select("land_id, cost");
      if (expenditureFarmError) throw expenditureFarmError;

      console.log("Expenditure by farm data: ", expenditureFarmData);
      const expenditureByFarm = expenditureFarmData.reduce((acc, item) => {
        const landName = farmNamesMap[item.land_id] || item.land_id;
        acc[landName] = (acc[landName] || 0) + item.cost;
        return acc;
      }, {});
      setExpenditureByFarm(Object.entries(expenditureByFarm));

      console.log("Fetching expenditure by activity...");
      // Fetch expenditure by activity
      const { data: expenditureActivityData, error: expenditureActivityError } =
        await supabase.from("activities").select("type, cost");
      if (expenditureActivityError) throw expenditureActivityError;

      console.log("Expenditure by activity data: ", expenditureActivityData);
      const expenditureByActivity = expenditureActivityData.reduce(
        (acc, item) => {
          acc[item.type] = (acc[item.type] || 0) + item.cost;
          return acc;
        },
        {}
      );
      setExpenditureByActivity(Object.entries(expenditureByActivity));

      console.log("Fetching general report...");
      // Fetch general report
      const { data: activityData, error: activityError } = await supabase
        .from("activities")
        .select("cost");
      if (activityError) throw activityError;

      console.log("General activity data: ", activityData);
      const totalExpenditure = activityData.reduce(
        (total, item) => total + item.cost,
        0
      );

      const { data: harvestData, error: harvestError } = await supabase
        .from("harvests")
        .select("no_of_bags, value_at_harvest");
      if (harvestError) throw harvestError;

      console.log("General harvest data: ", harvestData);
      const totalIncome = harvestData.reduce(
        (total, item) => total + item.no_of_bags * item.value_at_harvest,
        0
      );

      setGeneralReport({ expenditure: totalExpenditure, income: totalIncome });
    } catch (error) {
      console.error("Error fetching data: ", error.message);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const netProfitOrLoss = generalReport.income - generalReport.expenditure;

  const generateGraphData = (data) => ({
    labels: data.map((item) => item[0]),
    datasets: [
      {
        data: data.map((item) => item[1]),
      },
    ],
  });

  const generateProfitLossData = () => ({
    labels: ["Expenditure", "Income"],
    datasets: [
      {
        data: [generalReport.expenditure, generalReport.income],
      },
    ],
  });

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#5C2D91" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={fetchReportsData} />
      }>
      {/* <Text style={styles.header}>Financial Dashboard</Text> */}
      <Text style={styles.chartTitle}>Profit & Loss Overview</Text>
      <BarChart
        data={generateProfitLossData()}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        fromZero
      />
      <Text style={styles.chartTitle}>Expenditure by Farm</Text>
      <BarChart
        data={generateGraphData(expenditureByFarm)}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        verticalLabelRotation={30}
      />
      <Text style={styles.chartTitle}>Expenditure by Activity</Text>
      <BarChart
        data={generateGraphData(expenditureByActivity)}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        verticalLabelRotation={30}
      />
      {/* <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Expenditure</Text>
        <Text style={styles.cardContent}>
          KES {generalReport.expenditure.toFixed(2)}
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Income</Text>
        <Text style={styles.cardContent}>
          KES {generalReport.income.toFixed(2)}
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Net Profit/Loss</Text>
        <Text style={styles.cardContent}>
          {netProfitOrLoss >= 0
            ? `KES ${netProfitOrLoss.toFixed(2)}`
            : `-KES ${Math.abs(netProfitOrLoss.toFixed(2))}`}
        </Text>
      </View> */}
    </ScrollView>
  );
};

const chartConfig = {
  backgroundColor: "#ffffff",
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(92, 45, 145, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(92, 45, 145, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: "#5C2D91",
  },
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#F9F9FB",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
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
