import { Hono } from "hono";
import { getSupabase, supabaseMiddleware } from "../middleware/subabase";
import { config } from "../config";
import {
  CreationLinkResponse,
  InstitutionResponse,
  TransactionResponse,
} from "../types/belvo.types";
import { zRegisterAccountValidator } from "./validator";

const appBelvo = new Hono();

appBelvo.use("*", supabaseMiddleware);

appBelvo.get("/institutions", async (c) => {
  try {
    console.log("belvo");
    const { BELVO_BASE_URL, BELVO_SECRET_KEY_ID, BELVO_SECRET_PASSWORD } =
      config(c);
    const token = btoa(BELVO_SECRET_KEY_ID + ":" + BELVO_SECRET_PASSWORD);

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
    const { BELVO_BASE_URL, BELVO_SECRET_KEY_ID, BELVO_SECRET_PASSWORD } =
      config(c);
    const token = btoa(BELVO_SECRET_KEY_ID + ":" + BELVO_SECRET_PASSWORD);

    const body = await c.req.parseBody();

    console.log({ body });

    const response = await fetch(`${BELVO_BASE_URL}/api/links`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = (await response.json()) as CreationLinkResponse;

    if (!data.id) {
      throw new Error("Something went wrong");
    }
    console.log({ data }, data);
    return c.json({
      message: "Created link successfully",
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

appBelvo.get("/transactions", async (c) => {
  try {
    const { BELVO_BASE_URL, BELVO_SECRET_KEY_ID, BELVO_SECRET_PASSWORD } =
      config(c);
    const token = btoa(BELVO_SECRET_KEY_ID + ":" + BELVO_SECRET_PASSWORD);

    const link = await c.req.query("link");

    const page = (await c.req.query("page")) || 1;

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
