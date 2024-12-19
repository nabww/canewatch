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

const MainActivityScreen = () => {
  const [selectedFarm, setSelectedFarm] = useState("");
  const [activityType, setActivityType] = useState("");
  const [date, setDate] = useState("");
  const [cost, setCost] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSaveActivity = async () => {
    if (!selectedFarm || !activityType || !date || !cost) {
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

  const formData = [
    {
      key: "farmSelection",
      component: (
        <SearchableDropdown
          placeholder="Search to select a farm"
          onSelect={(id) => setSelectedFarm(id)}
        />
      ),
    },
    {
      key: "activityType",
      component: (
        <Input
          placeholder="Activity Type (e.g., Tilling)"
          value={activityType}
          onChangeText={setActivityType}
        />
      ),
    },
    {
      key: "date",
      component: (
        <View>
          <TouchableOpacity
            style={[styles.input, styles.dateButton]}
            onPress={() => setShowDatePicker(true)}>
            <Text style={{ fontSize: 16, color: date ? "#000" : "#aaa" }}>
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
      key: "cost",
      component: (
        <Input
          placeholder="Cost"
          keyboardType="numeric"
          value={cost}
          onChangeText={setCost}
        />
      ),
    },
    {
      key: "notes",
      component: (
        <TextInput
          placeholder="Notes (optional)"
          multiline
          style={[styles.notes, styles.input]}
          value={notes}
          onChangeText={setNotes}
        />
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
            {loading ? "Submitting..." : "Save Activity"}
          </Text>
        </TouchableOpacity>
      ),
    },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}>
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
    backgroundColor: "#F9F9FB",
  },
  input: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#dddddd",
  },
  notesInput: {
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
  notes: {
    height: 100,
    textAlignVertical: "top",
  },
});

export default MainActivityScreen;
