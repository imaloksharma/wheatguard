import { useEffect, useState } from "react";
import { Play, Copy, Check, Cpu, Database, Settings2, Terminal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const YAML_CONFIG = `path: ../datasets/GlobalWheat2020
train:
  - images/arvalis_1
  - images/arvalis_2
  - images/arvalis_3
  - images/ethz_1
  - images/rres_1
  - images/inrae_1
  - images/usask_1
val:
  - images/ethz_1
test:
  - images/utokyo_1
  - images/utokyo_2
  - images/nau_1
  - images/uq_1

names:
  0: wheat_head`;

export default function Training() {
  const [model, setModel] = useState("yolo26n.pt");
  const [epochs, setEpochs] = useState(100);
  const [imgsz, setImgsz] = useState(640);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => { document.title = "Training Runner — WheatGuard"; }, []);

  const script = `from ultralytics import YOLO

model = YOLO("${model}")
results = model.train(data="GlobalWheat2020.yaml", epochs=${epochs}, imgsz=${imgsz})`;

  const copy = async () => {
    await navigator.clipboard.writeText(script);
    setCopied(true);
    toast.success("Script copied");
    setTimeout(() => setCopied(false), 1500);
  };

  const runSimulation = () => {
    setRunning(true);
    setProgress(0);
    setLogs([
      `▶ ultralytics YOLO ${model}`,
      `dataset: GlobalWheat2020.yaml (3,422 train · 748 val · 1,276 test)`,
      `imgsz=${imgsz} · epochs=${epochs}`,
      "─────────────────────────────────────",
    ]);

    let epoch = 0;
    const tick = () => {
      epoch += 1;
      const mAP = (0.42 + (epoch / epochs) * 0.45 + Math.random() * 0.02).toFixed(3);
      const loss = (1.8 - (epoch / epochs) * 1.2 + Math.random() * 0.05).toFixed(3);
      setLogs((l) => [
        ...l,
        `Epoch ${epoch}/${epochs}  box_loss=${loss}  mAP50=${mAP}`,
      ]);
      setProgress((epoch / epochs) * 100);
      if (epoch >= epochs) {
        setLogs((l) => [...l, "─────────────────────────────────────", "✅ Training complete · best.pt saved"]);
        setRunning(false);
        toast.success("Training run finished (simulated)");
      }
    };
    const interval = setInterval(() => {
      tick();
      if (epoch >= epochs) clearInterval(interval);
    }, Math.max(40, 2000 / epochs));
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <Cpu className="h-7 w-7 text-primary" />Training Runner
        </h1>
        <p className="text-muted-foreground text-sm">
          Configure and simulate a YOLO training run on the GlobalWheat2020 dataset.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4 flex items-center gap-3">
          <Database className="h-5 w-5 text-primary" />
          <div>
            <div className="text-xs text-muted-foreground">Dataset</div>
            <div className="font-semibold text-sm">GlobalWheat2020</div>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <Settings2 className="h-5 w-5 text-primary" />
          <div>
            <div className="text-xs text-muted-foreground">Classes</div>
            <div className="font-semibold text-sm">1 · wheat_head</div>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <Cpu className="h-5 w-5 text-primary" />
          <div>
            <div className="text-xs text-muted-foreground">Framework</div>
            <div className="font-semibold text-sm">Ultralytics YOLO</div>
          </div>
        </Card>
      </div>

      <Card className="p-5 space-y-4 shadow-card">
        <h2 className="font-semibold flex items-center gap-2"><Settings2 className="h-4 w-4" />Configuration</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="model">Model</Label>
            <Input id="model" value={model} onChange={(e) => setModel(e.target.value)} disabled={running} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="epochs">Epochs</Label>
            <Input id="epochs" type="number" min={1} max={500} value={epochs}
              onChange={(e) => setEpochs(Number(e.target.value) || 1)} disabled={running} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="imgsz">Image size</Label>
            <Input id="imgsz" type="number" min={160} step={32} value={imgsz}
              onChange={(e) => setImgsz(Number(e.target.value) || 640)} disabled={running} />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={runSimulation} disabled={running} size="lg" className="flex-1">
            <Play className="h-4 w-4 mr-2" />
            {running ? "Running…" : "Start Training (simulated)"}
          </Button>
          <Button variant="outline" size="lg" onClick={copy}>
            {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            Copy Python script
          </Button>
        </div>

        {(running || progress > 0) && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span className="tabular-nums">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}
      </Card>

      <Card className="p-5 space-y-3 shadow-card">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold flex items-center gap-2"><Terminal className="h-4 w-4" />Console</h2>
          <Badge variant="outline">{running ? "running" : logs.length ? "idle" : "ready"}</Badge>
        </div>
        <pre className="text-xs bg-muted/50 border border-border rounded-md p-3 max-h-72 overflow-auto font-mono whitespace-pre-wrap">
{logs.length ? logs.join("\n") : "No runs yet. Start a training run to see live logs here."}
        </pre>
      </Card>

      <Card className="p-5 space-y-2 shadow-card">
        <h2 className="font-semibold">GlobalWheat2020.yaml</h2>
        <pre className="text-xs bg-muted/50 border border-border rounded-md p-3 overflow-auto font-mono">{YAML_CONFIG}</pre>
        <p className="text-xs text-muted-foreground">
          Reference config saved in <code>datasets/GlobalWheat2020.yaml</code>.
        </p>
      </Card>
    </div>
  );
}
