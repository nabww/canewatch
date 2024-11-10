import React, { useState } from "react";
import { View, StyleSheet, Alert, Image } from "react-native";
import Input from "../../components/Input "
import Button from "../../components/Button";
import Dropdown from "../../components/CustomDropdown";
import DateTimePicker from "@react-native-community/datetimepicker";

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

    // Your existing Supabase registration logic...
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
    <View style={styles.container}>
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
          <Input
            placeholder="Lease Start Date"
            value={leaseStart}
            onFocus={() => setShowLeaseStartPicker(true)}
          />
          {showLeaseStartPicker && (
            <DateTimePicker
              value={leaseStart ? new Date(leaseStart) : new Date()}
              mode="date"
              display="default"
              onChange={handleStartDateChange}
            />
          )}

          <Input
            placeholder="Lease End Date"
            value={leaseEnd}
            onFocus={() => setShowLeaseEndPicker(true)}
          />
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
    </View>
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
});

export default RegisterLandsScreen;
