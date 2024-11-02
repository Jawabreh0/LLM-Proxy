export enum OpenAIMessagesRoles {
  SYSTEM = "system",
  USER = "user",
  ASSISTANT = "assistant",
  TOOL = "tool",
  FUNCTION = "function",
}

export type OpenAISystemMessage = {
  role: OpenAIMessagesRoles.SYSTEM;
  content: string;
};

export type OpenAIUserMessage = {
  role: OpenAIMessagesRoles.USER;
  content: string;
};

export type OpenAIAssistantMessage = {
  role: OpenAIMessagesRoles.ASSISTANT;
  content: string;
};

export type OpenAIToolMessage = {
  role: OpenAIMessagesRoles.TOOL;
  content: string;
  tool_call_id: string;
};

export type OpenAIFunctionMessage = {
  role: OpenAIMessagesRoles.FUNCTION;
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
