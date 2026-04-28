import { useEffect, useState } from "react";
import { History as HistoryIcon, Trash2, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Scan {
  id: string;
  image_url: string;
  disease: string;
  is_healthy: boolean;
  confidence: number | null;
  severity: string | null;
  description: string | null;
  treatment: string | null;
  created_at: string;
}

export default function History() {
  const { user } = useAuth();
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Scan History — WheatGuard";
    if (!user) return;
    supabase
      .from("scans").select("*").order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) toast.error(error.message);
        else setScans((data as Scan[]) || []);
        setLoading(false);
      });
  }, [user]);

  const remove = async (id: string) => {
    const { error } = await supabase.from("scans").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    setScans((s) => s.filter((x) => x.id !== id));
    toast.success("Scan removed");
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <HistoryIcon className="h-7 w-7 text-primary" />Scan History
        </h1>
        <p className="text-muted-foreground text-sm">All your past wheat disease detections.</p>
      </header>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : scans.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground">
          No scans yet. Upload a crop photo on the Detect page to get started.
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {scans.map((s) => (
            <Card key={s.id} className="overflow-hidden shadow-card">
              <div className="aspect-video bg-muted overflow-hidden">
                <img src={s.image_url} alt={s.disease} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {s.is_healthy ? (
                      <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
                    )}
                    <h3 className="font-semibold truncate">{s.disease}</h3>
                  </div>
                  {s.severity && <Badge variant="outline" className="capitalize shrink-0">{s.severity}</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(s.created_at).toLocaleString()} · {Math.round((s.confidence || 0) * 100)}% confidence
                </p>
                {s.description && <p className="text-sm line-clamp-2 text-muted-foreground">{s.description}</p>}
                <Button variant="ghost" size="sm" onClick={() => remove(s.id)} className="text-destructive hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5 mr-1" />Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
