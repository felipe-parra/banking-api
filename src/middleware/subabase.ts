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
    const { SUPABASE_API_KEY, SUPABASE_PROJECT_URL } = config(c);

    if (!SUPABASE_PROJECT_URL && !SUPABASE_API_KEY) {
      return c.text("Something happened with environment variables");
    }

    const supabase = createClient(SUPABASE_PROJECT_URL, SUPABASE_API_KEY);

    c.set(idCtxSupabase, supabase);

    await next();
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
