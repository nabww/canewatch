import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import supabase from "../../supabaseClient";
import SearchableDropdown from "../../components/SearchableDropdown"; // Assuming this is the path to the SearchableDropdown component.

const MainActivityScreen = () => {
  const [selectedFarm, setSelectedFarm] = useState("");
  const [activityType, setActivityType] = useState("");
  const [date, setDate] = useState(new Date());
  const [cost, setCost] = useState("");
  const [notes, setNotes] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleSaveActivity = async () => {
    if (!selectedFarm || !activityType || !date || !cost) {
      alert("Please fill in all required fields.");
      return;
    }

    const activityData = {
      land_id: selectedFarm,
      type: activityType,
      date: date.toISOString().split("T")[0],
      cost: parseFloat(cost),
      notes,
      user_id: (await supabase.auth.getUser()).data.user?.id,
    };

    const { error } = await supabase.from("activities").insert(activityData);

    if (error) {
      alert("Error saving activity: " + error.message);
    } else {
      alert("Activity recorded successfully!");
      setSelectedFarm("");
      setActivityType("");
      setDate(new Date());
      setCost("");
      setNotes("");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => setRefreshing(false)} // Replace this with a refresh function if needed.
          />
        }>
        <View style={styles.searchableDropdownWrapper}>
          <SearchableDropdown
            placeholder="Search to select a farm"
            onSelect={(id, landName) => setSelectedFarm(id)}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Activity Type (e.g., Tilling)"
          value={activityType}
          onChangeText={setActivityType}
        />
        <View style={styles.datePickerContainer}>
          <Text style={styles.dateLabel}>Date of Activity:</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.dateTouchable}>
            <Text style={styles.dateText}>
              {date.toISOString().split("T")[0]}
            </Text>
          </TouchableOpacity>
        </View>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Cost"
          keyboardType="numeric"
          value={cost}
          onChangeText={setCost}
        />
        <TextInput
          style={[styles.input, styles.notes]}
          placeholder="Notes (optional)"
          multiline
          value={notes}
          onChangeText={setNotes}
        />
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveActivity}>
          <Text style={styles.saveButtonText}>Save Activity</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 20,
  },
  searchableDropdownWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#5C2D91",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  notes: {
    height: 100,
    textAlignVertical: "top",
  },
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  dateLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  dateTouchable: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  dateText: {
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#5C2D91",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MainActivityScreen;
