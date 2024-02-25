import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { MiddlewareHandler, type Context } from "hono";
import { config } from "../config";

export const idCtxSupabase = "supabase-ctx";

/**
 * Middleware handler for Supabase
 * @param c Context
 * @param next
 * @returns
 */
export const supabaseMiddleware: MiddlewareHandler = async (c, next) => {
  try {
    const { SUPABASE_URL, SUPABASE_ANON_KEY } = config(c);

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return c.text("Something happened with environment variables");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    c.set(idCtxSupabase, supabase);

    return await next();
  } catch (error) {
    return c.text("Something wen't wrong!!", 400);
  }
};

/**
 * Get supabase context
 * @param c Context
 * @returns
 */
export const getSupabase = (c: Context): SupabaseClient => c.get(idCtxSupabase);
