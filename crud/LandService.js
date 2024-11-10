import supabase from "../supabaseClient";

// Add a new land
export const addLand = async (landData) => {
  const { data, error } = await supabase.from("lands").insert([landData]);
  return { data, error };
};

// Fetch all lands for a specific user
export const getLands = async (userId) => {
  const { data, error } = await supabase
    .from("lands")
    .select("*")
    .eq("user_id", userId);
  return { data, error };
};

// Update a land record
export const updateLand = async (landId, updatedData) => {
  const { data, error } = await supabase
    .from("lands")
    .update(updatedData)
    .eq("id", landId);
  return { data, error };
};

// Delete a land record
export const deleteLand = async (landId) => {
  const { data, error } = await supabase
    .from("lands")
    .delete()
    .eq("id", landId);
  return { data, error };
};
