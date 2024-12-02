import { LLMResponse, Providers } from "../types";
import cacheModelAndTool from "../utils/outputFormatAdapterUtils/streamingResponseUtils/cacheModelAndTool";
import createNonToolUseResponse from "../utils/outputFormatAdapterUtils/streamingResponseUtils/createNonToolUseResponse";
import createToolUseResponse from "../utils/outputFormatAdapterUtils/streamingResponseUtils/createToolUseResponse";
import resetState from "../utils/outputFormatAdapterUtils/streamingResponseUtils/resetState";

export default class OutputFormatAdapter {
  public static isToolUseStream = false;

  public static toolArguments: string[] = [];

  public static model: string | undefined;

  public static toolName: string | undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static adaptResponse(response: any, provider: Providers): LLMResponse {
    if (!response) {
      throw new Error("Response object is null or undefined");
    }

    try {
      switch (provider) {
        case Providers.OPENAI:
          return response as LLMResponse;
        case Providers.ANTHROPIC_BEDROCK:
          return this.adaptStreamingResponse(response);
        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }
    } catch (error) {
      throw new Error(`Failed to adapt response: ${(error as Error).message}`);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static adaptStreamingResponse(chunk: any): any {
    const metrics = chunk["amazon-bedrock-invocationMetrics"];
    const isStop =
      chunk.type === "content_block_stop" || chunk.type === "message_stop";

    // Cache the model and tool usage details
    cacheModelAndTool(chunk, this);

    if (isStop) {
      const response = this.isToolUseStream
        ? createToolUseResponse(metrics, isStop, this)
        : createNonToolUseResponse(metrics, isStop, chunk, this);

      // Reset state after processing the end of the stream
      resetState(this);

      return response;
    }

    // Handle intermediate chunks
    return this.isToolUseStream
      ? createToolUseResponse(metrics, isStop, this)
      : createNonToolUseResponse(metrics, isStop, chunk, this);
  }
}
