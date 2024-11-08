// index.ts
import readline from "readline";
import { config } from "./config/config";
import { OpenAISupportedLLMs, Providers } from "./types";
import { OpenAIClient } from "./clients/OpenAIClient";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const providers = Object.values(Providers);
const models = Object.values(OpenAISupportedLLMs);
const temperatures = [0.3, 0.5, 0.7, 1.0];
const maxTokens = 1000;

const prompt = (query: string): Promise<string> => {
  return new Promise((resolve) => rl.question(query, resolve));
};

const main = async () => {
  console.log("Welcome! Please select a provider:");
  providers.forEach((provider, index) =>
    console.log(`${index + 1}. ${provider}`)
  );

  const providerChoice = parseInt(await prompt("Select provider (1): "), 10);
  const provider = providers[providerChoice - 1];
  if (provider !== Providers.OPENAI) {
    console.log("Invalid choice. Only OpenAI is available for now.");
    rl.close();
    return;
  }

  console.log("\nChoose a model:");
  models.forEach((model, index) => console.log(`${index + 1}. ${model}`));
  const modelChoice = parseInt(await prompt("Select model (1 or 2): "), 10);
  const model = models[modelChoice - 1] || models[0];

  console.log("\nChoose a temperature:");
  temperatures.forEach((temp, index) => console.log(`${index + 1}. ${temp}`));
  const temperatureChoice = parseInt(
    await prompt("Select temperature (1-4): "),
    10
  );
  const temperature = temperatures[temperatureChoice - 1] || temperatures[0];

  const systemPrompt = await prompt("\nEnter a system prompt: ");

  const chatUtil = new OpenAIClient(config.openaiApiKey, systemPrompt);

  // Choose interaction type
  console.log("\nSelect interaction type:");
  console.log("1. Non-streaming (full response)");
  console.log("2. Streaming (real-time response)");
  const interactionTypeChoice = parseInt(await prompt("Choose (1 or 2): "), 10);
  const useStreaming = interactionTypeChoice === 2;

  console.log('\nYou can start chatting now. Type "exit" to quit.\n');

  while (true) {
    const userInput = await prompt("You: ");
    if (userInput.toLowerCase() === "exit") break;

    if (useStreaming) {
      // Stream mode: respond with each token as it arrives
      console.log("Assistant: ");
      for await (const token of chatUtil.sendMessageStream(
        userInput,
        model,
        maxTokens,
        temperature
      )) {
        process.stdout.write(token); // Output each token incrementally
      }
      console.log(); // Newline after the response is complete
    } else {
      // Non-streaming mode: wait for full response
      const response = await chatUtil.sendMessage(
        userInput,
        model,
        maxTokens,
        temperature
      );
      console.log(`Assistant: ${response}`);
    }
  }

  rl.close();
};

main();

// async function exampleNonStreamingUsage() {
//   const apiKey = "--";
//   const systemPrompt = "You are an AI assistant.";
//   const openAIChat = new OpenAIChatExample(apiKey, systemPrompt);

//   const response = await openAIChat.sendMessage(
//     "Tell me a joke.",
//     OpenAISupportedLLMs.GPT_4_O_LAEST,
//     100,
//     0.7
//   );

//   console.log("Non-streaming response:", response);
// }

// async function exampleStreamingUsage() {
//   const apiKey = "--";
//   const systemPrompt = "You are an AI assistant.";
//   const openAIChat = new OpenAIChatExample(apiKey, systemPrompt);

//   console.log("Streaming response:");
//   for await (const content of openAIChat.sendMessageStream(
//     "Tell me a long story.",
//     OpenAISupportedLLMs.GPT_4_O_LAEST,
//     1000,
//     0.7
//   )) {
//     process.stdout.write(content); // Print each token as it arrives
//   }
// }

// // exampleStreamingUsage();
// async function exampleStreamingUsage() {
//   const systemPrompt = "You are an AI assistant.";
//   const model = BedrockAnthropicSupportedLLMs.CLAUDE_3_SONNET; // Replace with the exact model you need
//   const maxTokens = 1000;
//   const temperature = 0.7;

//   // Construct messages following the BedrockAnthropicMessages format
//   const messages: Messages = [
//     {
//       role: BedrockAnthropicMessageRole.USER, // Use correct role based on BedrockAnthropicMessageRole
//       content: [
//         {
//           type: BedrockAnthropicContentType.TEXT, // Use correct content type
//           text: "Tell me a long story.",
//         },
//       ],
//     },
//   ];

//   const bedrockChat = new AwsBedrockAnthropicChatExample();

//   console.log("Streaming response:");
//   for await (const content of bedrockChat.sendMessageStream(
//     messages,
//     model,
//     maxTokens,
//     temperature,
//     systemPrompt
//   )) {
//     if (content !== undefined) {
//       process.stdout.write(content); // Print each token as it arrives
//     }
//   }
// }

// // Call the function to test streaming output
// exampleStreamingUsage();
