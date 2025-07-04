import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";

const chatHistoryList = document.querySelector("#chat-history");
const chatInputField = document.querySelector("#llm-chat-input");
const chatSubmitButton = document.querySelector("#llm-chat-submit");

const chatHistory = [];

initializeLLM(chatHistory).then(() => {
    console.log(chatHistory);
});

document.querySelector("#llm-chat-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const userInputField = document.querySelector("#llm-chat-input");
    const userMessage = userInputField.ariaValueMax.trim();

    if(!userMessage) return;
    userInputField.value = "";

    addChatMessage(new HumanMessage(userMessage));

    document.dispatchEvent(new CustomEvent("chatResponseStart"));
    let botResponseEntry;

    try {
        botResponseEntry = await getChatResponce(chatHistory);
        if (botResponseEntry.startsWith("Error:")) {
            addChatMessage(
                new AIMessage(
                    "Oops, there was a problem: " + 
                    botResponseEntry.replace(/^Error:\s*/, "")
                )
            );
        } else {
            addChatMessage(new AIMessage(botResponseEntry));
        }
    } catch (exception) {
        const errorMessage = exception instanceof Error ? exception.message : "Unknown error";
        addChatMessage(new AIMessage("Error: " + errorMessage));
    } finally {
        document.dispatchEvent(new CustomEvent("chatResponseEnd"));
    }
    
});