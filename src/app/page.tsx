import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Play, 
  Zap, 
  Video, 
  Music, 
  Type, 
  Download, 
  Crown, 
  CheckCircle2,
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[--navy] text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            LISTING REEL ROCKET
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-white/70 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-white/70 hover:text-white transition-colors">
              How It Works
            </Link>
            <Link href="/pricing" className="text-white/70 hover:text-white transition-colors">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:text-[--teal] hover:bg-white/10">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-[--teal] hover:bg-[--teal-dark] text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[--navy] via-[--navy-light] to-[--navy]" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[--teal] rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-[--teal-light] rounded-full blur-[150px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8">
              <Sparkles className="w-4 h-4 text-[--teal]" />
              <span className="text-sm">AI-Powered Video Generation</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
              Cinematic Listing Reels in{" "}
              <span className="text-[--teal]">Under 2 Minutes</span>
            </h1>
            
            <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
              Upload your property photos and get 4 stunning, branded cinematic videos 
              with voiceover, music, and auto-captions. No editing skills required.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="bg-[--teal] hover:bg-[--teal-dark] text-white text-lg px-8 h-14">
                  Start Creating Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 h-14">
                  See How It Works
                </Button>
              </Link>
            </div>
            
            <p className="text-sm text-white/50 mt-6">
              No credit card required for trial
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-[--navy-light]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Stand Out</h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Professional-quality video marketing without the expensive production crew
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Play,
                title: "Cinematic Motion",
                description: "AI-powered smooth camera movements and transitions that make your listings feel premium"
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Generate 4 completed videos in under 2 minutes with our optimized AI pipeline"
              },
              {
                icon: Video,
                title: "Voiceover",
                description: "Natural-sounding AI voiceovers that highlight your property's best features"
              },
              {
                icon: Type,
                title: "Auto Captions",
                description: "Burned-in captions ensure your message lands even on silent autoplay"
              },
              {
                icon: Music,
                title: "Royalty-Free Music",
                description: "Curated ambient tracks that enhance without distracting from your listing"
              },
              {
                icon: Download,
                title: "Easy Downloads",
                description: "Download individual videos or all 4 at once as ready-to-share MP4s"
              }
            ].map((feature, i) => (
              <Card key={i} className="bg-white/5 border-white/10 hover:border-[--teal]/50 transition-colors">
                <CardHeader>
                  <feature.icon className="w-10 h-10 text-[--teal] mb-3" />
                  <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/60">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-[--navy]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple 3-Step Process</h2>
            <p className="text-xl text-white/60">
              From photos to viral-ready videos in minutes
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Upload Your Photos",
                description: "Drag & drop 5-10 listing photos or paste a property address"
              },
              {
                step: "02",
                title: "AI Generates Your Reels",
                description: "Our AI creates 4 unique cinematic variations with voiceover & music"
              },
              {
                step: "03",
                title: "Download & Share",
                description: "Get your videos ready for social media, MLS, and email marketing"
              }
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-8xl font-bold text-white/5 absolute -top-4 -left-2">
                  {item.step}
                </div>
                <div className="relative pt-12">
                  <h3 className="text-2xl font-bold mb-3 text-[--teal]">{item.title}</h3>
                  <p className="text-white/60 text-lg">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-24 bg-[--navy-light]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-white/60">
              One-time or monthly plans to fit your business
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* One-time */}
            <Card className="bg-white/5 border-white/10 p-8">
              <div className="text-center">
                <p className="text-[--teal] font-medium mb-2">One-Time Purchase</p>
                <div className="flex items-baseline justify-center gap-2 mb-4">
                  <span className="text-5xl font-bold">$39</span>
                  <span className="text-white/50">/ listing</span>
                </div>
                <p className="text-white/60 mb-8">Perfect for occasional use</p>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "4 cinematic video reels",
                  "Voiceover included",
                  "Auto-burned captions",
                  "Royalty-free music",
                  "Agent branding overlay",
                  "MP4 download"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[--teal]" />
                    <span className="text-white/80">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <Button className="w-full bg-white/10 hover:bg-white/20 border border-white/20">
                  Get Started
                </Button>
              </Link>
            </Card>
            
            {/* Monthly */}
            <Card className="bg-gradient-to-br from-[--teal]/20 to-[--teal]/5 border-[--teal] p-8 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 px-4 py-1 bg-[--teal] text-white text-sm font-medium rounded-full">
                  <Crown className="w-4 h-4" />
                  Most Popular
                </span>
              </div>
              <div className="text-center">
                <p className="text-[--teal] font-medium mb-2">Monthly Subscription</p>
                <div className="flex items-baseline justify-center gap-2 mb-4">
                  <span className="text-5xl font-bold">$59</span>
                  <span className="text-white/50">/ month</span>
                </div>
                <p className="text-white/60 mb-8">For active agents</p>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Unlimited reel generations",
                  "Priority processing",
                  "Voice cloning access",
                  "All one-time features",
                  "Commercial license",
                  "Priority support"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[--teal]" />
                    <span className="text-white/80">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <Button className="w-full bg-[--teal] hover:bg-[--teal-dark]">
                  Start Free Trial
                </Button>
              </Link>
            </Card>
          </div>
          
          <p className="text-center text-white/40 mt-8">
            <Link href="/pricing" className="hover:text-white underline">View full pricing details</Link>
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[--navy]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Listings?</h2>
          <p className="text-xl text-white/60 mb-10">
            Join thousands of real estate agents creating stunning video content in minutes
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-[--teal] hover:bg-[--teal-dark] text-white text-lg px-10 h-14">
              Create Your First Reel Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40">© 2026 Listing Reel Rocket. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-white/40 hover:text-white text-sm">Privacy</Link>
              <Link href="/terms" className="text-white/40 hover:text-white text-sm">Terms</Link>
              <Link href="/contact" className="text-white/40 hover:text-white text-sm">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}