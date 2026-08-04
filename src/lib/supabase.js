import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://ggzacdsjlnrknpaedgye.supabase.co";

const supabasePublishableKey =
  "sb_publishable_Me5CWEfTKQM3dem-nXL3hg_CGXp60r8";

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey,
);