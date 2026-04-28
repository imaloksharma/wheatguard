import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Wheat, ScanLine, ShieldCheck, History as HistoryIcon, Sparkles, Camera,
  Leaf, Zap, Users, Mail, Phone, MapPin, Menu, X, ArrowRight, CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "Diseases", href: "#diseases" },
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
      <section id="home" className="bg-gradient-soft">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium mb-4">
              <Sparkles className="h-3.5 w-3.5" /> AI-powered crop health
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Detect wheat diseases <span className="text-primary">instantly</span> with AI
            </h1>
            <p className="text-base md:text-lg text-muted-foreground mb-6 max-w-xl">
              Snap a photo of your wheat crop and WheatGuard identifies diseases like leaf rust, stripe rust,
              powdery mildew and more — with severity ratings and treatment guidance, in seconds.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to={ctaHref}>{ctaLabel} <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline"><a href="#features">Learn more</a></Button>
            </div>
            <div className="flex flex-wrap gap-6 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Free to start</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Mobile-friendly</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Secure & private</div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square max-w-md mx-auto rounded-3xl bg-gradient-primary p-1 shadow-soft">
              <div className="w-full h-full rounded-[1.4rem] bg-card flex items-center justify-center">
                <div className="text-center p-8">
                  <Wheat className="h-24 w-24 text-primary mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">Smart wheat protection</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Everything you need to protect your crop</h2>
            <p className="text-muted-foreground">Built for farmers, agronomists, and researchers.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <Card key={f.title} className="p-6 shadow-card hover:shadow-soft transition-shadow">
                <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-16 md:py-24 bg-secondary/40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">How it works</h2>
            <p className="text-muted-foreground">Diagnose your wheat in four simple steps.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((s) => (
              <Card key={s.n} className="p-6 shadow-card">
                <div className="h-10 w-10 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center font-bold mb-3">
                  {s.n}
                </div>
                <h3 className="font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* DISEASES */}
      <section id="diseases" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Diseases we detect</h2>
            <p className="text-muted-foreground">Trained on the most common and damaging wheat diseases worldwide.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {diseases.map((d) => (
              <Card key={d.name} className="p-6 shadow-card">
                <div className="flex items-center gap-2 mb-2">
                  <Leaf className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">{d.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{d.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-16 md:py-24 bg-secondary/40">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">About WheatGuard</h2>
            <p className="text-muted-foreground mb-4">
              WheatGuard helps farmers identify wheat diseases early, when treatment is most effective.
              By combining computer vision with agronomy expertise, we deliver lab-grade accuracy from
              a single photo — no special equipment required.
            </p>
            <p className="text-muted-foreground">
              Our mission is to make crop health diagnostics affordable and accessible for every wheat
              grower, from smallholder farms to large estates.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6 text-center">
              <Users className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">10k+</div>
              <div className="text-xs text-muted-foreground">Farmers helped</div>
            </Card>
            <Card className="p-6 text-center">
              <ScanLine className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">50k+</div>
              <div className="text-xs text-muted-foreground">Scans completed</div>
            </Card>
            <Card className="p-6 text-center">
              <Leaf className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">12+</div>
              <div className="text-xs text-muted-foreground">Diseases detected</div>
            </Card>
            <Card className="p-6 text-center">
              <ShieldCheck className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">95%</div>
              <div className="text-xs text-muted-foreground">Accuracy</div>
            </Card>
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
