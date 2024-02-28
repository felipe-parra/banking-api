import { Hono } from "hono";
import {
  UserLoginType,
  UserType,
  zUserLoginValidator,
  zUserRegisterValidator,
} from "./validator";
import { getSupabase, supabaseMiddleware } from "../middleware/subabase";
import { findUser, registerUser } from "./service";
import { comparePassword, hashPassword } from "../utils";
import { sign } from "hono/jwt";
import { config } from "../config";
import { InstitutionResponse } from "../types/belvo.types";
import { Jwt } from "hono/utils/jwt";

const appUser = new Hono();

appUser.use("*", supabaseMiddleware);

appUser.get("/", async (c) => {
  try {
    const supabase = getSupabase(c);

    const { data: users, error } = await supabase.from("users").select();
    console.log({ users });

    console.log({ error });
    return c.json(
      {
        users,
        error,
      },
      200
    );
  } catch (error) {
    return c.json({ error: "Something wen't wrong" }, 400);
  }
});

appUser.post("/register", zUserRegisterValidator, async (c) => {
  const body = await c.req.parseBody<UserType>();
  const supabase = getSupabase(c);

  console.log({ body });

  const foundedUser = await findUser(supabase, body.email);

  console.log({ foundedUser });
  if (!foundedUser) {
    console.log({ foundedUser });

    body.password = await hashPassword(body.password);

    console.log({ body });

    const user = await registerUser(supabase, body);

    user.password = "";

    const token = await sign(
      { email: user.email },
      config(c).JWT_SECRET,
      "HS256"
    );

    return c.json({ user, token }, 201);
  }
  return c.json({ error: "Something wen't wrong" }, 400);
});

appUser.post("/login", zUserLoginValidator, async (c) => {
  console.log("Login");
  const body = await c.req.parseBody<UserLoginType>();
  const supabase = getSupabase(c);
  const user = await findUser(supabase, body.email);

  console.log({ body, user });
  if (!user) {
    return c.json({ error: "User or Password don't match" }, 404);
  }
  const isCorrectPassword = await comparePassword(body.password, user.password);

  console.log({ isCorrectPassword });

  if (!isCorrectPassword) {
    console.log("[!]:", { isCorrectPassword });
    return c.json({ error: "User or Password don't match" }, 400);
  }

  user.password = "";

  const token = await sign(
    { email: user.email },
    config(c).JWT_SECRET,
    "HS256"
  );

  return c.json({ user, token }, 200);
});

export { appUser };
