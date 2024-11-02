export enum OpenAIMessagRoleS {
  SYSTEM = "system",
  USER = "user",
  ASSISTANT = "assistant",
  FUNCTION = "function",
}

export enum AnthropicMessageRoles {
  SYSTEM = "system",
  USER = "user",
  ASSISTANT = "assistant",
}

type OpenAISystemMessage = {
  role: "system";
  content: string;
};

type OpenAIUserMessage = {
  role: "user";
  content: string;
};

type OpenAIAssistantMessage = {
  role: "assistant";
  content: string;
};

type OpenAIToolMessage = {
  role: "tool";
  content: string;
};

type OpenAIFunctionMessage = {
  role: "function";
  content: string;
  name: string;
};
export type OpenAIMessage =
  | OpenAISystemMessage
  | OpenAIUserMessage
  | OpenAIAssistantMessage
  | OpenAIToolMessage
  | OpenAIFunctionMessage;

export type OpenAIMessages = OpenAIMessage[];
