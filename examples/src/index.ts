import { testNonStreamAnthropic } from "./testNonStreamAnthropic";
import { testNonStreamOpenAI } from "./testNonStreamOpenAI";

import { testStreamAnthropic } from "./testStreamAnthropic";
import { testStreamOpenAI } from "./testStreamOpenAI";

// import { testStreamOpenAI } from "./testStreamOpenAI";

// testNonStreamAnthropic();
// testNonStreamOpenAI();

// testStreamOpenAI();

// testStreamOpenAI()
//   .then(() => console.log("Test execution completed"))
//   .catch((error) => console.error("Test execution failed:", error));

testStreamAnthropic()
  .then(() => console.log("Test execution completed"))
  .catch((error) => console.error("Test execution failed:", error));
