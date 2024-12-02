// eslint-disable-next-line @typescript-eslint/no-explicit-any
function cacheModelAndTool(chunk: any, adapter: any): void {
  const updatedAdapter = { ...adapter };

  if (chunk.type === "message_start" && chunk.message?.model) {
    updatedAdapter.model = chunk.message.model;
  }

  if (
    chunk.type === "content_block_start" &&
    chunk.content_block?.type === "tool_use"
  ) {
    updatedAdapter.isToolUseStream = true;
    updatedAdapter.toolName = chunk.content_block?.name || "unknown_tool";
  }

  if (
    chunk.type === "content_block_delta" &&
    chunk.delta?.type === "input_json_delta"
  ) {
    updatedAdapter.toolArguments.push(chunk.delta?.partial_json);
  }

  Object.assign(adapter, updatedAdapter);
}

export default cacheModelAndTool;
