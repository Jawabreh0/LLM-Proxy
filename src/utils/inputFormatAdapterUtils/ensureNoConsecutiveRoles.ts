import { BedrockAnthropicMessage } from "../../types";
import { createPlaceholderMessage } from "./createMessage";

function ensureNoConsecutiveRoles(messages: BedrockAnthropicMessage[]) {
  if (!messages || messages.length === 0) {
    return;
  }

  for (let i = 0; i < messages.length - 1; i += 1) {
    if (messages[i]?.role === messages[i + 1]?.role) {
      const placeholderRole =
        messages[i]?.role === "user" ? "assistant" : "user";
      messages.splice(i + 1, 0, createPlaceholderMessage(placeholderRole));
      i += 1;
    }
  }
}

export default ensureNoConsecutiveRoles;
