import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const schemaUser = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  accounts: z.string().optional(),
  id: z.string().optional(),
});

export const schemaLoginUser = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type UserType = z.infer<typeof schemaUser>;

export type UserLoginType = z.infer<typeof schemaLoginUser>;

export const zUserRegisterValidator = zValidator("form", schemaUser);

export const zUserLoginValidator = zValidator("form", schemaLoginUser);
