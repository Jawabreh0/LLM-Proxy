import {
  generateLLMResponse,
  OpenAIMessages,
  OpenAIMessagesRoles,
  OpenAISupportedLLMs,
} from "llm-proxy/dist";
import dotenv from "dotenv";

dotenv.config();

async function testNonStreamOpenAI() {
  console.log("Starting non-streaming test...");

  try {
    const messages: OpenAIMessages = [
      {
        role: OpenAIMessagesRoles.USER,
        content: "tell me short a story",
      },
    ];

    const response = await generateLLMResponse(
      messages,
      {
        type: "OpenAI",
        model: OpenAISupportedLLMs.GPT_4_O,
      },
      1000,
      0.7,
      "You are a helpful assistant",
      [],
      {
        apiKey: process.env.OPENAI_API_KEY,
      }
    );

    console.log("Assistant Response:", response.choices[0].message.content);
    console.log("Usage:");
    console.log("Input", response.usage.prompt_tokens);
    console.log("Output Tokens", response.usage.completion_tokens);
  } catch (error) {
    console.error("OpenAI Error:", error);
  }
}

export { testNonStreamOpenAI };
