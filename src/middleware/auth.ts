import { Context, MiddlewareHandler } from "hono";
import { jwt } from "hono/jwt";

/**
 * Auth middleware
 * @param c Hono Context
 * @param next next function
 * @returns
 */
export const authMiddleware: MiddlewareHandler = async (c: Context, next) => {
  const jwtMiddleware = jwt({
    secret: c.env.JWT_SECRET,
  });

  return jwtMiddleware(c, next);
};
