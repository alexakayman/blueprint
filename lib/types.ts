// Core types for OSINT tools and resources
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

// Investigation phases and steps
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

interface DataSource {
  type: string;
  description: string;
  reliability: "HIGH" | "MEDIUM" | "LOW";
  accessMethod: string;
  legalConsiderations?: string[];
}

// Main investigation plan structure
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
