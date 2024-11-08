// index.ts
import readline from "readline";
import { OpenAIChatExample } from "./examples/OpenAIChatExample";
import { config } from "./config/config";
import { OpenAISupportedLLMs, Providers } from "./types";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const providers = Object.values(Providers);
const models = Object.values(OpenAISupportedLLMs);
const temperatures = [0.3, 0.5, 0.7, 1.0];
const maxTokens = 100;

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

  const chatUtil = new OpenAIChatExample(config.openaiApiKey, systemPrompt);

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
