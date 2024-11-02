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

export enum Providers {
  OPENAI = "OpenAI",
}

export enum OpenAISupportedLLMs {
  GPT_4_O_LAEST = "chatgpt-4o-latest", // points to the latest version of gpt-4o
  GPT_4_O = "gpt-4o",
  GPT_4_O_MINI = "gpt-4o-mini",
  GPT_4_TURBO = "gpt-4-turbo",
  GPT_4_TURBO_PREVIEW = "gpt-4-turbo-preview", // its same  as gpt-4-turbo-2024-04-09
  GPT_3_5_TURBO = "gpt-3.5-turbo", // its same as gpt-3.5-turbo-0125
}
