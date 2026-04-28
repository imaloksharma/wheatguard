import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Wheat, ScanLine, ShieldCheck, History as HistoryIcon, Sparkles, Camera,
  Leaf, Zap, Users, Mail, Phone, MapPin, Menu, X, ArrowRight, CheckCircle2,
  Database, Globe, Brain, Cpu, Image as ImageIcon, ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import heroIllustration from "@/assets/hero-illustration.png";
import featureScan from "@/assets/feature-scan.jpg";
import diseaseLeaf from "@/assets/disease-leaf.jpg";
import aboutFarmers from "@/assets/about-farmers.jpg";
import wheatIcon from "@/assets/wheat-icon.png";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "Diseases", href: "#diseases" },
  { label: "Dataset", href: "#dataset" },
  { label: "AI", href: "#ai" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const features = [
  { icon: ScanLine, title: "AI Disease Detection", desc: "Upload or capture a wheat leaf photo and get an instant diagnosis powered by advanced vision AI." },
  { icon: ShieldCheck, title: "Treatment Advice", desc: "Receive practical treatment recommendations and severity assessment for every detected disease." },
  { icon: HistoryIcon, title: "Scan History", desc: "All your scans are saved securely so you can track outbreaks and revisit past diagnoses anytime." },
  { icon: Camera, title: "Camera & Upload", desc: "Use your phone's camera in the field, or upload existing crop photos from your gallery." },
  { icon: Zap, title: "Fast Results", desc: "Get accurate diagnoses in seconds — no waiting, no lab tests required." },
  { icon: Leaf, title: "Healthy Crop Insights", desc: "Confirms when your wheat is healthy so you can focus resources where they're really needed." },
];

const diseases = [
  { name: "Leaf Rust", desc: "Orange-brown pustules on upper leaf surface, common in warm humid weather." },
  { name: "Stripe Rust", desc: "Yellow striped pustules along leaf veins, thrives in cool moist climates." },
  { name: "Stem Rust", desc: "Reddish-brown pustules on stems and leaves, can cause severe yield loss." },
  { name: "Powdery Mildew", desc: "White powdery patches on leaves and stems, reduces photosynthesis." },
  { name: "Septoria Blotch", desc: "Brown lesions with black specks, spreads from lower to upper leaves." },
  { name: "Loose Smut", desc: "Black powdery spores replace grain heads, seed-borne fungal disease." },
];

const steps = [
  { n: "1", title: "Sign up free", desc: "Create your WheatGuard account in seconds." },
  { n: "2", title: "Capture or upload", desc: "Take a clear photo of the affected wheat leaf." },
  { n: "3", title: "Get diagnosis", desc: "AI identifies the disease, severity, and treatment." },
  { n: "4", title: "Track over time", desc: "Save scans to your history and monitor crop health." },
];

export default function Landing() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.title = "WheatGuard — AI Wheat Disease Detection";
    const desc = "Detect wheat crop diseases instantly with AI. Upload a leaf photo and get diagnosis, severity, and treatment advice.";
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement("meta"); m.setAttribute("name", "description"); document.head.appendChild(m); }
    m.setAttribute("content", desc);
  }, []);

  const close = () => setOpen(false);
  const ctaHref = user ? "/app" : "/auth";
  const ctaLabel = user ? "Open App" : "Get Started";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Wheat className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold">WheatGuard</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <Button asChild><Link to="/app">Open App</Link></Button>
            ) : (
              <>
                <Button asChild variant="ghost"><Link to="/auth">Sign in</Link></Button>
                <Button asChild><Link to="/auth">Sign up</Link></Button>
              </>
            )}
          </div>

          <button className="md:hidden p-2 rounded-md hover:bg-accent" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map((l) => (
                <a key={l.href} href={l.href} onClick={close}
                  className="px-3 py-2 rounded-md text-sm hover:bg-accent">
                  {l.label}
                </a>
              ))}
              <div className="flex gap-2 pt-2">
                {user ? (
                  <Button asChild className="flex-1"><Link to="/app" onClick={close}>Open App</Link></Button>
                ) : (
                  <>
                    <Button asChild variant="outline" className="flex-1"><Link to="/auth" onClick={close}>Sign in</Link></Button>
                    <Button asChild className="flex-1"><Link to="/auth" onClick={close}>Sign up</Link></Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="home" className="relative overflow-hidden bg-hero-animated">
        {/* animated gradient blobs */}
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-primary/30 blur-3xl float-slower" />
        <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-primary-glow/30 blur-3xl float-slow" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-accent/60 blur-3xl float-slow" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32 grid md:grid-cols-2 gap-10 items-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card/80 backdrop-blur border border-border text-accent-foreground text-xs font-medium mb-4 shadow-card">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> AI-powered crop health
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
              Detect wheat diseases <span className="text-primary">instantly</span> with AI
            </h1>
            <p className="text-base md:text-lg text-muted-foreground mb-6 max-w-xl">
              Snap a photo of your wheat crop and WheatGuard identifies diseases like leaf rust, stripe rust,
              powdery mildew and more — with severity ratings and treatment guidance, in seconds.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="shadow-soft hover-scale">
                <Link to={ctaHref}>{ctaLabel} <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-card/70 backdrop-blur"><a href="#features">Learn more</a></Button>
            </div>
            <div className="flex flex-wrap gap-6 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Free to start</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Mobile-friendly</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Secure & private</div>
            </div>
          </div>

          {/* Illustration stack */}
          <div className="relative h-[420px] md:h-[520px] animate-fade-in">
            {/* glow disc */}
            <div className="absolute inset-0 m-auto h-72 w-72 md:h-96 md:w-96 rounded-full bg-gradient-primary opacity-20 blur-2xl" />
            {/* circular frame */}
            <div className="absolute inset-0 m-auto h-72 w-72 md:h-96 md:w-96 rounded-full border-2 border-dashed border-primary/30 float-slower" />
            {/* main wheat illustration */}
            <img
              src={heroIllustration}
              alt="Stylized wheat illustration"
              className="absolute inset-0 m-auto h-80 w-80 md:h-[440px] md:w-[440px] object-contain drop-shadow-xl float-slow"
              width={1024}
              height={1024}
            />
            {/* floating chip: detected */}
            <div className="absolute top-6 left-2 md:left-0 bg-card/90 backdrop-blur rounded-xl shadow-card p-3 flex items-center gap-2 animate-fade-in">
              <div className="h-9 w-9 rounded-lg bg-gradient-primary flex items-center justify-center">
                <ScanLine className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Detected</div>
                <div className="text-sm font-semibold">Leaf Rust · 94%</div>
              </div>
            </div>
            {/* floating chip: healthy */}
            <div className="absolute bottom-8 right-2 md:right-0 bg-card/90 backdrop-blur rounded-xl shadow-card p-3 flex items-center gap-2 animate-fade-in">
              <div className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Status</div>
                <div className="text-sm font-semibold">Healthy crop</div>
              </div>
            </div>
            {/* floating chip: AI vision */}
            <div className="hidden md:flex absolute top-1/2 right-4 -translate-y-1/2 bg-card/90 backdrop-blur rounded-full shadow-card px-3 py-1.5 items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium">AI vision</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative py-16 md:py-24 overflow-hidden">
        <img src={wheatIcon} alt="" aria-hidden className="absolute -top-10 -right-10 w-72 opacity-20 pointer-events-none" />
        <img src={wheatIcon} alt="" aria-hidden className="absolute -bottom-10 -left-10 w-72 opacity-10 pointer-events-none rotate-180" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium mb-3">
              <Sparkles className="h-3.5 w-3.5" /> Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Everything you need to protect your crop</h2>
            <p className="text-muted-foreground">Built for farmers, agronomists, and researchers.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <Card key={f.title} className="group p-6 shadow-card hover:shadow-soft hover:-translate-y-1 transition-all duration-300 border-border/60">
                <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 shadow-soft group-hover:scale-110 transition-transform">
                  <f.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-16 md:py-24 bg-secondary/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-soft opacity-50 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card text-accent-foreground text-xs font-medium mb-3 shadow-card">
              <Zap className="h-3.5 w-3.5 text-primary" /> Process
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">How it works</h2>
            <p className="text-muted-foreground">Diagnose your wheat in four simple steps.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">
            {steps.map((s, i) => (
              <Card key={s.n} className="relative p-6 shadow-card hover:shadow-soft transition-shadow">
                <div className="h-12 w-12 rounded-2xl bg-gradient-primary text-primary-foreground flex items-center justify-center font-bold text-lg mb-3 shadow-soft">
                  {s.n}
                </div>
                <h3 className="font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-1/2 -right-3 h-5 w-5 text-primary/40" />
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* DISEASES */}
      <section id="diseases" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 items-center mb-12">
            <div className="relative">
              <div className="absolute -top-4 -left-4 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
              <div className="relative rounded-3xl overflow-hidden shadow-soft border-4 border-card">
                <img
                  src={diseaseLeaf}
                  alt="Close-up of wheat leaf with rust disease spots"
                  className="w-full h-72 md:h-96 object-cover"
                  loading="lazy"
                  width={1024}
                  height={1024}
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-card rounded-xl shadow-card p-3 flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <Leaf className="h-4 w-4 text-destructive" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Severity</div>
                  <div className="text-sm font-semibold">Moderate</div>
                </div>
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium mb-3">
                <Leaf className="h-3.5 w-3.5" /> Disease library
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Diseases we detect</h2>
              <p className="text-muted-foreground mb-4">
                Trained on the most common and damaging wheat diseases worldwide. Catch outbreaks early
                and act before they spread across your field.
              </p>
              <div className="flex flex-wrap gap-2">
                {diseases.map((d) => (
                  <span key={d.name} className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                    {d.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {diseases.map((d) => (
              <Card key={d.name} className="p-6 shadow-card hover:shadow-soft transition-shadow border-l-4 border-l-primary">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
                    <Leaf className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-semibold">{d.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{d.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* DATASET CREDIBILITY */}
      <section id="dataset" className="py-16 md:py-24 bg-secondary/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-soft opacity-40 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card text-accent-foreground text-xs font-medium mb-3 shadow-card">
                <Database className="h-3.5 w-3.5 text-primary" /> Trusted training data
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Powered by <span className="text-primary">3,000+ training images</span> from the Global Wheat Detection dataset
              </h2>
              <p className="text-muted-foreground mb-4">
                Our detection model is grounded in research-grade data — over 3,000 high-resolution
                wheat field photos collected across multiple continents, growing seasons, and genotypes.
                This diversity helps WheatGuard generalize to your field, no matter where you farm.
              </p>
              <p className="text-muted-foreground mb-6">
                The Global Wheat Head Detection (GWHD) dataset is an open scientific benchmark used by
                researchers worldwide to advance crop phenotyping and AI in agriculture.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="outline" className="gap-2">
                  <a href="https://www.kaggle.com/c/global-wheat-detection" target="_blank" rel="noopener noreferrer">
                    View dataset on Kaggle <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="ghost" className="gap-2">
                  <a href="https://www.global-wheat.com/" target="_blank" rel="noopener noreferrer">
                    GWHD project <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 shadow-card bg-card">
                <ImageIcon className="h-6 w-6 text-primary mb-2" />
                <div className="text-3xl font-bold">3,000+</div>
                <div className="text-xs text-muted-foreground">Training images</div>
              </Card>
              <Card className="p-6 shadow-card bg-card">
                <Globe className="h-6 w-6 text-primary mb-2" />
                <div className="text-3xl font-bold">7+</div>
                <div className="text-xs text-muted-foreground">Countries covered</div>
              </Card>
              <Card className="p-6 shadow-card bg-card">
                <Wheat className="h-6 w-6 text-primary mb-2" />
                <div className="text-3xl font-bold">147k+</div>
                <div className="text-xs text-muted-foreground">Annotated wheat heads</div>
              </Card>
              <Card className="p-6 shadow-card bg-card">
                <ShieldCheck className="h-6 w-6 text-primary mb-2" />
                <div className="text-3xl font-bold">Open</div>
                <div className="text-xs text-muted-foreground">Research-grade data</div>
              </Card>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 text-center">
              Sample regions in the dataset
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {["France", "United Kingdom", "Switzerland", "Canada", "Australia", "Japan", "China", "USA"].map((r) => (
                <span key={r} className="px-4 py-2 rounded-full bg-card border border-border text-sm font-medium shadow-card">
                  🌾 {r}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI ENGINE */}
      <section id="ai" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium mb-3">
              <Brain className="h-3.5 w-3.5" /> AI Engine
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Powered by advanced <span className="text-primary">vision AI</span>
            </h2>
            <p className="text-muted-foreground">
              WheatGuard uses state-of-the-art multimodal AI to analyze your crop photos in real-time —
              no model training, no waiting, just instant diagnosis.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <Card className="p-6 shadow-card hover:shadow-soft transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 shadow-soft">
                <Brain className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Multimodal vision AI</h3>
              <p className="text-sm text-muted-foreground">
                Analyzes leaf color, texture, lesion patterns, and spread to identify diseases with
                high confidence.
              </p>
            </Card>
            <Card className="p-6 shadow-card hover:shadow-soft transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 shadow-soft">
                <Cpu className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Zero training required</h3>
              <p className="text-sm text-muted-foreground">
                No upfront model setup. Works out of the box on any wheat photo from any phone or camera.
              </p>
            </Card>
            <Card className="p-6 shadow-card hover:shadow-soft transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 shadow-soft">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Sub-second inference</h3>
              <p className="text-sm text-muted-foreground">
                Get diagnosis, severity, and treatment recommendations in seconds — even on slow networks.
              </p>
            </Card>
          </div>

          <div className="mt-10 text-center">
            <div className="inline-flex flex-wrap justify-center items-center gap-3 px-6 py-3 rounded-full bg-card border border-border shadow-card">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Trained insights from 3,000+ wheat field images</span>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-16 md:py-24 bg-secondary/40">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
          <div className="relative order-2 md:order-1">
            <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-primary-glow/30 blur-3xl" />
            <div className="relative rounded-3xl overflow-hidden shadow-soft border-4 border-card">
              <img
                src={aboutFarmers}
                alt="Farmers using a tablet in a wheat field"
                className="w-full h-80 md:h-[420px] object-cover"
                loading="lazy"
                width={1280}
                height={960}
              />
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card text-accent-foreground text-xs font-medium mb-3 shadow-card">
              <Users className="h-3.5 w-3.5 text-primary" /> About us
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built with farmers, for farmers</h2>
            <p className="text-muted-foreground mb-4">
              WheatGuard helps farmers identify wheat diseases early, when treatment is most effective.
              By combining computer vision with agronomy expertise, we deliver lab-grade accuracy from
              a single photo — no special equipment required.
            </p>
            <p className="text-muted-foreground mb-6">
              Our mission is to make crop health diagnostics affordable and accessible for every wheat
              grower, from smallholder farms to large estates.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4 text-center bg-card">
                <Users className="h-5 w-5 text-primary mx-auto mb-1" />
                <div className="text-xl font-bold">10k+</div>
                <div className="text-xs text-muted-foreground">Farmers helped</div>
              </Card>
              <Card className="p-4 text-center bg-card">
                <ScanLine className="h-5 w-5 text-primary mx-auto mb-1" />
                <div className="text-xl font-bold">50k+</div>
                <div className="text-xs text-muted-foreground">Scans completed</div>
              </Card>
              <Card className="p-4 text-center bg-card">
                <Leaf className="h-5 w-5 text-primary mx-auto mb-1" />
                <div className="text-xl font-bold">12+</div>
                <div className="text-xs text-muted-foreground">Diseases detected</div>
              </Card>
              <Card className="p-4 text-center bg-card">
                <ShieldCheck className="h-5 w-5 text-primary mx-auto mb-1" />
                <div className="text-xl font-bold">95%</div>
                <div className="text-xs text-muted-foreground">Accuracy</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="p-8 md:p-12 bg-gradient-primary text-center text-primary-foreground shadow-soft">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to protect your wheat crop?</h2>
            <p className="mb-6 opacity-90">Join WheatGuard today — free to get started.</p>
            <Button asChild size="lg" variant="secondary">
              <Link to={ctaHref}>{ctaLabel} <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </Card>
        </div>
      </section>

      {/* CONTACT / FOOTER */}
      <footer id="contact" className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Wheat className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold">WheatGuard</span>
            </div>
            <p className="text-sm text-muted-foreground">AI-powered wheat disease detection for healthier harvests.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-primary">Features</a></li>
              <li><a href="#how" className="hover:text-primary">How it works</a></li>
              <li><a href="#diseases" className="hover:text-primary">Diseases</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#about" className="hover:text-primary">About</a></li>
              <li><Link to="/auth" className="hover:text-primary">Sign in</Link></li>
              <li><Link to="/auth" className="hover:text-primary">Sign up</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> support@wheatguard.app</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +1 (555) 010-2024</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Global — remote</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} WheatGuard. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
