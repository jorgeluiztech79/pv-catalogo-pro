import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL?.trim();

const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

console.log("URL:", JSON.stringify(supabaseUrl));
console.log(
  "KEY:",
  JSON.stringify(supabasePublishableKey),
);
console.log(
  "TAMANHO DA KEY:",
  supabasePublishableKey?.length,
);

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey,
);
console.log("KEY COMPLETA:");
console.log(supabasePublishableKey);

console.log("PRIMEIROS 20:");
console.log(supabasePublishableKey.slice(0, 20));

console.log("ÚLTIMOS 20:");
console.log(supabasePublishableKey.slice(-20));