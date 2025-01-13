import { GoogleGenerativeAI } from "@google/generative-ai";
if (!process.env.GOOGLE_AI_API_KEY) {
  throw new Error("Missing GOOGLE_AI_API_KEY environment variable");
}
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
export async function POST(req: Request) {
  try {
    console.log("Google AI Key exists:", !!process.env.GOOGLE_AI_API_KEY);
    const { idea, depth = 1, focusArea = null } = await req.json();
    if (!idea || typeof idea !== "string") {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `
      Provide a comprehensive breakdown for the following open source investigation goal: "${idea}"
      
      Depth level: ${depth}
      ${focusArea ? `Focus area: ${focusArea}` : ""}
      Format your response as a valid JSON object with this structure:
      {
        "overview": "High-level overview of the tasks for this open source investigation. Do not use markdown formatting or special characters.",
        "priorities": {
          "p0": {
            "frontend": {
              "components": [
                {
                  "name": "Component name",
                  "description": "Brief description without markdown or special characters",
                  "requirements": ["List of key requirements"]
                }
              ]
            },
            "backend": {
              "services": [
                {
                  "name": "Service name",
                  "description": "Brief description without markdown or special characters",
                  "requirements": ["List of key requirements"]
                }
              ],
              "dataModel": ["Key data entities and their relationships"]
            }
          },
          "p1": {
            "frontend": { "components": [] },
            "backend": { "services": [], "dataModel": [] }
          },
          "p2": {
            "frontend": { "components": [] },
            "backend": { "services": [], "dataModel": [] }
          }
        },
        "systemArchitecture": {
          "components": ["List of popular tools to use"],
          "connections": ["List of connections or data sources to keep an eye on"],
          "dataFlow": ["Description of data flow between component tools and data connections"]
        },
        "developmentSteps": [
          {
            "phase": "Phase name",
            "tasks": ["List of specific tasks to complete"],
            "priority": "P0/P1/P2"
          }
        ]
      }
      Rules:
      1. Focus on concrete, actionable information for investigating the concept at hand.
      2. P0 should include only the most critical steps for surface level source collection.
      3. P1 should include important steps for identifying actual suspects.
      4. P2 should include nice-to-have features or future enhancements to monitoring or specific steps for finding evidence or tracking suspects.
      5. For each priority level, provide 2-4 frontend steps (source collection and surface level investigations steps) and 1-3 backend (deep, investigative steps) services.
      6. The systemArchitecture should provide a clear overview of how components interact.
      7. Outline 3-4 investigation phases with specific tasks and priority levels.
      8. Adjust the detail level based on the depth parameter.
      9. If a focus area is provided, provide more details for that specific area.
      10. Do not use markdown formatting or special characters in any text fields.
      11. Response must be ONLY the JSON object, no other text.
    `;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      const jsonStr = jsonMatch[0];
      const jsonResponse = JSON.parse(jsonStr);
      // Basic validation of the response structure
      if (
        !jsonResponse.overview ||
        !jsonResponse.priorities ||
        !jsonResponse.systemArchitecture ||
        !jsonResponse.developmentSteps
      ) {
        throw new Error("Invalid response structure");
      }
      // Ensure all priority levels exist
      const priorities = ["p0", "p1", "p2"];
      priorities.forEach((priority) => {
        if (!jsonResponse.priorities[priority]) {
          jsonResponse.priorities[priority] = {
            frontend: { components: [] },
            backend: { services: [], dataModel: [] },
          };
        }
      });
      return Response.json(jsonResponse);
    } catch (parseError) {
      console.error("Parse error:", parseError);
      console.error("Raw response:", text);
      return Response.json(
        { error: "Failed to parse the AI response. Please try again." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API Error:", error);
    return Response.json(
      { error: "Failed to process the idea. Please try again." },
      { status: 500 }
    );
  }
}
