function resetState(adapter: {
  isToolUseStream: boolean;
  toolArguments: string[];
  model: string | undefined;
  toolName: string | undefined;
}): void {
  const newAdapter = {
    ...adapter,
    isToolUseStream: false,
    toolArguments: [],
    model: undefined,
    toolName: undefined,
  };
  Object.assign(adapter, newAdapter);
}

export default resetState;
