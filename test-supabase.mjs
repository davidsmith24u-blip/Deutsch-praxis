import { createClient } from "@supabase/supabase-js";
const url = "https://qkxnmabfdgxfxnhayngw.supabase.co";
const key = "sb_publishable_8qOQDX0tgfWvhlmisgc9zw_JVABq2Vy";
const supabase = createClient(url, key);
const { data, error } = await supabase.auth.signUp({ email: "testuser12345@mailinator.com", password: "Test1234!" });
console.log("signup data:", JSON.stringify(data?.user?.id));
console.log("signup error:", error?.message);