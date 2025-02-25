import React, { useState, useEffect } from "react";
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
import { useTheme } from "../../context/ThemeContext";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

const RegisterLandScreen = ({ navigation, route }) => {
  const [landName, setLandName] = useState("");
  const [location, setLocation] = useState("");
  const [landSize, setLandSize] = useState("");
  const [leaseStatus, setLeaseStatus] = useState("");
  const [leaseStart, setLeaseStart] = useState(new Date());
  const [leaseEnd, setLeaseEnd] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [mapRegion, setMapRegion] = useState(null);
  const [marker, setMarker] = useState(null);

  const { isDarkTheme } = useTheme();

  useEffect(() => {
    if (route.params && route.params.land) {
      const { land } = route.params;
      setLandName(land.landName);
      setLocation(land.location);
      setLandSize(land.size);
      setLeaseStatus(land.type);
      setLeaseStart(land.lease_start ? new Date(land.lease_start) : new Date());
      setLeaseEnd(land.lease_end ? new Date(land.lease_end) : new Date());
      setIsUpdate(true);
    }
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, [route.params]);

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setMarker(coordinate);
    setLocation(`${coordinate.latitude}, ${coordinate.longitude}`);
  };

  const handleSaveLand = async () => {
    if (!landName || !location || !landSize || !leaseStatus) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
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

      let error;
      if (isUpdate) {
        const { error: updateError } = await supabase
          .from("lands")
          .update(landData)
          .eq("id", route.params.land.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from("lands")
          .insert(landData);
        error = insertError;
      }

      if (error) {
        Alert.alert("Error", error.message);
        return;
      }

      Alert.alert(
        "Success",
        `Land ${isUpdate ? "updated" : "registered"} successfully!`
      );
      navigation.goBack();
    } catch (error) {
      console.error("Unhandled error:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onChangeStart = (event, selectedDate) => {
    const currentDate = selectedDate || leaseStart;
    setShowStartPicker(false);
    setLeaseStart(currentDate);
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
    <ScrollView
      contentContainerStyle={[
        styles.container,
        isDarkTheme ? styles.darkBackground : styles.lightBackground,
      ]}>
      <Text
        style={[
          styles.label,
          isDarkTheme ? styles.darkText : styles.lightText,
        ]}>
        Land Name
      </Text>
      <Input
        style={[
          styles.input,
          isDarkTheme ? styles.darkInput : styles.lightInput,
        ]}
        value={landName}
        onChangeText={setLandName}
        placeholder="Enter Land Name"
      />
      <Text
        style={[
          styles.label,
          isDarkTheme ? styles.darkText : styles.lightText,
        ]}>
        Location
      </Text>
      <Input
        style={[
          styles.input,
          isDarkTheme ? styles.darkInput : styles.lightInput,
        ]}
        value={location}
        onChangeText={setLocation}
        placeholder="Enter Location"
      />
      <Text
        style={[
          styles.label,
          isDarkTheme ? styles.darkText : styles.lightText,
        ]}>
        Land Size
      </Text>
      <Input
        style={[
          styles.input,
          isDarkTheme ? styles.darkInput : styles.lightInput,
        ]}
        value={landSize}
        onChangeText={setLandSize}
        placeholder="Land Size in Hectares"
      />
      <Text
        style={[
          styles.label,
          isDarkTheme ? styles.darkText : styles.lightText,
        ]}>
        Lease Status
      </Text>
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
          <Text
            style={[
              styles.label,
              isDarkTheme ? styles.darkText : styles.lightText,
            ]}>
            Lease Start Date
          </Text>
          <TouchableOpacity onPress={() => setShowStartPicker(true)}>
            <Text
              style={[
                styles.dateText,
                isDarkTheme ? styles.darkText : styles.lightText,
              ]}>
              {leaseStart.toDateString()}
            </Text>
          </TouchableOpacity>
          {showStartPicker && (
            <DateTimePicker
              value={leaseStart}
              mode="date"
              display="default"
              onChange={onChangeStart}
            />
          )}
          <Text
            style={[
              styles.label,
              isDarkTheme ? styles.darkText : styles.lightText,
            ]}>
            Lease End Date
          </Text>
          <TouchableOpacity onPress={() => setShowEndPicker(true)}>
            <Text
              style={[
                styles.dateText,
                isDarkTheme ? styles.darkText : styles.lightText,
              ]}>
              {leaseEnd.toDateString()}
            </Text>
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
      <Text
        style={[
          styles.label,
          isDarkTheme ? styles.darkText : styles.lightText,
        ]}>
        Select Farm Location on Map
      </Text>
      <MapView style={styles.map} region={mapRegion} onPress={handleMapPress}>
        {marker && <Marker coordinate={marker} />}
      </MapView>
      <Button
        onPress={handleSaveLand}
        title={
          loading ? "Submitting..." : isUpdate ? "Update Land" : "Save Land"
        }
        loading={loading}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    height: 40,
    marginBottom: 16,
    paddingLeft: 8,
    borderWidth: 1,
  },
  darkInput: {
    backgroundColor: "#333333",
    color: "#FFFFFF",
    borderColor: "#666666",
  },
  lightInput: {
    backgroundColor: "#ffffff",
    color: "#000000",
    borderColor: "#dddddd",
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
    borderRadius: 5,
    backgroundColor: "white",
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
  },
  darkText: {
    color: "#FFFFFF",
  },
  lightText: {
    color: "#000000",
  },
  darkBackground: {
    backgroundColor: "#000000",
  },
  lightBackground: {
    backgroundColor: "#ffffff",
  },
  map: {
    width: "100%",
    height: 300,
    marginBottom: 16,
  },
});

export default RegisterLandScreen;
