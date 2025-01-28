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
  Image,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import supabase from "../../supabaseClient";
import SearchableDropdown from "../../components/SearchableDropdown";
import Input from "../../components/Input ";
import { FlatList } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Ionicons } from "@expo/vector-icons"; // Import icons

const MainActivityScreen = () => {
  const [selectedFarm, setSelectedFarm] = useState("");
  const [activityType, setActivityType] = useState("");
  const [date, setDate] = useState("");
  const [cost, setCost] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [media, setMedia] = useState([]); // Array to store selected media files
  const { isDarkTheme } = useTheme();

  // Function to handle file selection
  const pickMedia = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Please allow access to your media library."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setMedia([...media, ...result.assets]);
    }
  };

  // Function to delete a selected image
  const deleteImage = (index) => {
    const updatedMedia = media.filter((_, i) => i !== index);
    setMedia(updatedMedia);
  };

  // Function to upload files to Supabase Storage
  const uploadFiles = async (files) => {
    const uploadedUrls = [];
    for (const file of files) {
      const { uri } = file;
      const fileName = uri.split("/").pop();
      const fileExt = fileName.split(".").pop();

      const { data, error } = await supabase.storage
        .from("activity-media") // Replace with your bucket name
        .upload(`activity-media/${Date.now()}_${fileName}`, {
          uri,
          type: `image/${fileExt}`,
          name: fileName,
        });

      if (error) {
        console.error("Error uploading file:", error);
        continue;
      }

      const { data: publicUrl } = supabase.storage
        .from("activity-media")
        .getPublicUrl(data.path);

      uploadedUrls.push(publicUrl.publicUrl);
    }
    return uploadedUrls;
  };

  const handleSaveActivity = async () => {
    if (!selectedFarm || !activityType || !date) {
      Alert.alert("Validation Error", "All fields except Notes are required.");
      return;
    }

    setLoading(true);
    try {
      const { data, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const userId = data?.user?.id;
      if (!userId) throw new Error("User not authenticated");

      // Upload media files and get their URLs
      const mediaUrls = media.length > 0 ? await uploadFiles(media) : [];

      const activityData = {
        land_id: selectedFarm,
        type: activityType,
        date,
        cost: parseFloat(cost),
        notes: notes || null,
        user_id: userId,
        media_urls: mediaUrls, // Store media URLs
      };

      const { error } = await supabase.from("activities").insert(activityData);
      if (error) throw error;

      Alert.alert("Success", "Activity recorded successfully.");
      setSelectedFarm("");
      setActivityType("");
      setDate("");
      setCost("");
      setNotes("");
      setMedia([]); // Clear selected media
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

  const isFutureDate = () => {
    if (!date) return false;
    const today = new Date();
    const selectedDate = new Date(date);
    return selectedDate > today;
  };

  const formData = [
    {
      key: "farmSelection",
      component: (
        <View>
          <Text
            style={[
              styles.label,
              isDarkTheme ? styles.darkText : styles.lightText,
            ]}>
            Select Farm
          </Text>
          <SearchableDropdown
            placeholder="Search to select a farm"
            onSelect={(id) => setSelectedFarm(id)}
            textInputStyle={isDarkTheme ? styles.darkInput : styles.lightInput}
            itemStyle={isDarkTheme ? styles.darkItem : styles.lightItem}
            itemTextStyle={
              isDarkTheme ? styles.darkItemText : styles.lightItemText
            }
            containerStyle={
              isDarkTheme ? styles.darkContainer : styles.lightContainer
            }
          />
        </View>
      ),
    },
    {
      key: "activityType",
      component: (
        <View>
          <Text
            style={[
              styles.label,
              isDarkTheme ? styles.darkText : styles.lightText,
            ]}>
            Select Activity
          </Text>
          <Input
            placeholder="Activity Type (e.g., Tilling)"
            value={activityType}
            onChangeText={setActivityType}
            style={styles.input}
          />
        </View>
      ),
    },
    {
      key: "date",
      component: (
        <View>
          <Text
            style={[
              styles.label,
              isDarkTheme ? styles.darkText : styles.lightText,
            ]}>
            Activity Date
          </Text>
          <TouchableOpacity
            style={[
              styles.input,
              styles.dateButton,
              isDarkTheme ? styles.darkInput : styles.lightInput,
            ]}
            onPress={() => setShowDatePicker(true)}>
            <Text
              style={{
                fontSize: 16,
                color: date ? (isDarkTheme ? "#FFF" : "#000") : "#aaa",
              }}>
              {date || "Select Date"}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date ? new Date(date) : new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
              style={{ backgroundColor: "white" }}
            />
          )}
        </View>
      ),
    },
    {
      key: "cost",
      component: (
        <View>
          <Text
            style={[
              styles.label,
              isDarkTheme ? styles.darkText : styles.lightText,
            ]}>
            Cost of activity
          </Text>
          <Input
            placeholder="Cost"
            keyboardType="numeric"
            value={cost}
            onChangeText={setCost}
            style={styles.input}
          />
        </View>
      ),
    },
    {
      key: "notes",
      component: (
        <View>
          <Text style={[isDarkTheme ? styles.darkText : styles.lightText]}>
            Notes
          </Text>
          <TextInput
            placeholder="Notes (optional)"
            multiline
            style={[
              styles.notes,
              styles.input,
              isDarkTheme
                ? [styles.darkInput, styles.darkText]
                : [styles.lightInput, styles.lightText],
            ]}
            value={notes}
            onChangeText={setNotes}
          />
        </View>
      ),
    },
    {
      key: "media",
      component: (
        <View>
          <Text
            style={[
              styles.label,
              isDarkTheme ? styles.darkText : styles.lightText,
            ]}>
            Upload Media (Optional)
          </Text>
          <TouchableOpacity
            style={[
              styles.button,
              styles.mediaButton,
              isDarkTheme ? styles.darkInput : styles.lightInput,
            ]}
            onPress={pickMedia}>
            <Text style={isDarkTheme ? styles.darkText : styles.lightText}>
              Select Media
            </Text>
          </TouchableOpacity>
          <ScrollView horizontal>
            {media.map((item, index) => (
              <View key={index} style={styles.mediaContainer}>
                <Image source={{ uri: item.uri }} style={styles.mediaPreview} />
                <TouchableOpacity
                  style={styles.deleteIcon}
                  onPress={() => deleteImage(index)}>
                  <Ionicons name="close-circle" size={24} color="red" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
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
            {loading
              ? "Submitting..."
              : isFutureDate()
              ? "Schedule"
              : "Save Activity"}
          </Text>
        </TouchableOpacity>
      ),
    },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[
        styles.container,
        isDarkTheme ? styles.darkBackground : styles.lightBackground,
      ]}>
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
  },
  input: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
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
  notes: {
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
  mediaButton: {
    marginBottom: 16,
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
  mediaContainer: {
    position: "relative",
    marginRight: 10,
  },
  mediaPreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  deleteIcon: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "white",
    borderRadius: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
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
    backgroundColor: "#F9F9FB",
  },
  lightItem: {
    padding: 10,
    marginTop: 2,
    backgroundColor: "#FFFFFF",
    borderColor: "#D1D5DB",
    borderWidth: 1,
  },
  darkItem: {
    padding: 10,
    marginTop: 2,
    backgroundColor: "#1E1E1E",
    borderColor: "#333333",
    borderWidth: 1,
  },
  lightItemText: { color: "#000000" },
  darkItemText: { color: "#FFFFFF" },
  lightContainer: { backgroundColor: "#FFFFFF" },
  darkContainer: { backgroundColor: "#1E1E1E" },
});

export default MainActivityScreen;
