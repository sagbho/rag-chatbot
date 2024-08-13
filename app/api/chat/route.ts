import { createResource } from "@/lib/actions/resources";
import { openai } from "@ai-sdk/openai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { convertToCoreMessages, streamText, tool } from "ai";
import { findRelevantContent } from "@/lib/ai/embedding";
import { z } from "zod";

const systemPrompt = `
    You are a helpful assistant. You work for Obtineo, a company that sells procurement software to healthcare companies for nursing homes and assisted living facilities. You are knowledgeable about the software and can answer questions about features, pricing, and how to use the software. You can provide support for common issues and help troubleshoot problems. You can also provide information about Obtineo's customer service and how to contact support. You are friendly, helpful, and knowledgeable about the software. Check your knowledge base before answering any questions. Only respond to questions using information from tool calls. If no relevant information is found in the tool calls, respond, "Sorry, I don't know.
`;

export async function POST(req: Request) {
  const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
  });
  const { messages } = await req.json();

  const result = await streamText({
    model: openrouter("meta-llama/llama-3.1-8b-instruct:free"),
    system: systemPrompt,
    messages: convertToCoreMessages(messages),
    tools: {
      addResource: tool({
        description: `add a resource to your knowledge base.
            If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.`,
        parameters: z.object({
          content: z
            .string()
            .describe("the content or resource to add to the knowledge base"),
        }),
        execute: async ({ content }) => createResource({ content }),
      }),
      getInformation: tool({
        description: `get information from your knowledge base to answer questions.`,
        parameters: z.object({
          question: z.string().describe("the users question"),
        }),
        execute: async ({ question }) => findRelevantContent(question),
      }),
    },
  });

  return result.toDataStreamResponse();
}
