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
  const [noOfUnits, setNoOfUnits] = useState("");
  const [unit, setUnit] = useState("bags"); // Default to 'bags'
  const [valueAtHarvest, setValueAtHarvest] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [landId, setLandId] = useState("");
  const [landName, setLandName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

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
      key: "units",
      component: (
        <View>
          <Text style={styles.label}>Number of Units at Harvest</Text>

          <Input
            style={styles.input}
            placeholder="Number of Units"
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
          <Text style={styles.label}>Unit of Harvest</Text>

          <SearchableDropdown
            options={["bags", "kilograms", "tons"]}
            onSelect={(index, value) => setUnit(value)}
            defaultIndex={0} // Default to 'bags'
            defaultValue="bags"
            placeholder="Unit of harvest e.g. bags, tonnes..."
            style={styles.dropdown}
          />
        </View>
      ),
    },
    {
      key: "value",
      component: (
        <View>
          <Text style={styles.label}>Value per Unit</Text>

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
          <Text style={styles.label}>Date of Harvest</Text>

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
  dropdown: {
    padding: 12,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dddddd",
    marginBottom: 16,
  },
});

export default HarvestScreen;
