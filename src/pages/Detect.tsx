import { useEffect, useRef, useState } from "react";
import { Upload, Loader2, Camera, Wheat } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { DiagnosisCard, Diagnosis } from "@/components/DiagnosisCard";

export default function Detect() {
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => { document.title = "Detect Disease — WheatGuard"; }, []);

  const handleFile = async (file: File) => {
    if (!user) return;
    if (!file.type.startsWith("image/")) { toast.error("Please choose an image file"); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error("Image must be under 10MB"); return; }

    setDiagnosis(null);
    setPreview(URL.createObjectURL(file));
    setBusy(true);

    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("wheat-images").upload(path, file, {
        contentType: file.type,
      });
      if (upErr) throw upErr;
      const { data: { publicUrl } } = supabase.storage.from("wheat-images").getPublicUrl(path);
      setImageUrl(publicUrl);

      const { data, error } = await supabase.functions.invoke("detect-disease", {
        body: { imageUrl: publicUrl },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const d = data as Diagnosis;
      setDiagnosis(d);

      await supabase.from("scans").insert({
        user_id: user.id,
        image_url: publicUrl,
        disease: d.disease,
        is_healthy: d.is_healthy,
        confidence: d.confidence,
        severity: d.severity,
        description: d.description,
        treatment: d.treatment,
      });

      toast.success("Diagnosis complete");
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Detection failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <Wheat className="h-7 w-7 text-primary" />Detect Wheat Disease
        </h1>
        <p className="text-muted-foreground text-sm">Upload or take a photo of your crop to get an instant AI diagnosis.</p>
      </header>

      <Card className="p-6 shadow-card border-dashed border-2">
        <div className="flex flex-col items-center text-center space-y-4">
          {preview ? (
            <div className="w-full max-w-sm aspect-square rounded-xl overflow-hidden bg-muted">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center">
              <Upload className="h-8 w-8 text-primary" />
            </div>
          )}

          <div className="space-y-1">
            <p className="font-medium">{busy ? "Analyzing your crop…" : "Choose a crop photo"}</p>
            <p className="text-xs text-muted-foreground">JPG, PNG · up to 10MB</p>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <input
            id="camera-input"
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button onClick={() => fileRef.current?.click()} disabled={busy} size="lg">
              {busy ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
              Upload Image
            </Button>
            <Button
              variant="outline"
              size="lg"
              disabled={busy}
              onClick={() => document.getElementById("camera-input")?.click()}
            >
              <Camera className="h-4 w-4 mr-2" />Take Photo
            </Button>
          </div>
        </div>
      </Card>

      {diagnosis && imageUrl && <DiagnosisCard d={diagnosis} imageUrl={imageUrl} />}
    </div>
  );
}
