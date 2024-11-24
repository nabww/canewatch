import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Input from "../../components/Input ";
import Button from "../../components/Button";
import Dropdown from "../../components/CustomDropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import supabase from "../../supabaseClient";

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
    try {
      console.log("Starting land registration...");

      if (!landName || !location || !landSize || !leaseStatus) {
        Alert.alert("Error", "Please fill in all fields.");
        return;
      }

      console.log("All required fields are filled.");

      const { data, error: userError } = await supabase.auth.getUser();
      if (userError || !data || !data.user) {
        console.error("User error:", userError);
        Alert.alert("Error", "User not authenticated.");
        return;
      }

      console.log("User authenticated:", data.user);

      const landData = {
        landName: landName,
        location: location,
        size: landSize,
        type: leaseStatus,
        user_id: data.user.id,
        lease_start: leaseStart || null,
        lease_end: leaseEnd || null,
      };

      console.log("Prepared land data:", landData);

      // Insert data into the lands table
      const { error } = await supabase.from("lands").insert(landData);

      if (error) {
        console.error("Insert error:", error);
        Alert.alert("Error", error.message);
        return;
      }

      console.log("Land registered successfully.");

      Alert.alert("Success", "Land registered successfully!");
      setLandName("");
      setLocation("");
      setLandSize("");
      setLeaseStatus("");
      setLeaseEnd("");
      setLeaseStart("");
    } catch (error) {
      console.error("Unhandled error:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
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
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        styles={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logo}
          />
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

          <Button title="Save" onPress={() => handleRegisterLand} />
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 20,
  },
  keyboardContainer: {
    flex: 1,
    backgroundColor: "#F9F9FB",
  },
});

export default RegisterLandsScreen;
