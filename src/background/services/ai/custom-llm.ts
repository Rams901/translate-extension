import { ChatOllama } from "langchain/chat_models/ollama";
import { BaseMessage,  AIMessageChunk} from "@langchain/core/messages";

import {
    ChatGenerationChunk,
  } from "@langchain/core/outputs";
import { CallbackManagerForLLMRun } from "@langchain/core/callbacks/manager";


export class customOllama extends ChatOllama {
    async *_streamResponseChunks(
        input: BaseMessage[],
        options: this["ParsedCallOptions"],
        runManager?: CallbackManagerForLLMRun
      ): AsyncGenerator<ChatGenerationChunk> {
        try {

//const fetch = require('node-fetch');
//the content to be posted to the website is defined
// let todo = {
// text: "Bonjour" 
// };

// console.log(JSON.stringify(todo))
console.log(input[input.length - 1].content)
//the URL of the website to which the content must be posted is passed as a parameter to the fetch function along with specifying the method, body and header
var stream = await fetch('http://127.0.0.1:8000/translate/'+ '?text=' + input[input.length - 1].content, {
method: 'POST',

})
//then() function is used to convert the posted contents to the website into json format
.then((result: { json: () => any; }) => result.json())
//the posted contents to the website in json format is displayed as the output on the screen
.then((jsonformat: any)=>jsonformat);

stream = "Detected Language :" + stream.language + "\nTranslation Language: en\nText: " + stream.translation;
        
        // //         // Make the API request
        //         const response = await axios.post(
        //           "127.0.0.1:8000/translate",
        //           { text: prompt}// Adjust parameters as per API requirements
        //         );
        //         console.log(response.data, response.status);   
                // Check if the request was successful (status code 200)
                // if (response.status === 200) {
                //   // Access translated text from the response
                //   const stream = response.data.translated_text; // Adjust to match response structure
                  
                // } else {
                //   throw new Error(`Failed to translate text: ${response.statusText}`);
                // }
             
        //      // investigate Isloading, and also call the rest api here.

        // //   const stream = await this.caller.call(async () =>
        //     createOllamaChatStream(
        //       this.baseUrl,
        //       {
        //         ...this.invocationParams(options),
        //         messages: this._convertMessagesToOllamaMessages(input),
        //       },
        //       {
        //         ...options,
        //         headers: this.headers,
        //       }
        //     )
        //   );

          // The above code is the one to be changed with rest api, just needs to respect the output type
          // Try to change all format

          for await (const chunk of stream) {
            // if (!chunk.done) {
              yield new ChatGenerationChunk({
                text: chunk,
                message: new AIMessageChunk({ content: chunk }),
              });
              await runManager?.handleLLMNewToken(chunk ?? "");
            // } else {
            //   yield new ChatGenerationChunk({
            //     text: "",
            //     message: new AIMessageChunk({ content: "" }),
                // generationInfo: {
                //   model: chunk.model,
                //   total_duration: chunk.total_duration,
                //   load_duration: chunk.load_duration,
                //   prompt_eval_count: chunk.prompt_eval_count,
                //   prompt_eval_duration: chunk.prompt_eval_duration,
                //   eval_count: chunk.eval_count,
                //   eval_duration: chunk.eval_duration,
                // },
              
            
          }
          yield new ChatGenerationChunk({
            text: "",
            message: new AIMessageChunk({ content: "" }),
          });
        } catch (e: any) {
          if (e.response?.status === 404) {
            console.warn(
              "[WARNING]: It seems you are using a legacy version of Ollama. Please upgrade to a newer version for better chat support."
            );
            yield* this._streamResponseChunksLegacy(input, options, runManager);
          } else {
            throw e;
          }
        }
      }
    
    //   protected _convertMessagesToOllamaMessages(
    //     messages: BaseMessage[]

    //   ): OllamaMessage[] {
        
    //     return messages.map((message) => {
    //       let role;

    //       if (message._getType() === "human") {
    //         role = "user";
    //       } else if (message._getType() === "ai") {
    //         role = "assistant";
    //       } else if (message._getType() === "system") {
    //         role = "system";
    //       } else {
    //         throw new Error(
    //           `Unsupported message type for Ollama: ${message._getType()}`
    //         );
    //       }

    //       let content = "";

    //       const images = [];
    //       if (typeof message.content === "string") {
    //         content = message.content;
    //       } else {
    //         for (const contentPart of message.content) {
    //           if (contentPart.type === "text") {
    //             content = `${content}\n${contentPart.text}`;
    //           } else if (
    //             contentPart.type === "image_url" &&
    //             typeof contentPart.image_url === "string"
    //           ) {
    //             const imageUrlComponents = contentPart.image_url.split(",");
    //             // Support both data:image/jpeg;base64,<image> format as well
    //             images.push(imageUrlComponents[1] ?? imageUrlComponents[0]);
    //           } else {
    //             throw new Error(
    //               `Unsupported message content type. Must either have type "text" or type "image_url" with a string "image_url" field.`
    //             );
    //           }
    //         }
    //       }
    //       return {
    //         role,
    //         content,
    //         images,
    //       };
    //     });
      
}

