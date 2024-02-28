import { UserType } from "./validator";
import { SupabaseClient } from "@supabase/supabase-js";

const COLLECTION = "users";

export const registerUser = async (
  supabase: SupabaseClient,
  user: UserType
): Promise<UserType> => {
  const { data } = await supabase
    .from(COLLECTION)
    .insert(user)
    .select()
    .maybeSingle();
  console.log("[registered]:", { data });
  return data as unknown as UserType;
};

export const findUser = async (
  supabase: SupabaseClient,
  email: string
): Promise<UserType | null> => {
  const { data } = await supabase
    .from(COLLECTION)
    .select("*")
    .eq("email", email)
    .maybeSingle();

  return data as unknown as UserType;
};

export const updateUser = async (
  supabase: SupabaseClient,
  userId: string,
  updates: Partial<UserType>
): Promise<UserType | null> => {
  const { data } = await supabase
    .from(COLLECTION)
    .update(updates)
    .eq("id", userId)
    .single();

  return data as unknown as UserType;
};
