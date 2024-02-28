import { Hono } from "hono";
import { getSupabase, supabaseMiddleware } from "../middleware/subabase";
import { config } from "../config";
import {
  CreationLinkResponse,
  InstitutionResponse,
  TransactionResponse,
} from "../types/belvo.types";
import { zRegisterAccountValidator } from "./validator";
import { jwt } from "hono/jwt";
import { Jwt } from "hono/utils/jwt";
import { findUser, updateUser } from "../users/service";

const appBelvo = new Hono();

appBelvo.use("*", supabaseMiddleware);

appBelvo.get("/institutions", async (c) => {
  try {
    console.log("belvo");
    const { BELVO_BASE_URL, BELVO_SECRET_KEY_ID, BELVO_SECRET_PASSWORD } =
      config(c);
    const token = btoa(BELVO_SECRET_KEY_ID + ":" + BELVO_SECRET_PASSWORD);
    console.log("[token]:", c.req.header("Authorization"));
    const page = c.req.query("page") ?? 1;

    const response = await fetch(
      `${BELVO_BASE_URL}/api/institutions/?page=${page}&type=bank`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${token}`,
        },
      }
    );

    const data = (await response.json()) as InstitutionResponse;

    return c.json({
      message: "Successfully",
      data: data,
    });
  } catch (error) {
    return c.json(
      {
        message: "Something wen't wrong",
      },
      400
    );
  }
});

appBelvo.post("/register-link", zRegisterAccountValidator, async (c) => {
  try {
    const tokenUser = c.req.header("Authorization")?.split(" ")[1];
    console.log({ tokenUser });
    if (!tokenUser) {
      console.log("Not founded token");
      throw new Error("Missing token");
    }
    const { BELVO_BASE_URL, BELVO_SECRET_KEY_ID, BELVO_SECRET_PASSWORD } =
      config(c);
    const supabase = getSupabase(c);

    const token = btoa(BELVO_SECRET_KEY_ID + ":" + BELVO_SECRET_PASSWORD);

    const body = await c.req.parseBody();

    console.log({ body, token });

    const response = await fetch(`${BELVO_BASE_URL}/api/links`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        Authorization: `Basic ${token}`,
        "Content-Type": "application/json",
        Connection: "keep-alive",
      },
      body: JSON.stringify(body),
    });

    const data = (await response.json()) as CreationLinkResponse;
    console.log(
      { data },
      data.id,
      !data,
      data.id === undefined,
      data.id === null
    );

    if (!data || data.id === undefined || data.id === null) {
      throw new Error("Something went wrong");
    }
    const decoded = await Jwt.verify(tokenUser, config(c).JWT_SECRET);
    console.log("[decoded]", decoded);

    if (!decoded && !decoded?.email) {
      throw new Error("Not valid token");
    }

    const foundedUser = await findUser(supabase, decoded.email);
    console.log({ foundedUser });

    if (!foundedUser?.id) {
      throw new Error("User not founded");
    }

    const updatedUser = await updateUser(supabase, foundedUser.id, {
      accounts: foundedUser?.accounts
        ? JSON.stringify([...foundedUser?.accounts, data.id])
        : JSON.stringify([data.id]),
    });

    console.log({ updatedUser });

    return c.json({
      message: "Created link successfully",
      data: data,
    });
  } catch (error) {
    console.log({ error });
    return c.json(
      {
        message: "Something wen't wrong",
      },
      400
    );
  }
});

appBelvo.get("/transactions", async (c) => {
  try {
    const { BELVO_BASE_URL, BELVO_SECRET_KEY_ID, BELVO_SECRET_PASSWORD } =
      config(c);
    const token = btoa(BELVO_SECRET_KEY_ID + ":" + BELVO_SECRET_PASSWORD);

    const link = await c.req.query("link");
    console.log({ link });

    const page = (await c.req.query("page")) || 1;
    console.log({ page });

    const response = await fetch(
      `${BELVO_BASE_URL}/api/transactions/?page=${page}&link=${link}`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = (await response.json()) as TransactionResponse;
    console.log({ data });
    return c.json({
      message: "Transactions successfully recovered",
      data: data,
    });
  } catch (error) {
    return c.json(
      {
        message: "Something wen't wrong",
      },
      400
    );
  }
});

appBelvo.get("/accounts", async (c) => {
  try {
    const { BELVO_BASE_URL, BELVO_SECRET_KEY_ID, BELVO_SECRET_PASSWORD } =
      config(c);
    const token = btoa(BELVO_SECRET_KEY_ID + ":" + BELVO_SECRET_PASSWORD);
    console.log("[token]:", c.req.header("Authorization"));

    const link = await c.req.query("link");

    const page = (await c.req.query("page")) || 1;

    const response = await fetch(
      `${BELVO_BASE_URL}/api/accounts/?page=${page}&link=${link}`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = (await response.json()) as TransactionResponse;
    console.log({ data });
    return c.json({
      message: "Transactions successfully recovered",
      data: data,
    });
  } catch (error) {
    return c.json(
      {
        message: "Something wen't wrong",
      },
      400
    );
  }
});

export { appBelvo };
