import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const {
  marketingGoal,
  customerCount,
  orderCount,
} = await req.json();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
You are an AI CRM strategist.

Marketing Goal:
${marketingGoal}

Customer Count:
${customerCount}

Order Count:
${orderCount}

Generate a JSON response with:

{
  "name":"",
  "audience":"",
  "reason":"",
  "channel":"",
  "message":"",
  "expectedOpenRate":"",
  "expectedClickRate":""
}

Use the uploaded customer and order counts when generating
audience size, revenue estimates, and execution metrics.

The audience field must be based on the uploaded customer count.

For example:
If customerCount = 10,
the audience must not exceed 10 customers.

Never invent customer counts.

Return ONLY valid JSON.
`,
    });

    const text = response.text || "{}";

    const cleanText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return Response.json(JSON.parse(cleanText));
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to generate campaign" },
      { status: 500 }
    );
  }
}