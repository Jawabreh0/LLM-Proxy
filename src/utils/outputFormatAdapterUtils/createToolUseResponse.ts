function createToolUseResponse(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metrics: any, // TODO: Resolve this any type
  isStop: boolean,
  adapter: {
    toolArguments: string[];
    model: string | undefined;
    toolName: string | undefined;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // TODO: fix the below any type
): any {
  return {
    id: `stream-${Date.now()}`,
    object: "chat.completion.chunk",
    created: Date.now(),
    model: adapter.model || "unknown-model",
    system_fingerprint: "anthropic_translation",
    choices: [
      {
        index: 0,
        delta: {
          function_call: {
            name: adapter.toolName || "unknown_tool",
            arguments: adapter.toolArguments.join(", "),
          },
        },
        logprobs: null,
        finish_reason: isStop ? "stop" : null,
      },
    ],
    usage: isStop
      ? {
          prompt_tokens: metrics?.inputTokenCount || 0,
          completion_tokens: metrics?.outputTokenCount || 0,
          total_tokens:
            (metrics?.inputTokenCount || 0) + (metrics?.outputTokenCount || 0),
        }
      : null,
  };
}

export default createToolUseResponse;
