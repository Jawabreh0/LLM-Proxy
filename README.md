# LLM Proxy

The main purpose of the project is to allow the users to make OpenAI compatabile request to any provider. In the background the LLM Proxy is going to figure out which provider your trying to user based on the passed model. 

For Example 

```javascript

const openaiFormatMessage = [
  {
    role: "system",
    content: "You are a helpful assistant.",
  },
  {
    role: "user",
    content: "What is the meaning of life?",
  },
];

const openaiCompatabilePayload = {
  messages: openaiFormatMessage,
  model: "anthropic.claude-3-sonnet-20240229-v1:0",
  maxTokens: 60,
  temperature: 0.5,
};

```

In this example the message is openai message, and the payload is also openai compatabile. But in fact the user is trying to communicate with Anthopic Sonnet on AWS.

The LLM Proxy is going to fnd out that your trying to communicate with Anthopic Sonnet on AWS and reformat the message and the payload to Anthropic compatabile one. 


![plan graph](docs/plan.png)
