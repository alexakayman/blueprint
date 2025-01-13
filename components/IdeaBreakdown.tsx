import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";

interface Component {
  name: string;
  description: string;
  requirements: string[];
}

interface Service {
  name: string;
  description: string;
  requirements: string[];
}

interface PriorityLevel {
  frontend: {
    components: Component[];
  };
  backend: {
    services: Service[];
    dataModel: string[];
  };
}

interface DevelopmentPhase {
  phase: string;
  tasks: string[];
  priority: string;
}

interface Breakdown {
  overview: string;
  priorities: {
    p0: PriorityLevel;
    p1: PriorityLevel;
    p2: PriorityLevel;
  };
  developmentSteps: DevelopmentPhase[];
}

interface IdeaBreakdownProps {
  breakdown: Breakdown;
}

export default function IdeaBreakdown({ breakdown }: IdeaBreakdownProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "overview",
    "p0",
  ]);
  const [expandedComponents, setExpandedComponents] = useState<string[]>([]);

  const toggleSection = (sectionName: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionName)
        ? prev.filter((name) => name !== sectionName)
        : [...prev, sectionName]
    );
  };

  const toggleComponentExpansion = (componentName: string) => {
    setExpandedComponents((prev) =>
      prev.includes(componentName)
        ? prev.filter((name) => name !== componentName)
        : [...prev, componentName]
    );
  };

  const renderComponent = (component: Component, index: number) => (
    <Card key={index} className="mt-4 blueprint-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between blueprint-text">
          <span>{component.name}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleComponentExpansion(component.name)}
            className="blueprint-button"
          >
            {expandedComponents.includes(component.name) ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-2 blueprint-text">{component.description}</p>
        {expandedComponents.includes(component.name) && (
          <div>
            <h5 className="blueprint-subheading mb-2 mt-6">
              REQUIREMENTS & TOOLS:
            </h5>
            <ul className="list-disc pl-5 blueprint-text">
              {component.requirements.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderService = (service: Service, index: number) => (
    <Card key={index} className="mt-4 blueprint-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between blueprint-text">
          <span>{service.name}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleComponentExpansion(service.name)}
            className="blueprint-button"
          >
            {expandedComponents.includes(service.name) ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-2 blueprint-text">{service.description}</p>
        {expandedComponents.includes(service.name) && (
          <div>
            <h5 className="blueprint-subheading mb-2 mt-6">Requirements:</h5>
            <ul className="list-disc pl-5 blueprint-text">
              {service.requirements.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderPriorityLevel = (priority: "p0" | "p1" | "p2") => (
    <Card key={priority} className="mt-6 blueprint-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between blueprint-text">
          <span>Priority {priority.toUpperCase()}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleSection(priority)}
            className="blueprint-button"
          >
            {expandedSections.includes(priority) ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      {expandedSections.includes(priority) && (
        <CardContent>
          <h4 className="blueprint-subheading mt-6 mb-2">Source Collection:</h4>
          {breakdown.priorities[priority]?.frontend?.components?.map(
            (component, index) => renderComponent(component, index)
          ) || (
            <p className="blueprint-text">
              No source collection for this priority level.
            </p>
          )}
          <h4 className="blueprint-subheading mt-8">
            Evidence and Investigative Procedures:
          </h4>
          {breakdown.priorities[priority]?.backend?.services?.map(
            (service, index) => renderService(service, index)
          ) || (
            <p className="blueprint-text">
              No backend services for this priority level.
            </p>
          )}
          <div className="mt-4">
            <h4 className="blueprint-subheading mb-2 mt-8">Data Model:</h4>
            {breakdown.priorities[priority]?.backend?.dataModel?.length > 0 ? (
              <ul className="list-disc pl-5 blueprint-text">
                {breakdown.priorities[priority].backend.dataModel.map(
                  (item, index) => (
                    <li key={index}>{item}</li>
                  )
                )}
              </ul>
            ) : (
              <p className="blueprint-text">
                No data model defined for this priority level.
              </p>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card className="blueprint-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between blueprint-text">
            <span>Overview</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection("overview")}
              className="blueprint-button"
            >
              {expandedSections.includes("overview") ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        {expandedSections.includes("overview") && (
          <CardContent>
            <p className="blueprint-text pr-8">{breakdown.overview}</p>
          </CardContent>
        )}
      </Card>

      {renderPriorityLevel("p0")}
      {renderPriorityLevel("p1")}
      {renderPriorityLevel("p2")}

      <Card className="blueprint-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between blueprint-text">
            <span>Investigation Steps</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection("developmentSteps")}
              className="blueprint-button"
            >
              {expandedSections.includes("developmentSteps") ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        {expandedSections.includes("developmentSteps") && (
          <CardContent>
            {breakdown.developmentSteps.map((phase, index) => (
              <div key={index} className="mb-4 mt-6">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="blueprint-subheading">{phase.phase}</h4>
                  <Badge className="mx-1 blueprint-text bg-blue-200/10">
                    {phase.priority}
                  </Badge>
                </div>
                <ul className="list-disc pl-5 blueprint-text">
                  {phase.tasks.map((task, taskIndex) => (
                    <li key={taskIndex}>{task}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
