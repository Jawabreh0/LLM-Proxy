import { testNonStreamOpenAI } from "./testNonStreamOpenAI";

testNonStreamOpenAI();
// async function testBedrock() {
//   try {
//     const messages: BedrockAnthropicMessages = [
//       {
//         role: BedrockAnthropicMessageRole.USER,
//         content: [
//           {
//             type: BedrockAnthropicContentType.TEXT,
//             text: "Say hello!",
//           },
//         ],
//       },
//     ];

//     const response = await generateLLMResponse(
//       messages,
//       {
//         type: "BedrockAnthropic",
//         model: BedrockAnthropicSupportedLLMs.CLAUDE_3_HAIKU,
//       },
//       100,
//       0.7,
//       "You are a helpful assistant",
//       [],
//       {
//         awsConfig: {
//           accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//           secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//           region: process.env.AWS_REGION!,
//         },
//       }
//     );

//     console.log("Bedrock Response:", response);
//   } catch (error) {
//     console.error("Bedrock Error:", error);
//   }
// }
