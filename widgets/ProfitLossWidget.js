import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { StyleSheet } from "react-native";
import supabase from "../supabaseClient";

const screenWidth = Dimensions.get("window").width;

const ProfitLossWidget = () => {
  const { isDarkTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    labels: ["Expenditure", "Income"],
    datasets: [{ data: [0, 0] }],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();
        if (authError || !user) throw new Error("User not authenticated");

        const userId = user.id;

        // Fetch expenditure data from activities table
        const { data: expenditureData, error: expenditureError } =
          await supabase
            .from("activities")
            .select("cost")
            .eq("user_id", userId);

        if (expenditureError) throw expenditureError;

        const totalExpenditure = expenditureData.reduce(
          (sum, item) => sum + item.cost,
          0
        );

        // Fetch income data from harvests table
        const { data: incomeData, error: incomeError } = await supabase
          .from("harvests")
          .select("no_of_units, value_at_harvest")
          .eq("user_id", userId);

        if (incomeError) throw incomeError;

        const totalIncome = incomeData.reduce(
          (sum, item) => sum + item.no_of_units * item.value_at_harvest,
          0
        );

        setData({
          labels: ["Expenditure", "Income"],
          datasets: [{ data: [totalExpenditure, totalIncome] }],
        });
      } catch (error) {
        console.error("Error fetching profit and loss data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartConfig = isDarkTheme ? darkChartConfig : lightChartConfig;

  return (
    <View>
      <Text style={isDarkTheme ? styles.darkText : styles.lightText}>
        Profit & Loss Overview in KES
      </Text>
      {loading ? (
        <ActivityIndicator size="large" color="#5C2D91" />
      ) : (
        <ScrollView horizontal>
          <BarChart
            data={data}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            fromZero
            withInnerLines={false}
            showValuesOnTopOfBars
            flatColor
          />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  darkText: {
    color: "#FFFFFF",
  },
  lightText: {
    color: "#000000",
  },
});

const lightChartConfig = {
  backgroundColor: "#ffffff",
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(92, 45, 145, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(92, 45, 145, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForBackgroundLines: {
    strokeWidth: 0,
  },
  propsForHorizontalLabels: {
    rotation: 0,
  },
};

const darkChartConfig = {
  backgroundColor: "#333333",
  backgroundGradientFrom: "#333333",
  backgroundGradientTo: "#333333",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForBackgroundLines: {
    strokeWidth: 0,
  },
  propsForHorizontalLabels: {
    rotation: 0,
  },
};

export default ProfitLossWidget;
