import { GoogleGenerativeAI } from "@google/generative-ai";

// Types imported from your types file
type OsintToolCategory =
  | "SOCIAL_MEDIA"
  | "DOMAIN_ANALYSIS"
  | "IMAGE_ANALYSIS"
  | "GEOLOCATION"
  | "DOCUMENT_ANALYSIS"
  | "NETWORK_ANALYSIS"
  | "CRYPTOCURRENCY"
  | "DARK_WEB";

interface OsintTool {
  name: string;
  category: OsintToolCategory;
  url?: string;
  description: string;
  requirements?: string[];
  automationPotential: boolean;
}

interface InvestigationStep {
  phase:
    | "PLANNING"
    | "COLLECTION"
    | "PROCESSING"
    | "ANALYSIS"
    | "DISSEMINATION";
  description: string;
  priority: "P0" | "P1" | "P2";
  estimatedTime?: string;
  tools: OsintTool[];
  tasks: string[];
  validationPoints?: string[];
}

interface OsintInvestigationPlan {
  overview: {
    idea: string;
    scope: string;
    constraints: string[];
    targetedOutcome: string;
  };
  riskAssessment: {
    legalRisks: string[];
    securityRisks: string[];
    mitigationStrategies: string[];
  };
  methodology: {
    approach: string;
    depthLevel: "SURFACE" | "MODERATE" | "DEEP";
    focusAreas?: string[];
  };
  investigationSteps: InvestigationStep[];
  dataSources: DataSource[];
  systemRequirements: {
    tools: OsintTool[];
    infrastructure: string[];
    security: string[];
  };
  timeline: {
    phases: Array<{
      name: string;
      duration: string;
      dependencies?: string[];
      deliverables: string[];
    }>;
  };
}

interface DataSource {
  type: string;
  description: string;
  reliability: "HIGH" | "MEDIUM" | "LOW";
  accessMethod: string;
  legalConsiderations?: string[];
}

