import { BedrockAnthropicMessageRole } from "llm-proxy";
import {
  BedrockAnthropicContentType,
  BedrockAnthropicMessage,
} from "../../types";

export function createMessage(
  role: BedrockAnthropicMessageRole,
  content: string
): BedrockAnthropicMessage {
  return {
    role,
    content: [
      {
        type: BedrockAnthropicContentType.TEXT,
        text: content,
      },
    ],
  };
}

export function createPlaceholderMessage(
  role: BedrockAnthropicMessageRole
): BedrockAnthropicMessage {
  return createMessage(role, ":");
}
