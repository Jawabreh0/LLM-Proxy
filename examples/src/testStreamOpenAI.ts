import { generateLLMStreamResponse, OpenAIMessages } from "llm-proxy/dist";
import dotenv from "dotenv";
dotenv.config();

async function testStreamOpenAI() {
  try {
    const messages: OpenAIMessages = [
      {
        role: "system",
        content: "you are a helpful assistant",
      },
      {
        role: "user",
        content: "tell me short a story",
      },
    ];

    // The updated function call now uses an object format for parameters
    const stream = await generateLLMStreamResponse({
      messages: messages,
      model: "gpt-4o",
      max_tokens: 1000,
      temperature: 0.7,
      credentials: {
        apiKey: process.env.OPENAI_API_KEY,
      },
    });

    // Handle the stream and output the response in chunks
    for await (const chunk of stream) {
      if (!chunk) continue;
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
