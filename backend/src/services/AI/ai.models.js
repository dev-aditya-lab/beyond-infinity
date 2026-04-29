import { ChatGroq } from "@langchain/groq";
import { ENV } from "../../config/env.config.js";

/**
 * Base config (shared across models)
 */
const baseConfig = {
  apiKey: ENV.GROQ_API_KEY,
  maxRetries: 2,
  timeout: 10000, // 10 sec safety
};

/**
 * Main Chat Model (for conversations)
 */
export const msgModel = new ChatGroq({
  ...baseConfig,
  model: "openai/gpt-oss-120b",

  temperature: 0.7, // balanced creativity
  maxTokens: 1000, // controlled output
});
