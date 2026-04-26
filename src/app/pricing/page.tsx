"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

const plans = [
  {
    name: "Professional",
    price: 39,
    priceLabel: "$39",
    interval: "one-time",
    description: "Perfect for trying out the service",
    features: [
      { text: "5 Photos → 4 Cinematic Reels", included: true },
      { text: "1080p export", included: true },
      { text: "Full branding + captions + music", included: true },
      { text: "One listing", included: true },
    ],
    cta: "Buy $39 Pack — Instant Access",
    popular: true,
    stripePriceId: "price_starter_onetime",
  },
  {
    name: "Unlimited",
    price: 59,
    priceLabel: "$59",
    interval: "mo",
    description: "For active real estate agents",
    features: [
      { text: "Unlimited generations", included: true },
      { text: "Priority rendering", included: true },
      { text: "Voice cloning", included: true },
      { text: "Team seats (coming soon)", included: true },
    ],
    cta: "Start $59/mo — Cancel anytime",
    popular: false,
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-zinc-300">
        <div className="max-w-7xl mx-auto px-12 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight font-['Space_Grotesk']">
            LISTING REEL ROCKET
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-zinc-400 hover:text-zinc-900">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-12 py-16">
        <Link href="/" className="inline-flex items-center text-zinc-500 hover:text-zinc-900 mb-8 font-['Space_Grotesk'] uppercase text-[13px]">
          ← Back to home
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-[48px] font-['Space_Grotesk'] font-light mb-4 uppercase" style={{ letterSpacing: '-0.02em' }}>Simple Pricing</h1>
          <p className="text-zinc-500 max-w-2xl mx-auto font-['Inter']">
            No contracts. No surprises. Just powerful videos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative p-12 bg-white flex flex-col ${
                plan.popular ? "border-2 border-black" : "border border-zinc-300"
              }`}
            >
              <div className="mb-8">
                <div className={`text-[12px] uppercase tracking-widest mb-2 font-['Inter'] ${plan.popular ? "text-black" : "text-zinc-500"}`}>
                  {plan.name}
                </div>
                <div className="text-[48px] font-['Space_Grotesk'] font-light">
                  ${plan.price}<span className="text-[24px]"> {plan.interval}</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-12 flex-grow font-['Inter']">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">check</span>
                    {feature.text}
                  </li>
                ))}
              </ul>
              
              <Button
                className={`w-full py-4 font-['Space_Grotesk'] text-[24px] ${
                  plan.popular 
                    ? "bg-black text-white hover:bg-white hover:text-black border-2 border-black" 
                    : "border border-zinc-400 hover:bg-zinc-100"
                }`}
                onClick={() => handlePurchase(plan.stripePriceId)}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-[32px] font-['Space_Grotesk'] mb-8 text-center">Frequently Asked Questions</h2>
          
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
              <div key={i} className="border border-zinc-200 rounded-lg p-6">
                <h3 className="font-['Space_Grotesk'] font-medium text-lg mb-2">{faq.q}</h3>
                <p className="text-zinc-500 font-['Inter']">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-16">
          <p className="text-zinc-500 mb-4 font-['Inter']">Have questions?</p>
          <Button variant="outline" className="border-zinc-300 text-zinc-900 hover:bg-zinc-100">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}