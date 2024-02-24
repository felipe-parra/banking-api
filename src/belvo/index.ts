import { Hono } from "hono";
import { supabaseMiddleware } from "../middleware/subabase";
import { config } from "../config";
import { InstitutionResponse } from "../types/belvo.types";

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

appBelvo.post("/");

export { appBelvo };
