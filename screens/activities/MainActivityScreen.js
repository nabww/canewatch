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
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import supabase from "../../supabaseClient";
import SearchableDropdown from "../../components/SearchableDropdown";
import Input from "../../components/Input ";
import { FlatList } from "react-native";
import { useTheme } from "../../context/ThemeContext";

const MainActivityScreen = () => {
  const [selectedFarm, setSelectedFarm] = useState("");
  const [activityType, setActivityType] = useState("");
  const [date, setDate] = useState("");
  const [cost, setCost] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { isDarkTheme } = useTheme();

  const handleSaveActivity = async () => {
    if (!selectedFarm || !activityType || !date) {
      Alert.alert("Validation Error", "All fields except Notes are required.");
      return;
    }

    setLoading(true);
    try {
      const { data, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const userId = data?.user?.id; // Correctly accessing the user ID
      if (!userId) throw new Error("User not authenticated");

      const activityData = {
        land_id: selectedFarm,
        type: activityType,
        date,
        cost: parseFloat(cost),
        notes: notes || null,
        user_id: userId,
      };

      const { error } = await supabase.from("activities").insert(activityData);
      if (error) throw error;

      Alert.alert("Success", "Activity recorded successfully.");
      setSelectedFarm("");
      setActivityType("");
      setDate("");
      setCost("");
      setNotes("");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate.toISOString().split("T")[0]); // Format to YYYY-MM-DD
    }
  };

  const isFutureDate = () => {
    if (!date) return false;
    const today = new Date();
    const selectedDate = new Date(date);
    return selectedDate > today;
  };

  const formData = [
    {
      key: "farmSelection",
      component: (
        <View>
          {" "}
          <Text
            style={[
              styles.label,
              isDarkTheme ? styles.darkText : styles.lightText,
            ]}>
            {" "}
            Select Farm{" "}
          </Text>{" "}
          <SearchableDropdown
            placeholder="Search to select a farm"
            onSelect={(id) => setSelectedFarm(id)}
            textInputStyle={isDarkTheme ? styles.darkInput : styles.lightInput}
            itemStyle={isDarkTheme ? styles.darkItem : styles.lightItem}
            itemTextStyle={
              isDarkTheme ? styles.darkItemText : styles.lightItemText
            }
            containerStyle={
              isDarkTheme ? styles.darkContainer : styles.lightContainer
            }
          />{" "}
        </View>
      ),
    },
    {
      key: "activityType",
      component: (
        <View>
          <Text
            style={[
              styles.label,
              isDarkTheme ? styles.darkText : styles.lightText,
            ]}>
            Select Activity
          </Text>
          <Input
            placeholder="Activity Type (e.g., Tilling)"
            value={activityType}
            onChangeText={setActivityType}
            style={styles.input}
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
            Activity Date
          </Text>
          <TouchableOpacity
            style={[
              styles.input,
              styles.dateButton,
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
              style={{ backgroundColor: "white" }}
            />
          )}
        </View>
      ),
    },
    {
      key: "cost",
      component: (
        <View>
          <Text
            style={[
              styles.label,
              isDarkTheme ? styles.darkText : styles.lightText,
            ]}>
            Cost of activity
          </Text>
          <Input
            placeholder="Cost"
            keyboardType="numeric"
            value={cost}
            onChangeText={setCost}
            style={styles.input}
          />
        </View>
      ),
    },
    {
      key: "notes",
      component: (
        <View>
          <Text style={[isDarkTheme ? styles.darkText : styles.lightText]}>
            Notes
          </Text>
          <TextInput
            placeholder="Notes (optional)"
            multiline
            style={[
              styles.notes,
              styles.input,
              isDarkTheme
                ? [styles.darkInput, styles.darkText]
                : [styles.lightInput, styles.lightText],
            ]}
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
          onPress={handleSaveActivity}
          disabled={loading}>
          <Text style={styles.buttonText}>
            {loading
              ? "Submitting..."
              : isFutureDate()
              ? "Schedule"
              : "Save Activity"}
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
  dateButton: {
    justifyContent: "center",
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
  item: {
    paddingHorizontal: 20,
    paddingVertical: 2,
  },
  notesInput: {
    height: 100,
    textAlignVertical: "top",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  darkText: {
    color: "#FFFFFF",
    fontSize: 10,
  },
  lightText: {
    color: "#000000",
    fontSize: 20,
  },
  darkBackground: {
    backgroundColor: "#000000",
  },
  lightBackground: {
    backgroundColor: "#F9F9FB",
  },
  lightItem: {
    padding: 10,
    marginTop: 2,
    backgroundColor: "#FFFFFF",
    borderColor: "#D1D5DB",
    borderWidth: 1,
  },
  darkItem: {
    padding: 10,
    marginTop: 2,
    backgroundColor: "#1E1E1E",
    borderColor: "#333333",
    borderWidth: 1,
  },
  lightItemText: { color: "#000000" },
  darkItemText: { color: "#FFFFFF" },
  lightContainer: { backgroundColor: "#FFFFFF" },
  darkContainer: { backgroundColor: "#1E1E1E" },
  lightInput: {
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    color: "#000000",
  },
  darkInput: {
    borderColor: "#333333",
    backgroundColor: "#1E1E1E",
    color: "#FFFFFF",
  },
  label: { fontSize: 16, marginBottom: 8 },
  lightText: { color: "#000000" },
  darkText: { color: "#FFFFFF" },
});

export default MainActivityScreen;
