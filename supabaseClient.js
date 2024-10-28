import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://hogsimoijismoxjqrimw.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvZ3NpbW9pamlzbW94anFyaW13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAxMDQ1MTgsImV4cCI6MjA0NTY4MDUxOH0.pkQG93NdLrWVg5bhd8dYvh818jEp0PXw35kdpugIyws";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
