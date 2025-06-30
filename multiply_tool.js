import {tool} from "@langchain/core/tools";
import {z} from "zod";
import { HumanMessage } from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0
});

const multiply = tool(
    ({a, b}) => {
       return a * b; 
    },
    {
        name: "multiply",
        description: "Multiply two numbers",
        schema: z.object({
            a: z.number(),
            b: z.number(),
        }),
    }
);

//binding the tools to the LLM
const llmWithTools = llm.bindTools([multiply]);

console.log("=== Example 1: Basic Tool Usage ===");
const response1 = await llmWithTools.invoke([
  new HumanMessage("What is 15 multiplied by 23?")
]);
await multiply.invoke({ a: 2, b: 3});

console.log("AI Response: ", response1.content);
console.log(response1.description);
console.log(multiply.name);
console.log(multiply.description);
//console.log("Tool calls: ", response1.tool_calls);