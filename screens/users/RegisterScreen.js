import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import Input from "../../components/Input ";
import Button from "../../components/Button";
import Dropdown from "../../components/CustomDropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ScrollView } from "react-native-gesture-handler";

const RegisterLandsScreen = () => {
  const [landName, setLandName] = useState("");
  const [landSize, setLandSize] = useState("");
  const [location, setLocation] = useState("");
  const [leaseStatus, setLeaseStatus] = useState("");
  const [leaseStart, setLeaseStart] = useState("");
  const [leaseEnd, setLeaseEnd] = useState("");
  const [showLeaseStartPicker, setShowLeaseStartPicker] = useState(false);
  const [showLeaseEndPicker, setShowLeaseEndPicker] = useState(false);

  const handleRegisterLand = async () => {
    if (!landName || !location || !landSize || !leaseStatus) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    const { data: user, error: userError } = await supabase.auth.getUser();

    if (userError) {
      Alert.alert("Error", "User not authenticated.");
      return;
    }

    const landData = {
      name: landName,
      location: location,
      size: landSize,
      type: leaseStatus,
      user_id: user.id,
      lease_start: leaseStart || null,
      lease_end: leaseEnd || null,
    };

    const { data, error } = await supabase
      .from("lands")
      .insert([landData])
      .select();

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Success", "Land registered successfully!");
      setLandName("");
      setLocation("");
      setLandSize("");
      setLeaseStatus("");
      setLeaseEnd("");
      setLeaseStart("");
    }
  };

  const handleStartDateChange = (event, selectedDate) => {
    setShowLeaseStartPicker(false);
    if (selectedDate) setLeaseStart(selectedDate.toISOString().split("T")[0]);
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowLeaseEndPicker(false);
    if (selectedDate) setLeaseEnd(selectedDate.toISOString().split("T")[0]);
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={require("../../assets/logo.png")} style={styles.logo} />
      <Input
        placeholder="Land Name"
        value={landName}
        onChangeText={setLandName}
      />
      <Input
        placeholder="Land Size (in acres)"
        value={landSize}
        onChangeText={setLandSize}
      />
      <Input
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <Dropdown
        label="Lease Status"
        options={["Owned", "Leased"]}
        value={leaseStatus}
        onSelect={(value) => {
          setLeaseStatus(value);
          if (value !== "Leased") {
            setLeaseStart("");
            setLeaseEnd("");
          }
        }}
      />

      {leaseStatus === "Leased" && (
        <>
          <View style={styles.dateContainer}>
            <Text style={styles.label}>Lease Start Date:</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowLeaseStartPicker(true)}>
              <Text style={styles.dateButtonText}>
                {leaseStart || "Select Start Date"}
              </Text>
            </TouchableOpacity>
          </View>
          {showLeaseStartPicker && (
            <DateTimePicker
              value={leaseStart ? new Date(leaseStart) : new Date()}
              mode="date"
              display="default"
              onChange={handleStartDateChange}
            />
          )}

          <View style={styles.dateContainer}>
            <Text style={styles.label}>Lease End Date:</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowLeaseEndPicker(true)}>
              <Text style={styles.dateButtonText}>
                {leaseEnd || "Select End Date"}
              </Text>
            </TouchableOpacity>
          </View>
          {showLeaseEndPicker && (
            <DateTimePicker
              value={leaseEnd ? new Date(leaseEnd) : new Date()}
              mode="date"
              display="default"
              onChange={handleEndDateChange}
            />
          )}
        </>
      )}

      <Button title="Save" onPress={handleRegisterLand} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F9F9FB",
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 20,
  },
  dateContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#4B5563",
    marginBottom: 5,
  },
  dateButton: {
    backgroundColor: "#F3F4F6",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  dateButtonText: {
    color: "#333",
  },
});

export default RegisterLandsScreen;
