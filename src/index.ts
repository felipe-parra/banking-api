import { Env, Hono } from "hono";
import { appUser } from "./users";
import { appBelvo } from "./belvo";
import { cors } from "hono/cors";

const mainApp = new Hono().basePath("/api/v1");

mainApp.use(
  cors({
    origin: ["*"],
    allowMethods: ["GET", "POST"],
    allowHeaders: ["*"],
  })
);

mainApp.route("/users", appUser);

mainApp.route("/belvo", appBelvo);

export default mainApp;
