import { useEffect, useState } from "react";
import { History as HistoryIcon, Trash2, CheckCircle2, AlertTriangle, Loader2, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

  const downloadSinglePdf = (s: Scan, index: number) => {
    try {
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();

      doc.setFillColor(31, 122, 58);
      doc.rect(0, 0, pageW, 70, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.text("WheatGuard — Scan Report", 40, 35);
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 40, 55);

      autoTable(doc, {
        startY: 100,
        head: [["Field", "Value"]],
        body: [
          ["Scan ID", s.id],
          ["Crop", "Wheat"],
          ["Detected Disease", s.disease],
          ["Status", s.is_healthy ? "Healthy" : "Disease Detected"],
          ["Confidence", `${Math.round((s.confidence || 0) * 100)}%`],
          ["Severity", s.severity || "—"],
          ["Timestamp", new Date(s.created_at).toLocaleString()],
          ["Description", s.description || "—"],
          ["Treatment", s.treatment || "—"],
        ],
        styles: { fontSize: 10, cellPadding: 8, valign: "top" },
        headStyles: { fillColor: [31, 122, 58], textColor: 255 },
        columnStyles: { 0: { cellWidth: 130, fontStyle: "bold" } },
      });

      const safeName = s.disease.replace(/[^a-z0-9]+/gi, "-").toLowerCase().slice(0, 40);
      doc.save(`wheatguard-scan-${index + 1}-${safeName}.pdf`);
      toast.success("Scan report downloaded");
    } catch {
      toast.error("Failed to generate PDF");
    }
  };

  const downloadPdf = () => {
    if (scans.length === 0) {
      toast.error("No scans to export");
      return;
    }
    try {
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();

      doc.setFillColor(31, 122, 58);
      doc.rect(0, 0, pageW, 70, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.text("WheatGuard — Crop Detection Report", 40, 35);
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 40, 55);

      doc.setTextColor(40, 40, 40);
      doc.setFontSize(11);
      doc.text(`Total scans: ${scans.length}`, 40, 95);

      autoTable(doc, {
        startY: 110,
        head: [["#", "Crop", "Detected Disease", "Confidence / Result", "Timestamp"]],
        body: scans.map((s, i) => [
          String(i + 1),
          "Wheat",
          s.disease,
          `${Math.round((s.confidence || 0) * 100)}%${s.severity ? ` • ${s.severity}` : ""}`,
          new Date(s.created_at).toLocaleString(),
        ]),
        styles: { fontSize: 9, cellPadding: 6 },
        headStyles: { fillColor: [31, 122, 58], textColor: 255 },
        alternateRowStyles: { fillColor: [243, 248, 244] },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 60 },
          3: { cellWidth: 110 },
          4: { cellWidth: 130 },
        },
      });

      doc.save(`wheatguard-report-${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success("Report downloaded");
    } catch (e) {
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <h1 className="text-xl sm:text-3xl font-bold flex items-center gap-2">
            <HistoryIcon className="h-6 w-6 sm:h-7 sm:w-7 text-primary shrink-0" />
            <span className="truncate">Scan History</span>
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm">All your past wheat disease detections.</p>
        </div>
        <Button
          onClick={downloadPdf}
          disabled={scans.length === 0}
          className="w-full sm:w-auto shrink-0"
          size="sm"
        >
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </header>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : scans.length === 0 ? (
        <Card className="p-8 sm:p-12 text-center text-muted-foreground text-sm">
          No scans yet. Upload a crop photo on the Detect page to get started.
        </Card>
      ) : (
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
          {scans.map((s) => (
            <Card key={s.id} className="overflow-hidden shadow-card">
              <div className="aspect-video bg-muted overflow-hidden">
                <img src={s.image_url} alt={s.disease} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-3 sm:p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {s.is_healthy ? (
                      <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
                    )}
                    <h3 className="font-semibold truncate text-sm sm:text-base">{s.disease}</h3>
                  </div>
                  {s.severity && <Badge variant="outline" className="capitalize shrink-0 text-[10px] sm:text-xs">{s.severity}</Badge>}
                </div>
                <p className="text-[11px] sm:text-xs text-muted-foreground break-words">
                  {new Date(s.created_at).toLocaleString()} · {Math.round((s.confidence || 0) * 100)}% confidence
                </p>
                {s.description && <p className="text-xs sm:text-sm line-clamp-2 text-muted-foreground">{s.description}</p>}
                <div className="flex flex-wrap items-center gap-1 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadSinglePdf(s, scans.indexOf(s))}
                    className="h-8 px-2 text-xs"
                  >
                    <Download className="h-3.5 w-3.5 mr-1" />PDF
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => remove(s.id)} className="text-destructive hover:text-destructive h-8 px-2 text-xs">
                    <Trash2 className="h-3.5 w-3.5 mr-1" />Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
