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

const appUser = new Hono();

appUser.use("*", supabaseMiddleware);

appUser.get("/", async (c) => {
  const supabase = getSupabase(c);

  const { data: users, error } = await supabase.from("users").select("*");
  console.log({ users });

  console.log({ users });
  console.log({ error });
  return c.json({
    users,
    error,
  });
});

appUser.get("/belvo", async (c) => {
  console.log("belvo");
  const { BELVO_BASE_URL, BELVO_SECRET_KEY_ID, BELVO_SECRET_PASSWORD } =
    config(c);
  const token = btoa(BELVO_SECRET_KEY_ID + ":" + BELVO_SECRET_PASSWORD);
  console.log("btoa", token);

  const response = await fetch(
    BELVO_BASE_URL + "/api/institutions/?page=1&type=bank&country_code=MX",
    {
      method: "GET",
      headers: {
        Authorization: `Basic ${token}`,
      },
    }
  );

  const data = (await response.json()) as InstitutionResponse;

  return c.json({
    message: "Successfully",
    data: data,
  });
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

    const user = await registerUser(supabase, body);

    return c.json({ user });
  }
  return c.json({ error: "Something wen't wrong" }, 400);
});

appUser.post("/login", zUserLoginValidator, async (c) => {
  const body = await c.req.parseBody<UserLoginType>();
  const supabase = getSupabase(c);
  const user = await findUser(supabase, body.email);

  if (!user) {
    return c.json({ error: "User or Password don't match" }, 404);
  }
  const isCorrectPassword = await comparePassword(body.password, user.password);

  if (!isCorrectPassword) {
    return c.json({ error: "User or Password don't match" }, 400);
  }

  const token = await sign({ email: user.email }, config(c).JWT_SECRET);

  return c.json({ user, token });
});

export { appUser };
