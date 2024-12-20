import React, { useState } from "react";
import {
  Text,
  ScrollView,
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import supabase from "../../supabaseClient";
import Button from "../../components/Button";
import Input from "../../components/Input ";

const RegisterLandScreen = ({ navigation }) => {
  const [landName, setLandName] = useState("");
  const [location, setLocation] = useState("");
  const [landSize, setLandSize] = useState("");
  const [leaseStatus, setLeaseStatus] = useState(""); // initial state as empty string
  const [leaseStart, setLeaseStart] = useState(new Date());
  const [leaseEnd, setLeaseEnd] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleRegisterLand = async () => {
    try {
      if (!landName || !location || !landSize || !leaseStatus) {
        Alert.alert("Error", "Please fill in all fields.");
        return;
      }

      const { data, error: userError } = await supabase.auth.getUser();
      if (userError || !data || !data.user) {
        Alert.alert("Error", "User not authenticated.");
        return;
      }

      const landData = {
        landName: landName,
        location: location,
        size: landSize,
        type: leaseStatus,
        user_id: data.user.id,
        lease_start: leaseStatus === "Leased" ? leaseStart : null,
        lease_end: leaseStatus === "Leased" ? leaseEnd : null,
      };
      // console.log(landData);

      const { error } = await supabase.from("lands").insert(landData);

      if (error) {
        Alert.alert("Error", error.message);
        return;
      }

      Alert.alert("Success", "Land registered successfully!");
      setLandName("");
      setLocation("");
      setLandSize("");
      setLeaseStatus("");
      setLeaseStart(new Date());
      setLeaseEnd(new Date());
    } catch (error) {
      console.error("Unhandled error:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    }
  };

  const onChangeStart = (event, selectedDate) => {
    const currentDate = selectedDate || leaseStart;
    setShowStartPicker(false);
    setLeaseStart(currentDate);
    // if (selectedDate > leaseEnd) {
    //   Alert.alert(
    //     "Invalid Date",
    //     "Start date cannot be ahead of the end date."
    //   );
    // }
  };

  const onChangeEnd = (event, selectedDate) => {
    const currentDate = selectedDate || leaseEnd;
    setShowEndPicker(false);
    setLeaseEnd(currentDate);
    if (selectedDate < leaseStart) {
      Alert.alert("Invalid Date", "End date cannot be before the start date.");
      setLeaseEnd(leaseStart);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Land Name</Text>
      <Input
        style={styles.input}
        value={landName}
        onChangeText={setLandName}
        placeholder="Enter Land Name"
      />
      <Text style={styles.label}>Location</Text>
      <Input
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Enter Location"
      />
      <Text style={styles.label}>Land Size</Text>
      <Input
        style={styles.input}
        value={landSize}
        onChangeText={setLandSize}
        placeholder="Land Size in Hectares"
      />
      <Text style={styles.label}>Lease Status</Text>
      <View style={styles.leaseStatusContainer}>
        <TouchableOpacity
          style={[
            styles.leaseStatusButton,
            leaseStatus === "Owned" && styles.selectedButton,
          ]}
          onPress={() => setLeaseStatus("Owned")}>
          <Text
            style={[
              styles.leaseStatusText,
              leaseStatus === "Owned" && styles.selectedText,
            ]}>
            Owned
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.leaseStatusButton,
            leaseStatus === "Leased" && styles.selectedButton,
          ]}
          onPress={() => setLeaseStatus("Leased")}>
          <Text
            style={[
              styles.leaseStatusText,
              leaseStatus === "Leased" && styles.selectedText,
            ]}>
            Leased
          </Text>
        </TouchableOpacity>
      </View>
      {leaseStatus === "Leased" && (
        <>
          <Text style={styles.label}>Lease Start Date</Text>
          <TouchableOpacity onPress={() => setShowStartPicker(true)}>
            <Text style={styles.dateText}>{leaseStart.toDateString()}</Text>
          </TouchableOpacity>
          {showStartPicker && (
            <DateTimePicker
              value={leaseStart}
              mode="date"
              display="default"
              onChange={onChangeStart}
            />
          )}
          <Text style={styles.label}>Lease End Date</Text>
          <TouchableOpacity onPress={() => setShowEndPicker(true)}>
            <Text style={styles.dateText}>{leaseEnd.toDateString()}</Text>
          </TouchableOpacity>
          {showEndPicker && (
            <DateTimePicker
              value={leaseEnd}
              mode="date"
              display="default"
              onChange={onChangeEnd}
            />
          )}
        </>
      )}
      <Button title="Register Land" onPress={handleRegisterLand} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
  },
  leaseStatusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  leaseStatusButton: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
  },
  leaseStatusText: {
    fontSize: 16,
  },
  selectedButton: {
    backgroundColor: "#5C2D91",
  },
  selectedText: {
    color: "#fff",
  },
  dateText: {
    fontSize: 16,
    marginBottom: 16,
    color: "#5C2D91",
  },
});

export default RegisterLandScreen;
