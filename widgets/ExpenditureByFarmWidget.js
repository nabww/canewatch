import React from "react";
import { View, Text } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { StyleSheet } from "react-native";

const screenWidth = Dimensions.get("window").width;

const ExpenditureByFarmWidget = () => {
  const { isDarkTheme } = useTheme();

  const data = {
    labels: ["Farm 1", "Farm 2"],
    datasets: [
      {
        data: [30000, 40000],
      },
    ],
  };

  const chartConfig = isDarkTheme ? darkChartConfig : lightChartConfig;

  return (
    <View>
      <Text style={isDarkTheme ? styles.darkText : styles.lightText}>
        Expenditure by Farm
      </Text>
      <ScrollView horizontal>
        <BarChart
          data={data}
          width={screenWidth * 2}
          height={220}
          chartConfig={chartConfig}
          fromZero
        />
      </ScrollView>
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
};

export default ExpenditureByFarmWidget;
