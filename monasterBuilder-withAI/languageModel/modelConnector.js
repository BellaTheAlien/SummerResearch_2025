import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { BaseMessage, ToolMessage, SystemMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";

const llmTemp = 0;

const sysPromt = "You are createing you own personalized monster. You\'ll have access to a few tools that can help you make your monster";


let tools = [];
let toolsByName = {};

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: llmTemp,
  maxRetries: 2,
});

let llmWithTools = null;

export function registerTool(tool) {
    if (toolsByName[tool.name] = tool);
    console.log("Tool Registered: ", tool.name);
}

export function initializeTools(){
    if(llmWithTools){
        console.error("Attempting to init tools when model is already bound!");
        return;
    }
    llmWithTools = LockManager.bindTools(tools);
    console.log("Bond following tools to LLM: ", object.keys(toolsByName));
}

export async function getChatResponce(ChatMessageHistory) {
    if (!llmWithTools) {
        throw new Error("LLM not initialized yet");
    }

    try {
        let response = await llmWithTools.invoke(ChatMessageHistory);
        console.log(
            `Message sent to LLM`,
            ChatMessageHistory,
            `and received: `,
            response
        );

        ChatMessageHistory.push(response);

        const calls = response.tool_calls ?? [];
        for (const toolCall of calls){
            const selectedTool = toolsByName[toolCall.name];
            if(!selectedTool){
                const msg = `Error: Unkown tool "${toolCall.name}".`;
                console.error(msg);
                ChatMessageHistory.push(
                    new ToolMessage({
                        name: toolCall.name,
                        content: msg,
                        tool_call_id: String(toolCall.id || ""),
                    })
                );
                continue;
            }
            try {
                const result = await selectedTool.invoke(toolCall.args);
                console.log(`Tool called ${toolCall.name} with result: ${result}`);

                ChatMessageHistory.push(
                    new ToolMessage({
                        name: toolCall.name,
                        constent: result,
                        tool_call_id: String(toolCall.id || ""),
                    })
                );
            } catch (toolError) {
                console.error(`Tool ${toolCall.name} failed:`, toolError);

                const errorMessage = 
                    `Error: Tool '${toolCall.name}' failed with args: ${JSON.stringify(toolCall.args)}.\n` +
                    `Details: ${toolError}. Please try again with different parameters.`;

                ChatMessageHistory.push(
                    new ToolMessage({
                        name: toolCall.name,
                        content: errorMessage,
                        tool_call_id: String(toolCall.id || ""),
                    })
                );
            }
        }

        if(calls.length > 0){
            response = await llmWithTools.invoke(ChatMessageHistory);
            console.log("Raw LLM response after tool calls: ", response);
        }

        let resultContent = response.constent;
        if (typeof resultContent !== "string") {
            console.log("Non-string AI response detected:", resultContent);
            resultContent = JSON.stringify(resultContent);
        }

        return resultContent;
    } catch (error){
        console.error("Error during tool call. CAN BREAK: ", error);
        return "Error communicating with model";
    }
}