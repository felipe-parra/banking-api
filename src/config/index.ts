import { env } from "hono/adapter";
import { Bindings } from "../bindings/index";
import { Context } from "hono";

export const config = (c: Context) => env<Bindings>(c);
