import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TextInput,
  FlatList,
} from "react-native";
import supabase from "../../supabaseClient";
import SearchableDropdown from "../../components/SearchableDropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import Input from "../../components/Input ";
import { useTheme } from "../../context/ThemeContext";

const HarvestScreen = () => {
  const [noOfUnits, setNoOfUnits] = useState("");
  const [unit, setUnit] = useState("bags"); // Default to 'bags'
  const [valueAtHarvest, setValueAtHarvest] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [landId, setLandId] = useState("");
  const [landName, setLandName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { isDarkTheme } = useTheme();

  const handleSubmit = async () => {
    if (!noOfUnits || !valueAtHarvest || !date || !landId || !unit) {
      Alert.alert("Validation Error", "All fields except Notes are required.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const userId = data?.user?.id; // Correctly access the user ID
      if (!userId) throw new Error("User not authenticated");

      const { error } = await supabase.from("harvests").insert({
        no_of_units: parseFloat(noOfUnits),
        unit: unit,
        value_at_harvest: parseFloat(valueAtHarvest),
        date: date,
        notes: notes || null,
        land_id: landId,
        user_id: userId, // Use the correct user ID
      });

      if (error) throw error;

      Alert.alert("Success", "Harvest details recorded successfully.");
      setNoOfUnits("");
      setValueAtHarvest("");
      setDate("");
      setNotes("");
      setLandId("");
      setLandName("");
      setUnit("bags"); // Reset unit to default
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate.toISOString().split("T")[0]);
    }
  };

  const formData = [
    {
      key: "farmSelection",
      component: (
        <View>
          <Text
            style={[
              styles.label,
              isDarkTheme ? styles.darkText : styles.lightText,
            ]}>
            Select Farm
          </Text>

          <SearchableDropdown
            placeholder="Search to select a farm"
            placeholderTextColor={isDarkTheme ? "#CCCCCC" : "#AAAAAA"}
            onSelect={(id, name) => {
              setLandId(id);
              setLandName(name);
            }}
          />
        </View>
      ),
    },
    {
      key: "units",
      component: (
        <View>
          <Text
            style={[
              styles.label,
              isDarkTheme ? styles.darkText : styles.lightText,
            ]}>
            Number of Units at Harvest
          </Text>

          <Input
            style={[
              styles.input,
              isDarkTheme ? styles.darkInput : styles.lightInput,
            ]}
            placeholder="Number of Units"
            placeholderTextColor={isDarkTheme ? "#CCCCCC" : "#AAAAAA"}
            keyboardType="numeric"
            value={noOfUnits}
            onChangeText={setNoOfUnits}
          />
        </View>
      ),
    },
    {
      key: "unitSelection",
      component: (
        <View>
          <Text
            style={[
              styles.label,
              isDarkTheme ? styles.darkText : styles.lightText,
            ]}>
            Unit of Harvest
          </Text>

          <SearchableDropdown
            options={["bags", "kilograms", "tons"]}
            onSelect={(index, value) => setUnit(value)}
            defaultIndex={0} // Default to 'bags'
            defaultValue="bags"
            placeholder="Unit of harvest e.g. bags, tonnes..."
            placeholderTextColor={isDarkTheme ? "#CCCCCC" : "#AAAAAA"}
            style={[
              styles.dropdown,
              isDarkTheme ? styles.darkInput : styles.lightInput,
            ]}
          />
        </View>
      ),
    },
    {
      key: "value",
      component: (
        <View>
          <Text
            style={[
              styles.label,
              isDarkTheme ? styles.darkText : styles.lightText,
            ]}>
            Value per Unit
          </Text>

          <Input
            style={[
              styles.input,
              isDarkTheme ? styles.darkInput : styles.lightInput,
            ]}
            placeholder="Value at Harvest"
            placeholderTextColor={isDarkTheme ? "#CCCCCC" : "#AAAAAA"}
            keyboardType="numeric"
            value={valueAtHarvest}
            onChangeText={setValueAtHarvest}
          />
        </View>
      ),
    },
    {
      key: "date",
      component: (
        <View>
          <Text
            style={[
              styles.label,
              isDarkTheme ? styles.darkText : styles.lightText,
            ]}>
            Date of Harvest
          </Text>

          <TouchableOpacity
            style={[
              styles.input,
              { justifyContent: "center" },
              isDarkTheme ? styles.darkInput : styles.lightInput,
            ]}
            onPress={() => setShowDatePicker(true)}>
            <Text
              style={{
                fontSize: 16,
                color: date ? (isDarkTheme ? "#FFF" : "#000") : "#aaa",
              }}>
              {date || "Select Date"}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date ? new Date(date) : new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>
      ),
    },
    {
      key: "notes",
      component: (
        <View>
          <TextInput
            style={[
              styles.input,
              styles.notes,
              isDarkTheme ? styles.darkInput : styles.lightInput,
            ]}
            placeholder="Notes (optional)"
            placeholderTextColor={isDarkTheme ? "#CCCCCC" : "#AAAAAA"}
            multiline
            value={notes}
            onChangeText={setNotes}
          />
        </View>
      ),
    },
    {
      key: "submit",
      component: (
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? "Submitting..." : "Submit"}
          </Text>
        </TouchableOpacity>
      ),
    },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[
        styles.container,
        isDarkTheme ? styles.darkBackground : styles.lightBackground,
      ]}>
      <FlatList
        data={formData}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <View style={styles.item}>{item.component}</View>
        )}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkBackground: {
    backgroundColor: "#000000",
  },
  lightBackground: {
    backgroundColor: "#F9F9FB",
  },
  input: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  darkInput: {
    backgroundColor: "#333333",
    color: "#FFFFFF",
    borderColor: "#666666",
  },
  lightInput: {
    backgroundColor: "#ffffff",
    color: "#000000",
    borderColor: "#dddddd",
  },
  notes: {
    height: 100,
    textAlignVertical: "top",
  },
  item: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  button: {
    backgroundColor: "#5C2D91",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#999999",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  darkText: {
    color: "#FFFFFF",
  },
  lightText: {
    color: "#000000",
  },
  dropdown: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
});

export default HarvestScreen;
