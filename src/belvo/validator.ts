import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const registerLinkSchema = z.object({
  institution: z.string(),
  username: z.string(),
  password: z.string(),
});

export type RegisterLinkType = z.infer<typeof registerLinkSchema>;

export const zRegisterAccountValidator = zValidator("form", registerLinkSchema);
