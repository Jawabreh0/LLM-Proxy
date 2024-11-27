import { testNonStreamAnthropic } from "./testNonStreamAnthropic";
import { testNonStreamOpenAI } from "./testNonStreamOpenAI";
import { testStreamAnthropic } from "./testStreamAnthropic";
import { testStreamOpenAI } from "./testStreamOpenAI";

console.log("Starting tests...");

testNonStreamAnthropic();

testNonStreamOpenAI();

testStreamOpenAI()
  .then(() => console.log("Test execution completed"))
  .catch((error) => console.error("Test execution failed:", error));

testStreamAnthropic()
  .then(() => console.log("Test execution completed"))
  .catch((error) => console.error("Test execution failed:", error));
