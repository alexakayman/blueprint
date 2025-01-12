import { Button } from "@/components/ui/button";

interface QueryHistoryProps {
  history: Array<{ idea: string; focusArea: string | null }>;
  currentIndex: number;
  onSelect: (index: number) => void;
}

export default function QueryHistory({
  history,
  currentIndex,
  onSelect,
}: QueryHistoryProps) {
  const truncateText = (text: string, maxLength: number = 24) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + "...";
  };

  return (
    <div className="mt-4 mb-6">
      <h2 className="blueprint-subheading mb-2">History</h2>
      <div className="flex flex-wrap gap-2">
        {history.map((query, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onSelect(index)}
            className={`max-w-[200px] truncate blueprint-button ${
              index === currentIndex ? "bg-blue-900/50 !border-blue-300/50" : ""
            }`}
            title={query.focusArea || query.idea}
          >
            {truncateText(query.focusArea || query.idea)}
          </Button>
        ))}
      </div>
    </div>
  );
}
