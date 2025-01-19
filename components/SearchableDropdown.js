import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import supabase from "../supabaseClient";

const SearchableDropdown = ({ placeholder, onSelect }) => {
  const [lands, setLands] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    fetchLands();
  }, []);

  const fetchLands = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("lands")
        .select("id, landName");

      if (error) throw error;

      setLands(data || []);
    } catch (error) {
      console.error("Error fetching lands:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredLands = lands.filter((land) =>
    land.landName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (id, landName) => {
    setSearchQuery(landName); // Set the selected name in the input
    setShowList(false); // Hide the list
    onSelect(id, landName); // Trigger the callback
  };

  return (
    <View style={styles.dropdownContainer}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
          setShowList(text.trim().length > 0); // Show list if query is not empty
        }}
      />
      {loading && (
        <ActivityIndicator size="small" color="#5C2D91" style={styles.loader} />
      )}
      {!loading && showList && filteredLands.length > 0 && (
        <FlatList
          data={filteredLands}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => handleSelect(item.id, item.landName)}>
              <Text style={styles.itemText}>{item.landName}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    marginBottom: 16,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dddddd",
  },
  input: {
    padding: 12,
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: "#dddddd",
  },
  loader: {
    padding: 10,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#f2f2f2",
  },
  itemText: {
    fontSize: 16,
  },
});

export default SearchableDropdown;
