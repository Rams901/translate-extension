import { BaseLanguageModel } from "langchain/base_language";
import { ConversationChain } from "langchain/chains";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";
import { ChatPromptTemplate, MessagesPlaceholder } from "langchain/prompts";
import { BaseMessage } from "langchain/schema";

const SYSTEM_PROMPT =
  "The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.";

const chatPromptTemplate = ChatPromptTemplate.fromMessages([
  ["system", SYSTEM_PROMPT],
  new MessagesPlaceholder("history"),
  ["human", "{input}"],
]);

// Next step: Uploading a voice record
// when the user uploads a file to the extension what will happen is basically this:
// File gets uploaded to fire-base
// An internal call happens based on the url sent
// Small adjustments on the rest api end as well

// Langchain Purpose: to captivate a Large language model, and make it more accurate in answering
// Conversation Chain:

// {"System Message": "Discussion Context; Example: You're an AI Assistant that helps in retrieving recipes for Food.",
// "human": "Hi, I need a recipe for Lasagna"}
// {"System Message": "Discussion Context; Example: You're an AI Assistant that helps in retrieving recipes for Food.",
// "human": "Hi",
// "assitant": "Recipe Lasagna"}
// {"System Message": "Discussion Context; Example: You're an AI Assistant that helps in retrieving recipes for Food.",
// "human": "Hi",
// "assitant": "Recipe Lasagna"}

export async function executeGeneralChat(
  model: BaseLanguageModel,
  prompt: string,
  chatHistory: BaseMessage[],
  abortController: AbortController,
  onNewToken: (token: string) => void
): Promise<void> {
  const chain = new ConversationChain({
    llm: model,
    prompt: chatPromptTemplate,
    memory: new BufferMemory({
      chatHistory: new ChatMessageHistory(chatHistory),
      returnMessages: true,
    }),
  });
  await chain.call(
    {
      input: prompt,
      signal: abortController.signal,
    },
    {
      callbacks: [
        {
          handleLLMNewToken(token: string) {
            if (token) {
              onNewToken(token);
            }
          },
        },
      ],
    }
  );
}
