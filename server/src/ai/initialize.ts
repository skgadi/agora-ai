import { createXai } from "@ai-sdk/xai";
import { generateText } from "ai";

import { GSK_SETTINGS_TO_INIT_AI } from "../services/library/types/data-transfer-protocls";

require("dotenv").config();

const myAPIKey = process.env.MY_API_KEY || "default_api_key"; // Replace with your actual API key

const xai = createXai({
  apiKey: myAPIKey,
});

export const initializeANewDiscussion = async (
  inData: GSK_SETTINGS_TO_INIT_AI
) => {
  const model = xai("grok-3");

  const result = await generateText({
    model,
    prompt: "Write a vegetarian lasagna recipe for 4 people.",
  });
  console.log(result);
};