if (!process.env.GOOGLE_AI_API_KEY) {
  throw new Error("Missing GOOGLE_AI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

// Validation helper
const validateOsintResponse = (json: any): json is OsintInvestigationPlan => {
  if (!json || typeof json !== "object") return false;

  // Required top-level fields
  const requiredFields = [
    "overview",
    "riskAssessment",
    "methodology",
    "investigationSteps",
    "dataSources",
    "systemRequirements",
    "timeline",
  ];

  if (!requiredFields.every((field) => field in json)) return false;

  // Validate overview structure
  if (
    !json.overview?.idea ||
    !json.overview?.scope ||
    !Array.isArray(json.overview?.constraints) ||
    !json.overview?.targetedOutcome
  ) {
    return false;
  }

  // Validate methodology
  if (
    !json.methodology?.approach ||
    !json.methodology?.depthLevel ||
    !["SURFACE", "MODERATE", "DEEP"].includes(json.methodology.depthLevel)
  ) {
    return false;
  }

  // Validate investigation steps
  if (
    !Array.isArray(json.investigationSteps) ||
    json.investigationSteps.length === 0
  ) {
    return false;
  }

  // Validate that each step has required fields
  const validPhases = [
    "PLANNING",
    "COLLECTION",
    "PROCESSING",
    "ANALYSIS",
    "DISSEMINATION",
  ];
  const validPriorities = ["P0", "P1", "P2"];

  return json.investigationSteps.every(
    (step: any) =>
      step.phase &&
      validPhases.includes(step.phase) &&
      step.priority &&
      validPriorities.includes(step.priority) &&
      Array.isArray(step.tools) &&
      Array.isArray(step.tasks)
  );
};

// The prompt template
const osintPromptTemplate = `
  Provide a comprehensive OSINT investigation plan for the following objective: "${idea}"
  
  Depth level: ${depthLevel}
  ${focusArea ? `Focus area: ${focusArea}` : ""}

  Format your response as a valid JSON object with this structure:
  {
    "overview": {
      "objective": "Brief statement of investigation goal",
      "scope": "Definition of investigation boundaries",
      "constraints": [
        "Time limitations",
        "Resource limitations",
        "Access limitations"
      ],
      "targetedOutcome": "Expected deliverables and results"
    },
    "riskAssessment": {
      "legalRisks": [
        "Privacy laws consideration",
        "Data protection regulations"
      ],
      "securityRisks": [
        "Digital footprint exposure",
        "Target counter-surveillance"
      ],
      "mitigationStrategies": [
        "Use of VPN/Proxy",
        "Data handling procedures"
      ]
    },
    "methodology": {
      "approach": "Description of investigation strategy",
      "depthLevel": "MODERATE",
      "focusAreas": [
        "Social media presence",
        "Financial connections"
      ]
    },
    "investigationSteps": [
      {
        "phase": "PLANNING",
        "description": "Initial investigation setup",
        "priority": "P0",
        "estimatedTime": "2 days",
        "tools": [
          {
            "name": "Maltego",
            "category": "NETWORK_ANALYSIS",
            "url": "https://www.maltego.com",
            "description": "Link analysis and data visualization",
            "automationPotential": true
          }
        ],
        "tasks": [
          "Define target entities",
          "Set up secure workspace"
        ],
        "validationPoints": [
          "Verified tool functionality",
          "Completed OPSEC checks"
        ]
      }
    ],
    "dataSources": [
      {
        "type": "Social Media",
        "description": "Public social network profiles",
        "reliability": "MEDIUM",
        "accessMethod": "Web scraping with API access",
        "legalConsiderations": [
          "Terms of Service compliance",
          "Data usage restrictions"
        ]
      }
    ],
    "systemRequirements": {
      "tools": [
        {
          "name": "Shodan",
          "category": "NETWORK_ANALYSIS",
          "description": "Internet device search engine",
          "automationPotential": true
        }
      ],
      "infrastructure": [
        "Secure VPN connection",
        "Virtual machines for isolation"
      ],
      "security": [
        "End-to-end encryption",
        "Secure data storage"
      ]
    },
    "timeline": {
      "phases": [
        {
          "name": "Initial Discovery",
          "duration": "1 week",
          "dependencies": [],
          "deliverables": [
            "Target profile",
            "Initial findings report"
          ]
        }
      ]
    }
  }

  Guidelines:
  1. Each investigation step must include specific OSINT tools and techniques
  2. P0 steps are critical for initial intelligence gathering
  3. P1 steps enhance the investigation with additional data points
  4. P2 steps cover advanced analysis and correlation
  5. Risk assessment must address legal and security considerations
  6. Timeline should be realistic and account for data collection constraints
  7. Tool recommendations should prioritize reliability and automation potential
  8. Data sources must be evaluated for reliability and accessibility
  9. Validation points should be included for quality control
  10. Response must be a valid JSON object only

  The plan should follow standard OSINT methodology while maintaining operational security.
`;

export async function POST(req: Request) {
  try {
    console.log("Google AI Key exists:", !!process.env.GOOGLE_AI_API_KEY);

    const { idea, depthLevel = 1, focusArea = null } = await req.json();
    if (!idea || typeof idea !== "string") {
      return Response.json({ error: "Invalid idea" }, { status: 400 });
    }

    if (!["SURFACE", "MODERATE", "DEEP"].includes(depthLevel)) {
      return Response.json({ error: "Invalid depth level" }, { status: 400 });
    }

    if (focusAreas && !Array.isArray(focusAreas)) {
      return Response.json(
        { error: "Focus areas must be an array" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Create prompt with proper template substitution
    const filledPrompt = osintPromptTemplate
      .replace("${idea}", idea)
      .replace("${depthLevel}", depthLevel)
      .replace(
        "${focusAreas ? `Focus areas: ${focusAreas.join(', ')}` : \"\"}",
        focusAreas.length > 0 ? `Focus areas: ${focusAreas.join(", ")}` : ""
      );

    const result = await model.generateContent(filledPrompt);
    const response = await result.response;
    const text = response.text();

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }

      const jsonStr = jsonMatch[0];
      const jsonResponse = JSON.parse(jsonStr);

      // Validate the response structure
      if (!validateOsintResponse(jsonResponse)) {
        throw new Error("Invalid OSINT investigation plan structure");
      }

      // Ensure all investigation steps have validation points
      const enhancedResponse = {
        ...jsonResponse,
        investigationSteps: jsonResponse.investigationSteps.map((step) => ({
          ...step,
          validationPoints: step.validationPoints || [
            "Verify data accuracy",
            "Check source reliability",
            "Confirm findings",
          ],
        })),
      };

      return Response.json(enhancedResponse);
    } catch (parseError) {
      console.error("Parse error:", parseError);
      console.error("Raw response:", text);

      return Response.json(
        {
          error: "Failed to parse the AI response",
          details:
            parseError instanceof Error
              ? parseError.message
              : "Unknown parsing error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API Error:", error);
    return Response.json(
      {
        error: "Failed to generate OSINT investigation plan",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
