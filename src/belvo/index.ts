import { Hono } from "hono";
import { supabaseMiddleware } from "../middleware/subabase";
import { config } from "../config";
import { InstitutionResponse, TransactionResponse } from "../types/belvo.types";
import { RegisterAccountType, zRegisterAccountValidator } from "./validator";

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
      `${BELVO_BASE_URL}/api/institutions/?page=${page}`,
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

appBelvo.post("/register-account", zRegisterAccountValidator, async (c) => {
  try {
    const { BELVO_BASE_URL, BELVO_SECRET_KEY_ID, BELVO_SECRET_PASSWORD } =
      config(c);
    const token = btoa(BELVO_SECRET_KEY_ID + ":" + BELVO_SECRET_PASSWORD);

    const body = await c.req.parseBody<RegisterAccountType>();

    const response = await fetch(`${BELVO_BASE_URL}/api/links/`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    console.log({ data });
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

    const body = await c.req.parseBody();

    const account = await c.req.query("account");

    const page = (await c.req.query("page")) || 1;
    console.log({
      body,
      account,
      page,
    });
    const response = await fetch(
      `${BELVO_BASE_URL}/api/transactions/?page=${page}&link=${body.link}`,
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

appBelvo.get("/account", async (c) => {
  try {
    const { BELVO_BASE_URL, BELVO_SECRET_KEY_ID, BELVO_SECRET_PASSWORD } =
      config(c);
    const token = btoa(BELVO_SECRET_KEY_ID + ":" + BELVO_SECRET_PASSWORD);

    const body = await c.req.parseBody();

    const page = (await c.req.query("page")) || 1;

    const response = await fetch(
      `${BELVO_BASE_URL}/api/accounts/?page=${page}&link=${body.link}`,
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
