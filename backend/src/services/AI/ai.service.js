import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { msgModel } from "./ai.models.js";
import { messageModelSystemMessage } from "./ai.systemMessage.js";

/**
 * Convert raw messages → Langchain format
 */
const formatMessages = (messages = []) => {
  if (!Array.isArray(messages)) {
    throw new Error("Invalid messages format");
  }

  return messages
    .filter((msg) => msg?.content?.trim()) // remove empty
    .map((msg) => {
      switch (msg.role) {
        case "user":
          return new HumanMessage(msg.content.trim());

        case "assistant":
          return new AIMessage(msg.content.trim());

        case "system":
          return new SystemMessage(msg.content.trim());

        default:
          throw new Error(`Invalid role: ${msg.role}`);
      }
    });
};

/**
 * Send messages to AI
 */
export const sendMessageToAI = async (messages) => {
  try {
    const formattedMessages = formatMessages(messages);

    const response = await msgModel.invoke([
      new SystemMessage(messageModelSystemMessage),
      ...formattedMessages,
    ]);

    const output = response?.content?.trim();

    if (!output) {
      throw new Error("Empty AI response");
    }

    return output;
  } catch (error) {
    console.error("❌ AI Message Error:", error.message);
    throw new Error("Failed to generate AI response");
  }
};
