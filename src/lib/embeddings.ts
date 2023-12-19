import { RecordValues } from "@pinecone-database/pinecone";
import { OpenAIApi, Configuration } from "openai-edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

//TO-DO: Figure out how to improve rate limits
export async function getEmbeddings(text: string) {
  try {
    const response = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: text.replace(/\n/g, " "),
    });
    const result = await response.json();
    if (result.error) {
      throw result.error;
    }

    return result.data[0].embedding as RecordValues;
  } catch (error) {
    console.log("Error calling OpenAI embeddings. Error: ", error);
    throw error;
  }
}
