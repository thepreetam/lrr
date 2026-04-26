"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Crown, 
  CheckCircle2, 
  XCircle,
  ArrowLeft,
  HeadphonesIcon
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const plans = [
  {
    name: "Starter",
    price: 39,
    priceLabel: "$39",
    interval: "per listing",
    description: "Perfect for trying out the service",
    features: [
      { text: "4 cinematic video reels", included: true },
      { text: "Professional voiceover", included: true },
      { text: "Auto-burned captions", included: true },
      { text: "Royalty-free background music", included: true },
      { text: "Agent branding overlay", included: true },
      { text: "MP4 download", included: true },
      { text: "Priority processing", included: false },
      { text: "Voice cloning", included: false },
      { text: "Unlimited generations", included: false },
    ],
    cta: "Get Started",
    popular: false,
    stripePriceId: "price_starter_onetime",
  },
  {
    name: "Pro Monthly",
    price: 59,
    priceLabel: "$59",
    interval: "per month",
    description: "For active real estate agents",
    features: [
      { text: "Unlimited reel generations", included: true },
      { text: "Priority processing", included: true },
      { text: "Voice cloning access", included: true },
      { text: "4 cinematic video reels", included: true },
      { text: "Professional voiceover", included: true },
      { text: "Auto-burned captions", included: true },
      { text: "Royalty-free background music", included: true },
      { text: "Agent branding overlay", included: true },
      { text: "MP4 download", included: true },
      { text: "Commercial license", included: true },
      { text: "Priority support", included: true },
    ],
    cta: "Start Free Trial",
    popular: true,
    stripePriceId: "price_pro_monthly",
  },
];

export default function PricingPage() {
  const router = useRouter();
  
  const handlePurchase = async (priceId: string) => {
    const supabase = createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push("/login?redirect=/pricing");
      return;
    }
    
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          userId: user.id,
        }),
      });
      
      const { url } = await response.json();
      if (url) {
        router.replace(url);
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[--navy] text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            LISTING REEL ROCKET
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:text-[--teal] hover:bg-white/10">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <Link href="/" className="inline-flex items-center text-white/60 hover:text-white mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Choose the plan that fits your business. Upgrade or downgrade anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {plans.map((plan) => (
            <Card 
              key={plan.name}
              className={`relative bg-white/5 border-white/10 p-8 ${
                plan.popular ? "border-[--teal] bg-gradient-to-br from-[--teal]/10 to-[--teal]/5" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-4 py-1 bg-[--teal] text-white text-sm font-medium rounded-full">
                    <Crown className="w-4 h-4" />
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-white/60 text-sm">{plan.description}</p>
              </div>
              
              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold">{plan.priceLabel}</span>
                  <span className="text-white/50">/{plan.interval}</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    {feature.included ? (
                      <CheckCircle2 className="w-5 h-5 text-[--teal] flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-white/30 flex-shrink-0" />
                    )}
                    <span className={feature.included ? "text-white" : "text-white/40"}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
              
              <Button
                className={`w-full h-12 text-lg ${
                  plan.popular 
                    ? "bg-[--teal] hover:bg-[--teal-dark]" 
                    : "bg-white/10 hover:bg-white/20 border border-white/20"
                }`}
                onClick={() => handlePurchase(plan.stripePriceId)}
              >
                {plan.cta}
              </Button>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            {[
              {
                q: "Can I cancel anytime?",
                a: "Yes! You can cancel your monthly subscription at any time. Your access will continue until the end of your billing period."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards through Stripe. For annual subscriptions, we can also accept wire transfers."
              },
              {
                q: "How long does video generation take?",
                a: "Most videos are ready in 1-2 minutes. Complex requests or high-demand periods may take slightly longer."
              },
              {
                q: "Can I use the videos for commercial purposes?",
                a: "Yes! Both plans include a commercial license. You can use the generated videos for your real estate business, social media, and marketing."
              },
              {
                q: "What happens to my videos if I cancel?",
                a: "Your generated videos remain yours forever. You can download them before canceling or contact support to request them."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                <p className="text-white/60">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-16">
          <p className="text-white/60 mb-4">Have questions?</p>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <HeadphonesIcon className="w-4 h-4 mr-2" />
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}