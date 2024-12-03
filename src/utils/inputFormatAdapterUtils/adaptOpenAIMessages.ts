import { OpenAIFunctionMessage } from "llm-proxy";
import { OpenAIMessages } from "../../types";

function adaptOpenAIMessages(
  messages: OpenAIFunctionMessage[]
): OpenAIMessages {
  return messages.map((msg: OpenAIFunctionMessage) => {
    if (msg.role === "function") {
      return {
        role: msg.role,
        content: msg.content ?? "",
        name: (msg as OpenAIFunctionMessage).name,
      };
    }
    return {
      role: msg.role,
      content: msg.content ?? "function call",
    };
  }) as OpenAIMessages;
}

export default adaptOpenAIMessages;
