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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import supabase from "../../supabaseClient";

const MainActivityScreen = () => {
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState("");
  const [activityType, setActivityType] = useState("");
  const [date, setDate] = useState(new Date());
  const [cost, setCost] = useState("");
  const [notes, setNotes] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    const { data, error } = await supabase
      .from("lands")
      .select("id, landName")
      .eq("user_id", (await supabase.auth.getUser()).data.user?.id);

    if (error) {
      Alert.alert("Error", "Failed to fetch farms.");
    } else {
      setFarms(data || []);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFarms();
    setRefreshing(false);
  };

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
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.pickerWrapper}>
        <Text style={styles.selectedFarmText}>
          {selectedFarm
            ? `Selected Farm: ${
                farms.find((farm) => farm.id === selectedFarm)?.landName
              }`
            : "Select a farm"}
        </Text>
        <Picker
          selectedValue={selectedFarm}
          onValueChange={(itemValue) => setSelectedFarm(itemValue)}
          style={styles.picker}>
          <Picker.Item label="Select a farm" value="" />
          {farms.map((farm) => (
            <Picker.Item key={farm.id} label={farm.landName} value={farm.id} />
          ))}
        </Picker>
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
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveActivity}>
        <Text style={styles.saveButtonText}>Save Activity</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 20,
  },
  pickerWrapper: {
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  selectedFarmText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#5C2D91",
    marginBottom: 10,
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
