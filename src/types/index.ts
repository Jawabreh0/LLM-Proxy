export enum OpenAIMessagesRole {
  SYSTEM = "system",
  USER = "user",
  ASSISTANT = "assistant",
  FUNCTION = "function",
}

export enum AnthropicMessagesRole { // TODO: Most probably this is wrong, check it back
  SYSTEM = "system",
  USER = "user",
  ASSISTANT = "assistant",
}

export type MessageRoles = OpenAIMessagesRole | AnthropicMessagesRole;

type Message = {
  role: MessageRoles;
  content: string;
};

export type Messages = Message[];
