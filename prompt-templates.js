import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0
});
import { ChatPromptTemplate } from "@langchain/core/prompts";
const systemTemplate = "Translate the following from English into {language}";

const promptTemplate = ChatPromptTemplate.fromMessages([
  ["system", systemTemplate],
  ["user", "{text}"],
]);

const promptValue = await promptTemplate.invoke({
  language: "spanish",
  text: "hi!",
});

promptValue;

promptValue.toChatMessages();

const response = await model.invoke(promptValue);
console.log(`${response.content}`);