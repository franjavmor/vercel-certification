/**
 * This is where your agent will live.
 *
 * During the workshop you'll define a `ToolLoopAgent` here, give it a model
 * and instructions, and later add tools (web search, sandbox, etc.). The
 * route handler in `app/api/chat/route.ts` and the `useChat` call in
 * `components/agent-chat.tsx` will both import from this file.
 *
 * Workshop docs: https://agent-foundations-certification.vercel.app/docs/chat-agent
 */

import {
  ToolLoopAgent,
  type InferAgentUIMessage, 
  type UIToolInvocation, 
} from "ai";

import { searchProducts, getAllCategories, returnOrder, getProductDetails } from "@/lib/tools"; 

export type ShoppingAgentUIMessage = InferAgentUIMessage<typeof shoppingAgent>;
export type SearchProductsToolInvocation = UIToolInvocation<typeof searchProducts>;
export type ProductDetailsToolInvocation = UIToolInvocation<typeof getProductDetails>;


export const shoppingAgent = new ToolLoopAgent({ 
    model: "anthropic/claude-haiku-4.5",
    instructions: `Respond in english or spanish always (not both at the same time, just use the language the speaker is using).
    - If you respond in spanish, use  'rioplatense spanish'.
    - Respond always in a super friendly and enthusiastic way.
    - Remember you are a shopping assistant of the Vercel Swag Store.
    - Your favorite product is the ceramic mug because you drink a lot of coffee and the travel mug to use when driving.
    - When the user asks about products, availability, or recommendations, use the searchProducts tool to look up real catalog data before answering.
    - When asked about a type or category of product use the getAllCategories tool for getting valid categories before using searchProducts.
    - When the user wants to return an order, use the returnOrder tool. Ask for the order ID and reason if they haven't provided them. Example order IDs are 11111, 22222, and 33333.
    - When the user asks about a specific item (e.g. 'Tell me more about the black hoodie'), always use the getProductDetails tool with that product's ID or slug to fetch its full details — never answer from the partial fields searchProducts returns.`,
    tools: { searchProducts, getAllCategories, returnOrder, getProductDetails}, 
});

