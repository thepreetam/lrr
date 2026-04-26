import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-zinc-300 fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-12 py-4 flex justify-between items-center">
          <div className="text-lg font-bold tracking-tighter text-zinc-900 font-['Space_Grotesk']">
            LISTING REEL ROCKET
          </div>
          <div className="hidden md:flex gap-8">
            <Link href="#how-it-works" className="font-['Space_Grotesk'] uppercase tracking-widest text-[13px] text-zinc-400 hover:text-zinc-900 px-2">
              How It Works
            </Link>
            <Link href="#pricing" className="font-['Space_Grotesk'] uppercase tracking-widest text-[13px] text-zinc-400 hover:text-zinc-900 px-2">
              Pricing
            </Link>
            <Link href="#reviews" className="font-['Space_Grotesk'] uppercase tracking-widest text-[13px] text-zinc-400 hover:text-zinc-900 px-2">
              Reviews
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="font-['Space_Grotesk'] uppercase tracking-widest text-[13px] text-zinc-400 hover:text-zinc-900">
                Log In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="font-['Space_Grotesk'] uppercase tracking-widest text-[13px] bg-black text-white hover:bg-white hover:text-black border-2 border-black">
                Start Project
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24">
        {/* Hero Section */}
        <section className="px-12 mb-32 relative">
          <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6 border-l border-zinc-200">
            <div className="col-span-12 md:col-span-7 flex flex-col justify-center py-12 pr-12">
              <div className="text-[12px] uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2 font-['Inter']">
                <span className="w-2 h-2 bg-black"></span> Join 1,247+ agents this month
              </div>
              <h1 className="text-[48px] leading-[1.1] tracking-tight font-light mb-8 max-w-2xl font-['Space_Grotesk']" style={{ letterSpacing: '-0.02em' }}>
                5 Photos → 4 Cinematic Listing Reels in &lt;2 Minutes
              </h1>
              <p className="text-[18px] leading-[1.6] text-zinc-500 max-w-lg mb-12 font-['Inter']">
                Turn any listing into scroll-stopping Instagram, TikTok & Zillow reels instantly. Your branding, your voice, ready to post. No videographer needed.
              </p>
              <div className="flex gap-4 mb-8">
                <Link href="/signup">
                  <Button className="px-8 py-4 border-2 border-black font-['Space_Grotesk'] text-[24px] bg-black text-white hover:bg-white hover:text-black uppercase">
                    Get 4 Videos for $39 — Instant Access
                  </Button>
                </Link>
                <Button variant="outline" className="px-8 py-4 border border-zinc-400 font-['Space_Grotesk'] text-[24px] hover:bg-zinc-100">
                  Watch 45-Second Demo
                </Button>
              </div>
              <div className="text-[11px] text-zinc-500">
                Trusted by 1,247+ agents • Average 4.9/5 • Used on 8,400+ listings this month
              </div>
            </div>
            <div className="col-span-12 md:col-span-5 relative min-h-[400px] border border-zinc-200 p-8 flex items-center justify-center bg-white">
              <div className="absolute top-0 right-0 p-2 text-[11px] border-l border-b border-zinc-200">COORD: 40.7128° N, 74.0060° W</div>
              <div className="w-full aspect-square border border-zinc-100 relative overflow-hidden flex items-center justify-center bg-zinc-50">
                <div className="w-3/4 h-3/4 border border-black relative flex items-center justify-center">
                  <div className="absolute -top-3 -left-3 w-3 h-3 border border-black"></div>
                  <div className="absolute -top-3 -right-3 w-3 h-3 border border-black"></div>
                  <div className="absolute -bottom-3 -left-3 w-3 h-3 border border-black"></div>
                  <div className="absolute -bottom-3 -right-3 w-3 h-3 border border-black"></div>
                  <div className="text-[11px] text-black bg-white px-2 font-['Inter']">REF_FRAME_A1</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="px-12 py-32 border-t border-zinc-300 bg-zinc-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-baseline mb-16 border-b border-zinc-300 pb-4">
              <h2 className="text-[32px] font-['Space_Grotesk'] uppercase">How It Works</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Step 1 */}
              <div className="border border-zinc-300 p-8 bg-white relative">
                <div className="text-[48px] text-zinc-100 absolute top-4 right-4 leading-none font-['Space_Grotesk'] font-light">01</div>
                <div className="mb-6">
                  <span className="material-symbols-outlined text-4xl">upload_file</span>
                </div>
                <h3 className="text-[24px] font-['Space_Grotesk'] font-medium mb-4 uppercase">Upload Photos</h3>
                <p className="text-zinc-500">Upload 5–10 property photos or paste any listing link</p>
              </div>
              {/* Step 2 */}
              <div className="border border-zinc-300 p-8 bg-white relative">
                <div className="text-[48px] text-zinc-100 absolute top-4 right-4 leading-none font-['Space_Grotesk'] font-light">02</div>
                <div className="mb-6">
                  <span className="material-symbols-outlined text-4xl">precision_manufacturing</span>
                </div>
                <h3 className="text-[24px] font-['Space_Grotesk'] font-medium mb-4 uppercase">AI Creates</h3>
                <p className="text-zinc-500">AI instantly creates 4 unique cinematic tours with voiceover + captions</p>
              </div>
              {/* Step 3 */}
              <div className="border border-zinc-300 p-8 bg-white relative">
                <div className="text-[48px] text-zinc-100 absolute top-4 right-4 leading-none font-['Space_Grotesk'] font-light">03</div>
                <div className="mb-6">
                  <span className="material-symbols-outlined text-4xl">movie_edit</span>
                </div>
                <h3 className="text-[24px] font-['Space_Grotesk'] font-medium mb-4 uppercase">Download</h3>
                <p className="text-zinc-500">Download 4 ready-to-post MP4s with your logo & contact info</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-12 py-32 border-t border-zinc-300">
          <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4 border-r border-zinc-300 pr-12 mb-12 md:mb-0">
              <h2 className="text-[32px] font-['Space_Grotesk'] mb-8">Why Agents Love It</h2>
              <div className="h-24 w-1 border-l-4 border-black"></div>
              <p className="text-zinc-500 mt-8">Join 1,247+ agents who&apos;ve saved over $2.1M on videography costs this year alone.</p>
            </div>
            <div className="col-span-12 md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-300 border border-zinc-300">
              {/* Feature 1 */}
              <div className="bg-white p-8 hover:bg-zinc-50">
                <span className="material-symbols-outlined mb-4 text-zinc-400">savings</span>
                <div className="text-[12px] uppercase tracking-widest mb-1 text-zinc-400 font-['Inter']">BENEFIT_01</div>
                <h4 className="text-[18px] font-['Space_Grotesk'] font-bold mb-2 uppercase">Save $500+ per listing</h4>
                <p className="text-zinc-500">No more videographers or editors. Your videos are ready in minutes.</p>
              </div>
              {/* Feature 2 */}
              <div className="bg-white p-8 hover:bg-zinc-50">
                <span className="material-symbols-outlined mb-4 text-zinc-400">autorenew</span>
                <div className="text-[12px] uppercase tracking-widest mb-1 text-zinc-400 font-['Inter']">BENEFIT_02</div>
                <h4 className="text-[18px] font-['Space_Grotesk'] font-bold mb-2 uppercase">4 unique styles every time</h4>
                <p className="text-zinc-500">Luxury reveal, family tour, backyard oasis, kitchen flow — pick your favorite.</p>
              </div>
              {/* Feature 3 */}
              <div className="bg-white p-8 hover:bg-zinc-50">
                <span className="material-symbols-outlined mb-4 text-zinc-400">badge</span>
                <div className="text-[12px] uppercase tracking-widest mb-1 text-zinc-400 font-['Inter']">BENEFIT_03</div>
                <h4 className="text-[18px] font-['Space_Grotesk'] font-bold mb-2 uppercase">Your branding included</h4>
                <p className="text-zinc-500">Logo, name, phone & agency automatically added to every frame.</p>
              </div>
              {/* Feature 4 */}
              <div className="bg-white p-8 hover:bg-zinc-50">
                <span className="material-symbols-outlined mb-4 text-zinc-400">record_voice_over</span>
                <div className="text-[12px] uppercase tracking-widest mb-1 text-zinc-400 font-['Inter']">BENEFIT_04</div>
                <h4 className="text-[18px] font-['Space_Grotesk'] font-bold mb-2 uppercase">Sounds like you</h4>
                <p className="text-zinc-500">Use your own voice or choose from our pro narrators.</p>
              </div>
              {/* Feature 5 */}
              <div className="bg-white p-8 hover:bg-zinc-50">
                <span className="material-symbols-outlined mb-4 text-zinc-400">vertical_align_bottom</span>
                <div className="text-[12px] uppercase tracking-widest mb-1 text-zinc-400 font-['Inter']">BENEFIT_05</div>
                <h4 className="text-[18px] font-['Space_Grotesk'] font-bold mb-2 uppercase">Perfect for Reels</h4>
                <p className="text-zinc-500">Vertical 9:16, captions baked in, trending music included.</p>
              </div>
              {/* Feature 6 */}
              <div className="bg-white p-8 hover:bg-zinc-50">
                <span className="material-symbols-outlined mb-4 text-zinc-400">bolt</span>
                <div className="text-[12px] uppercase tracking-widest mb-1 text-zinc-400 font-['Inter']">BENEFIT_06</div>
                <h4 className="text-[18px] font-['Space_Grotesk'] font-bold mb-2 uppercase">Under 2 minutes</h4>
                <p className="text-zinc-500">From upload to download — your reels are ready before you finish your coffee.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="px-12 py-32 bg-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 -z-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, #f3f3f3 5px, #f3f3f3 6px)' }}></div>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-[32px] font-['Space_Grotesk'] uppercase mb-4">Simple Pricing</h2>
              <p className="text-zinc-500">No contracts. No surprises. Just powerful videos.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Pro Tier */}
              <div className="border-2 border-black p-12 bg-white relative flex flex-col">
                <div className="mb-8">
                  <div className="text-[12px] uppercase tracking-widest text-black mb-2 font-['Inter']">Professional</div>
                  <div className="text-[48px] font-['Space_Grotesk'] font-light">
                    $39<span className="text-[24px]"> one-time</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-12 flex-grow font-['Inter']">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">check</span> 5 Photos → 4 Cinematic Reels
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">check</span> 1080p export
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">check</span> Full branding + captions + music
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">check</span> One listing
                  </li>
                </ul>
                <Link href="/signup">
                  <Button className="w-full py-4 border-2 border-black font-['Space_Grotesk'] text-[24px] bg-black text-white hover:bg-white hover:text-black uppercase">
                    Buy $39 Pack — Instant Access
                  </Button>
                </Link>
              </div>
              {/* Enterprise Tier */}
              <div className="border border-zinc-300 p-12 bg-white relative flex flex-col">
                <div className="mb-8">
                  <div className="text-[12px] uppercase tracking-widest text-zinc-500 mb-2 font-['Inter']">Unlimited</div>
                  <div className="text-[48px] font-['Space_Grotesk'] font-light">
                    $59<span className="text-[24px]">/mo</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-12 flex-grow font-['Inter']">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">check</span> Unlimited generations
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">check</span> Priority rendering
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">check</span> Voice cloning
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">check</span> Team seats (coming soon)
                  </li>
                </ul>
                <Link href="/signup">
                  <Button variant="outline" className="w-full py-4 border border-zinc-400 font-['Space_Grotesk'] text-[24px] hover:bg-zinc-100 uppercase">
                    Start $59/mo — Cancel anytime
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="reviews" className="px-12 py-32 border-t border-zinc-300">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border border-zinc-200 relative">
              <div className="absolute top-0 right-0 p-2 text-[11px] border-l border-b border-zinc-200">USER_REF: A-01</div>
              <p className="italic mb-8 font-['Inter']">&quot;Saved me $800 this month on videographers alone.&quot;</p>
              <div className="text-[12px] uppercase font-bold">Sarah Jenkins</div>
              <div className="text-[11px] text-zinc-400">Luxury Associate, NYC</div>
            </div>
            <div className="p-8 border border-zinc-200 relative">
              <div className="absolute top-0 right-0 p-2 text-[11px] border-l border-b border-zinc-200">USER_REF: A-02</div>
              <p className="italic mb-8 font-['Inter']">&quot;The motion quality is better than my old editor and I get them in minutes.&quot;</p>
              <div className="text-[12px] uppercase font-bold">Marcus Thorne</div>
              <div className="text-[11px] text-zinc-400">Broker, Beverly Hills</div>
            </div>
            <div className="p-8 border border-zinc-200 relative">
              <div className="absolute top-0 right-0 p-2 text-[11px] border-l border-b border-zinc-200">USER_REF: A-03</div>
              <p className="italic mb-8 font-['Inter']">&quot;Closed my listing 9 days faster after posting these reels.&quot;</p>
              <div className="text-[12px] uppercase font-bold">Elena Rodriguez</div>
              <div className="text-[11px] text-zinc-400">Marketing Lead, Miami</div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-12 py-32 border-y border-zinc-300 bg-white">
          <div className="max-w-4xl mx-auto text-center border-2 border-black p-16 relative">
            <div className="absolute -top-3 -left-3 w-3 h-3 border border-black"></div>
            <div className="absolute -top-3 -right-3 w-3 h-3 border border-black"></div>
            <div className="absolute -bottom-3 -left-3 w-3 h-3 border border-black"></div>
            <div className="absolute -bottom-3 -right-3 w-3 h-3 border border-black"></div>
            <h2 className="text-[48px] font-['Space_Grotesk'] font-light mb-6 uppercase" style={{ letterSpacing: '-0.02em' }}>Ready to close listings faster?</h2>
            <p className="text-[18px] text-zinc-500 mb-12 max-w-2xl mx-auto font-['Inter']">Join 1,247 agents already using Listing Reel Rocket</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <Link href="/signup">
                <Button className="w-full md:w-auto px-12 py-6 border-2 border-black font-['Space_Grotesk'] text-[24px] bg-black text-white hover:bg-white hover:text-black uppercase">
                  Get Started for $39
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-zinc-300 flex flex-col md:flex-row justify-between items-center w-full px-12 py-8">
        <div className="font-['Space_Grotesk'] text-[10px] tracking-tight text-zinc-900">
          © 2026 LISTING REEL ROCKET / ARCH-REV-01
        </div>
        <div className="flex gap-8">
          <Link href="#" className="font-['Space_Grotesk'] text-[10px] tracking-tight text-zinc-500 hover:text-zinc-900 uppercase">
            Terms of Service
          </Link>
          <Link href="#" className="font-['Space_Grotesk'] text-[10px] tracking-tight text-zinc-500 hover:text-zinc-900 uppercase">
            Privacy Policy
          </Link>
          <Link href="#" className="font-['Space_Grotesk'] text-[10px] tracking-tight text-zinc-500 hover:text-zinc-900 uppercase">
            Technical Docs
          </Link>
          <Link href="#" className="font-['Space_Grotesk'] text-[10px] tracking-tight text-zinc-500 hover:text-zinc-900 uppercase">
            System Status
          </Link>
        </div>
      </footer>
    </div>
  );
}