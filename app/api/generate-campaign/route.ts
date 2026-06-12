import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { marketingGoal } = await req.json();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
You are an AI CRM strategist.

Marketing Goal:
${marketingGoal}

Generate a JSON response with:

{
  "name":"",
  "audience":"1500 customers",
  "reason":"",
  "channel":"",
  "message":"",
  "expectedOpenRate":"",
  "expectedClickRate":""
}

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