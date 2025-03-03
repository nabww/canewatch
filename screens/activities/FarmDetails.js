import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  ScrollView,
  RefreshControl,
  Modal,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import supabase from "../../supabaseClient";
import { useTheme } from "../../context/ThemeContext";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const FarmDetails = ({ route }) => {
  const { farmName, landId } = route.params;
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { isDarkTheme } = useTheme();

  const fetchActivities = async () => {
    try {
      console.log("Fetching activities...");
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("land_id", landId)
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching activities:", error);
        return;
      }

      console.log("Activities data fetched:", data);

      if (!Array.isArray(data)) {
        console.error("Invalid data format:", data);
        return;
      }

      const activitiesWithUrls = await Promise.all(
        data.map(async (activity) => {
          if (activity.media_urls && activity.media_urls.length > 0) {
            console.log("Processing media URLs for activity:", activity.id);
            const urls = await Promise.all(
              activity.media_urls.map(async (url) => {
                try {
                  const filePath = url.split("/activity-media-new/")[1];
                  console.log("Extracted file path:", filePath);

                  if (!filePath) {
                    console.error("Invalid file path in URL:", url);
                    return url;
                  }

                  const isPublic = url.includes("/public/");
                  if (isPublic) {
                    const publicUrl = `https://hogsimoijismoxjqrimw.supabase.co/storage/v1/object/public/activity-media-new/${filePath}`;
                    console.log("Public URL generated:", publicUrl);
                    return publicUrl;
                  } else {
                    // For private files, use Supabase signed URL
                    const { data: signedData, error: signedError } =
                      await supabase.storage
                        .from("activity-media-new")
                        .createSignedUrl(filePath, 60); // URL valid for 60 seconds
                    if (signedError) {
                      console.error("Error creating signed URL:", signedError);
                      return url;
                    }
                    return signedData.signedUrl;
                  }
                } catch (err) {
                  console.error("Error processing URL:", url, err);
                  return url;
                }
              })
            );
            activity.media_urls = urls.filter((url) => url !== undefined);
          }
          return activity;
        })
      );

      console.log("Activities with URLs:", activitiesWithUrls);
      setActivities(activitiesWithUrls);
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      console.log("Fetching complete, setting loading to false.");
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [landId]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchActivities();
  };

  const openGallery = (mediaUrls, index) => {
    setSelectedImages(mediaUrls);
    setCurrentImageIndex(index);
    setGalleryVisible(true);
  };

  const closeGallery = () => {
    setGalleryVisible(false);
  };

  const renderActivityCard = ({ item }) => (
    <View
      style={[styles.card, isDarkTheme ? styles.darkCard : styles.lightCard]}>
      <Text
        style={[
          styles.cardTitle,
          isDarkTheme ? styles.darkText : styles.lightText,
        ]}>
        {item.activity_title}
      </Text>
      <Text
        style={[
          styles.cardDate,
          isDarkTheme ? styles.darkText : styles.lightText,
        ]}>
        {new Date(item.date).toLocaleDateString()}
      </Text>
      <Text
        style={[
          styles.cardTitle,
          isDarkTheme ? styles.darkText : styles.lightText,
        ]}>
        Activity: {item.type || "N/A"}
      </Text>
      <Text
        style={[
          styles.cardNotes,
          isDarkTheme ? styles.darkText : styles.lightText,
        ]}>
        Notes: {item.notes || "N/A"}
      </Text>
      <Text
        style={[
          styles.cardCost,
          isDarkTheme ? styles.darkText : styles.lightText,
        ]}>
        Cost: {item.cost ? `KES ${item.cost}` : "N/A"}
      </Text>
      <Text
        style={[
          styles.mediaLabel,
          isDarkTheme ? styles.darkText : styles.lightText,
        ]}>
        Media:
      </Text>
      {item.media_urls && item.media_urls.length > 0 ? (
        <ScrollView horizontal style={styles.mediaContainer}>
          {item.media_urls.map((url, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => openGallery(item.media_urls, index)}>
              <Image
                source={{ uri: url }}
                style={styles.mediaImage}
                resizeMode="cover"
                onError={(error) => {
                  console.error(
                    "Image loading error:",
                    error.nativeEvent.error,
                    "URL:",
                    url
                  );
                }}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <Text
          style={[
            styles.noMediaText,
            isDarkTheme ? styles.darkText : styles.lightText,
          ]}>
          No media uploaded.
        </Text>
      )}
    </View>
  );

  const renderGallery = () => (
    <Modal visible={galleryVisible} transparent={true} animationType="fade">
      <View style={styles.galleryContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={closeGallery}>
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
        <FlatList
          data={selectedImages}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={currentImageIndex}
          getItemLayout={(data, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item }}
              style={styles.galleryImage}
              resizeMode="contain"
            />
          )}
        />
      </View>
    </Modal>
  );

  return (
    <View
      style={[
        styles.container,
        isDarkTheme ? styles.darkBackground : styles.lightBackground,
      ]}>
      <Text
        style={[
          styles.title,
          isDarkTheme ? styles.darkText : styles.lightText,
        ]}>
        {farmName}
      </Text>
      {loading ? (
        <ActivityIndicator size="large" color="#5C2D91" />
      ) : activities.length > 0 ? (
        <FlatList
          data={activities}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderActivityCard}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      ) : (
        <Text
          style={[
            styles.noActivitiesText,
            isDarkTheme ? styles.darkText : styles.lightText,
          ]}>
          No activities available.
        </Text>
      )}
      {renderGallery()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  darkCard: { backgroundColor: "#333333" },
  lightCard: { backgroundColor: "#ffffff" },
  cardTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  cardDate: { fontSize: 16, marginBottom: 10 },
  cardNotes: { fontSize: 16, marginBottom: 10 },
  cardCost: { fontSize: 16 },
  noActivitiesText: { fontSize: 18, textAlign: "center", marginTop: 20 },
  mediaLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  mediaContainer: { flexDirection: "row", marginBottom: 10 },
  mediaImage: { width: 100, height: 100, borderRadius: 8, marginRight: 10 },
  noMediaText: { fontSize: 14, fontStyle: "italic", marginBottom: 10 },
  darkText: { color: "#FFFFFF" },
  lightText: { color: "#000000" },
  darkBackground: { backgroundColor: "#000000" },
  lightBackground: { backgroundColor: "#F9F9FB" },
  galleryContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  galleryImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.8,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default FarmDetails;
