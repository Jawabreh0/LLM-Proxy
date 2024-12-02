import { BedrockAnthropicMessage } from "../../types";
import { createMessage, createPlaceholderMessage } from "./createMessage";
import ensureNoConsecutiveRoles from "./ensureNoConsecutiveRoles";

function adaptAnthropicMessages(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messages: any[]
): {
  adaptedMessages: BedrockAnthropicMessage[];
  systemPrompt: string;
} {
  if (!messages.length) {
    throw new Error("Messages array cannot be empty for Anthropic.");
  }

  const [firstMessage, ...restMessages] = messages;

  if (firstMessage.role !== "system") {
    throw new Error(
      "The first message must have a role of 'system' for Anthropic."
    );
  }

  const systemPrompt = firstMessage.content ?? "";
  const adaptedMessages: BedrockAnthropicMessage[] = [];

  restMessages.forEach(msg => {
    if (msg.role !== "user" && msg.role !== "assistant") {
      adaptedMessages.push(
        createPlaceholderMessage("user"),
        createMessage("assistant", msg.content ?? "")
      );
    } else {
      adaptedMessages.push(
        createMessage(msg.role, msg.content ?? msg.function_call?.arguments)
      );
    }
  });

  ensureNoConsecutiveRoles(adaptedMessages);

  return { adaptedMessages, systemPrompt };
}

export default adaptAnthropicMessages;
