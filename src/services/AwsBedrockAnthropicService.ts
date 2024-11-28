import {
  InvokeModelCommand,
  BedrockRuntimeClient,
  InvokeModelWithResponseStreamCommand,
} from "@aws-sdk/client-bedrock-runtime";
import {
  BedrockAnthropicParsedChunk,
  BedrockAnthropicResponse,
  Messages,
} from "../types";
import { ClientService } from "./ClientService";

export default class AwsBedrockAnthropicService implements ClientService {
  private bedrock: BedrockRuntimeClient;

  constructor(awsAccessKey: string, awsSecretKey: string, region: string) {
    this.bedrock = new BedrockRuntimeClient({
      region,
      credentials: {
        accessKeyId: awsAccessKey,
        secretAccessKey: awsSecretKey,
      },
    });
  }

  async generateCompletion(params: {
    messages: Messages;
    model: string;
    max_tokens?: number;
    temperature?: number;
    systemPrompt?: string;
  }): Promise<BedrockAnthropicResponse> {
    const { messages, model, max_tokens, temperature, systemPrompt } = params;

    if (!model) {
      return Promise.reject(
        "Model ID is required for AwsBedrockAnthropicService"
      );
    }

    const body = JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens,
      temperature,
      messages,
      system: systemPrompt,
    });

    const command = new InvokeModelCommand({
      modelId: model,
      body,
      contentType: "application/json",
      accept: "application/json",
    });

    const response = await this.bedrock.send(command);
    return JSON.parse(new TextDecoder().decode(response.body));
  }

  async *generateStreamCompletion(params: {
    messages: Messages;
    model: string;
    max_tokens?: number;
    temperature?: number;
    systemPrompt?: string;
  }): AsyncGenerator<BedrockAnthropicParsedChunk, void, unknown> {
    const { messages, model, max_tokens, temperature, systemPrompt } = params;

    if (!model) {
      return Promise.reject(
        "Model ID is required for AwsBedrockAnthropicService"
      );
    }

    const body = JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens,
      temperature,
      messages,
      system: systemPrompt,
    });

    const command = new InvokeModelWithResponseStreamCommand({
      modelId: model,
      body,
      contentType: "application/json",
      accept: "application/json",
    });

    const response = await this.bedrock.send(command);

    if (response.body) {
      const decoder = new TextDecoder("utf-8");

      for await (const payload of response.body) {
        const decodedString = decoder.decode(payload.chunk?.bytes, {
          stream: true,
        });

        try {
          const jsonObject = JSON.parse(decodedString);
          yield jsonObject;
        } catch (error) {
          return Promise.reject(error);
        }
      }
    }
  }
}
