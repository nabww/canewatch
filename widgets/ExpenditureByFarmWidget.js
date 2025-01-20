import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { StyleSheet } from "react-native";
import supabase from "../supabaseClient";

const screenWidth = Dimensions.get("window").width;

const ExpenditureByFarmWidget = () => {
  const { isDarkTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    labels: [],
    datasets: [{ data: [] }],
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

        // Fetch expenditure by farm data from activities table
        const { data: expenditureData, error: expenditureError } =
          await supabase
            .from("activities")
            .select("land_id, cost")
            .eq("user_id", userId);

        if (expenditureError) throw expenditureError;

        const farmExpenditure = expenditureData.reduce((acc, item) => {
          if (!acc[item.land_id]) {
            acc[item.land_id] = 0;
          }
          acc[item.land_id] += item.cost;
          return acc;
        }, {});

        // Fetch farm names to map land_id to farm name
        const { data: farmData, error: farmError } = await supabase
          .from("lands")
          .select("id, landName");

        if (farmError) throw farmError;

        const farmNames = farmData.reduce((acc, item) => {
          acc[item.id] = item.landName;
          return acc;
        }, {});

        const labels = Object.keys(farmExpenditure).map(
          (land_id) => farmNames[land_id] || land_id
        );
        const expenditureValues = Object.values(farmExpenditure);

        setData({
          labels,
          datasets: [{ data: expenditureValues }],
        });
      } catch (error) {
        console.error("Error fetching expenditure by farm data:", error);
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
        Expenditure by Farm in KES
      </Text>
      {loading ? (
        <ActivityIndicator size="large" color="#5C2D91" />
      ) : (
        <ScrollView horizontal>
          <BarChart
            data={data}
            width={screenWidth * 2}
            height={220}
            chartConfig={chartConfig}
            fromZero
            withInnerLines={false}
            showValuesOnTopOfBars
            flatColor
            verticalLabelRotation={0}
            yAxisLabel=""
            yAxisSuffix=""
            yLabelsOffset={20}
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
  yLabelsOffset: 20, // Increase offset for Y axis labels
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
  yLabelsOffset: 20, // Increase offset for Y axis labels
};

export default ExpenditureByFarmWidget;
