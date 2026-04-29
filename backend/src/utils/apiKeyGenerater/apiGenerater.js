import crypto from "crypto";
import bcrypt from "bcryptjs";

export const generateApiKey = async () => {
  const prefix = "ops";

  const rawKey = crypto.randomBytes(20).toString("hex");

  const fullKey = `${prefix}_${rawKey}`;

  const hash = await bcrypt.hash(fullKey, 10);

  return {
    fullKey, // send to user ONCE
    hash,
    prefix,
  };
};
