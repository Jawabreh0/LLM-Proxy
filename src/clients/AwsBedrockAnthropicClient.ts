  import { config } from "../config/config";
  import { BedrockAnthropicResponse, Messages, SupportedLLMs } from "../types";
  import {
    InvokeModelCommand,
    BedrockRuntimeClient,
  } from "@aws-sdk/client-bedrock-runtime";
  import { ClientInterface } from "./ClientInterface";

  export class AwsBedrockAnthropicClient implements ClientInterface {
    private bedrock: BedrockRuntimeClient;

    constructor() {
      this.bedrock = new BedrockRuntimeClient({
        region: config.awsRegion,
        credentials: {
          accessKeyId: config.awsAccessKey,
          secretAccessKey: config.awsSecretKey,
        },
      });
    }

    async generateCompletion(
      messages: Messages,
      model?: SupportedLLMs,
      maxTokens?: number,
      temperature?: number,
      systemPrompt?: string,
      tools?: any
    ): Promise<BedrockAnthropicResponse> {
      const body = JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: maxTokens,
        temperature,
        messages,
        system: systemPrompt,
        ...(tools && tools.length > 0 ? { tools } : {}),
      });

      const command = new InvokeModelCommand({
        modelId: model,
        body,
        contentType: "application/json",
        accept: "application/json",
      });

      const response = await this.bedrock.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));

      return responseBody;
    }
  }
