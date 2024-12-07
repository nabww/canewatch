import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TextInput,
} from "react-native";
import supabase from "../../supabaseClient";
import Input from "../../components/Input ";
import SearchableDropdown from "../../components/SearchableDropdown";
import DateTimePicker from "@react-native-community/datetimepicker";

const HarvestScreen = () => {
  const [noOfBags, setNoOfBags] = useState("");
  const [valueAtHarvest, setValueAtHarvest] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [landId, setLandId] = useState("");
  const [landName, setLandName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = async () => {
    if (!noOfBags || !valueAtHarvest || !date || !landId) {
      Alert.alert("Validation Error", "All fields except Notes are required.");
      return;
    }

    setLoading(true);

    try {
      // Fetch the authenticated user
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { id: userId } = user;

      const { error } = await supabase.from("harvests").insert({
        no_of_bags: parseFloat(noOfBags),
        value_at_harvest: parseFloat(valueAtHarvest),
        date: date,
        notes: notes || null,
        land_id: landId,
        user_id: (await supabase.auth.getUser()).data.user?.id,
      });

      if (error) throw error;

      Alert.alert("Success", "Harvest details recorded successfully.");
      // Clear form fields after successful submission
      setNoOfBags("");
      setValueAtHarvest("");
      setDate("");
      setNotes("");
      setLandId("");
      setLandName("");
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SearchableDropdown
          placeholder="Search to select a farm"
          onSelect={(id, name) => {
            setLandId(id);
            setLandName(name);
          }}
        />

        <Input
          style={styles.input}
          placeholder="Number of Bags"
          keyboardType="numeric"
          value={noOfBags}
          onChangeText={setNoOfBags}
        />

        <Input
          style={styles.input}
          placeholder="Value at Harvest"
          keyboardType="numeric"
          value={valueAtHarvest}
          onChangeText={setValueAtHarvest}
        />

        <View>
          <TouchableOpacity
            style={[styles.input, { justifyContent: "center" }]}
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

        <TextInput
          style={[styles.input, styles.notes]}
          placeholder="Notes (optional)"
          multiline
          value={notes}
          onChangeText={setNotes}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? "Submitting..." : "Submit"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F9F9FB",
  },
  scrollContent: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 15,
    flexGrow: 1,
    justifyContent: "center",
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
  notes: {
    height: 100,
    textAlignVertical: "top",
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
});

export default HarvestScreen;
