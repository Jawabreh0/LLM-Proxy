import LLM_PROXY_ERROR_MESSAGES from "../../constants/errorMessages";
import { BedrockAnthropicMessage } from "../../types";
import { createMessage, createPlaceholderMessage } from "./createMessage";
import ensureNoConsecutiveRoles from "./ensureNoConsecutiveRoles";

function adaptAnthropicMessages(
  // eslint-disable-next-line @typescript-eslint/no-explicit-
  // TODO: fix the below any type
  messages: any[]
): {
  adaptedMessages: BedrockAnthropicMessage[];
  systemPrompt: string;
} {
  if (!messages.length) {
    throw new Error(LLM_PROXY_ERROR_MESSAGES.MESSAGES_ARRAY_CANNOT_BE_EMPTY);
  }

  const [firstMessage, ...restMessages] = messages;

  if (firstMessage.role !== "system") {
    throw new Error(LLM_PROXY_ERROR_MESSAGES.MISSING_ANTHROPIC_SYSTEM_ROLE);
  }

  const systemPrompt = firstMessage.content ?? "";
  const adaptedMessages: BedrockAnthropicMessage[] = [];

  restMessages.forEach((msg) => {
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
