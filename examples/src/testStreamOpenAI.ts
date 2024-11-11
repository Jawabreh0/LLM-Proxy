import {
  generateLLMStreamResponse,
  OpenAIMessages,
  OpenAIMessagesRoles,
  OpenAISupportedLLMs,
} from "llm-proxy/dist";
import dotenv from "dotenv";
dotenv.config();

async function testStreamOpenAI() {
  try {
    const messages: OpenAIMessages = [
      {
        role: OpenAIMessagesRoles.USER,
        content: "tell me a story",
      },
    ];

    const stream = await generateLLMStreamResponse(
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

    for await (const chunk of stream) {
      // Use type assertion to access the delta property
      // TODO: this one is not supposed to be any, i guess we need to fix the type of the stream response in the package
      const deltaContent = (chunk.choices[0] as any).delta?.content;
      if (deltaContent) {
        process.stdout.write(deltaContent);
      }
    }
    console.log("\n"); // Add a newline at the end
  } catch (error) {
    console.error("Error:", error);
  }
}

export { testStreamOpenAI };
