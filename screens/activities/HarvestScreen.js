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
      const { data, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const userId = data?.user?.id; // Correctly access the user ID
      if (!userId) throw new Error("User not authenticated");

      const { error } = await supabase.from("harvests").insert({
        no_of_bags: parseFloat(noOfBags),
        value_at_harvest: parseFloat(valueAtHarvest),
        date: date,
        notes: notes || null,
        land_id: landId,
        user_id: userId, // Use the correct user ID
      });

      if (error) throw error;

      Alert.alert("Success", "Harvest details recorded successfully.");
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
      setDate(selectedDate.toISOString().split("T")[0]);
    }
  };

  const formData = [
    {
      key: "farmSelection",
      component: (
        <View>
          <Text style={styles.label}>Select Farm</Text>

          <SearchableDropdown
            placeholder="Search to select a farm"
            onSelect={(id, name) => {
              setLandId(id);
              setLandName(name);
            }}
          />
        </View>
      ),
    },
    {
      key: "bags",
      component: (
        <View>
          <Text style={styles.label}>Number of bags at harvest</Text>

          <Input
            style={styles.input}
            placeholder="Number of Bags"
            keyboardType="numeric"
            value={noOfBags}
            onChangeText={setNoOfBags}
          />
        </View>
      ),
    },
    {
      key: "value",
      component: (
        <View>
          <Text style={styles.label}>Estimated value at harvest</Text>

          <Input
            style={styles.input}
            placeholder="Value at Harvest"
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
          <Text style={styles.label}>Date of harvest</Text>

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
      ),
    },
    {
      key: "notes",
      component: (
        <View>
          <TextInput
            style={[styles.input, styles.notes]}
            placeholder="Notes (optional)"
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
    backgroundColor: "#F9F9FB",
    flex: 1,
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
});

export default HarvestScreen;
