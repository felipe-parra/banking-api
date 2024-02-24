import { UserType } from "./validator";
import { SupabaseClient } from "@supabase/supabase-js";

const COLLECTION = "users";

export const registerUser = async (
  supabase: SupabaseClient,
  user: UserType
): Promise<UserType> => {
  const { data } = await supabase.from(COLLECTION).insert(user).select("*");
  return data as unknown as UserType;
};

export const findUser = async (
  supabase: SupabaseClient,
  email: string
): Promise<UserType | null> => {
  const { data } = await supabase
    .from(COLLECTION)
    .select()
    .eq("email", email)
    .maybeSingle();

  return data as unknown as UserType;
};
