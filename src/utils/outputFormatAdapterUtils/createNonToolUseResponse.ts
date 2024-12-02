function createNonToolUseResponse(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // TODO: fix the below any type
  metrics: any,
  isStop: boolean,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // TODO: fix the below any type
  chunk: any,
  adapter: { model: string | undefined }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // TODO: fix the below any type
): any {
  const content = chunk.content_block?.text || chunk.delta?.text || "";
  return {
    id: `stream-${Date.now()}`,
    object: "chat.completion.chunk",
    created: Date.now(),
    model: adapter.model || "unknown-model",
    choices: [
      {
        index: 0,
        delta: { content },
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

export default createNonToolUseResponse;
