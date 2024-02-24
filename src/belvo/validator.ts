import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const registerAccountSchema = z.object({
  institution: z.string(),
  username: z.string(),
  password: z.string(),
});

export type RegisterAccountType = z.infer<typeof registerAccountSchema>;

export const zRegisterAccountValidator = zValidator(
  "form",
  registerAccountSchema
);
