import { CheckCircle2, AlertTriangle, Sprout } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface Diagnosis {
  disease: string;
  is_healthy: boolean;
  confidence: number;
  severity: string;
  description: string;
  treatment: string;
}

const severityColor: Record<string, string> = {
  none: "bg-success/15 text-success border-success/30",
  mild: "bg-warning/15 text-warning border-warning/30",
  moderate: "bg-warning/20 text-warning border-warning/40",
  severe: "bg-destructive/15 text-destructive border-destructive/30",
};

export function DiagnosisCard({ d, imageUrl }: { d: Diagnosis; imageUrl?: string }) {
  return (
    <Card className="overflow-hidden shadow-card">
      {imageUrl && (
        <div className="aspect-video bg-muted overflow-hidden">
          <img src={imageUrl} alt="Analyzed crop" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            {d.is_healthy ? (
              <CheckCircle2 className="h-5 w-5 text-success" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-warning" />
            )}
            <h3 className="text-lg font-semibold">{d.disease}</h3>
          </div>
          <Badge variant="outline" className={severityColor[d.severity] || ""}>
            {d.severity}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Confidence:</span>
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-gradient-primary" style={{ width: `${Math.round(d.confidence * 100)}%` }} />
          </div>
          <span className="font-medium tabular-nums">{Math.round(d.confidence * 100)}%</span>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-1">Symptoms</h4>
          <p className="text-sm text-muted-foreground">{d.description}</p>
        </div>

        <div className="rounded-lg bg-accent/50 p-3 border border-accent">
          <h4 className="text-sm font-semibold mb-1 flex items-center gap-1.5">
            <Sprout className="h-4 w-4 text-primary" />Treatment & Care
          </h4>
          <p className="text-sm text-foreground/80">{d.treatment}</p>
        </div>
      </div>
    </Card>
  );
}
