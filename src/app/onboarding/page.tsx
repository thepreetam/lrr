"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

const steps = [
  { id: 1, title: "Profile" },
  { id: 2, title: "Agency Logo" },
  { id: 3, title: "Voice" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    fullName: "",
    agency: "",
    phone: "",
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [voice, setVoice] = useState("default");
  const [voiceRecording, setVoiceRecording] = useState(false);

  const handleProfileNext = () => {
    if (profile.fullName && profile.agency) {
      setCurrentStep(2);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoNext = () => {
    setCurrentStep(3);
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").upsert({
          id: user.id,
          full_name: profile.fullName,
          agency: profile.agency,
          phone: profile.phone,
          voice_setting: voice,
          completed_onboarding: true,
        });
      }
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      router.push("/dashboard");
    }
  };

  const toggleVoiceRecording = () => {
    if (voiceRecording) {
      setVoiceRecording(false);
    } else {
      setVoiceRecording(true);
      setTimeout(() => setVoiceRecording(false), 30000);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold font-heading mb-2">
              Let&apos;s set up your account
            </h1>
            <p className="text-muted-foreground">
              This only takes a minute
            </p>
          </div>

          <div className="flex justify-center gap-2 mb-8">
            {steps.map((step) => (
              <div
                key={step.id}
                className="flex items-center gap-2"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    currentStep >= step.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.id}
                </div>
                {step.id < steps.length && (
                  <div
                    className={`w-12 h-px transition-colors ${
                      currentStep > step.id ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <Card className="border border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-heading">
                {currentStep === 1 && "Create your profile"}
                {currentStep === 2 && "Upload agency logo"}
                {currentStep === 3 && "Choose your voice"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      placeholder="Sarah Jenkins"
                      value={profile.fullName}
                      onChange={(e) =>
                        setProfile({ ...profile, fullName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="agency">Agency Name *</Label>
                    <Input
                      id="agency"
                      placeholder="Luxury Realty Group"
                      value={profile.agency}
                      onChange={(e) =>
                        setProfile({ ...profile, agency: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="(555) 123-4567"
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={handleProfileNext}
                    disabled={!profile.fullName || !profile.agency}
                  >
                    Continue
                  </Button>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    {logoPreview ? (
                      <div className="space-y-4">
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="max-h-24 mx-auto object-contain"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setLogo(null);
                            setLogoPreview(null);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <>
                        <input
                          type="file"
                          id="logo-upload"
                          className="hidden"
                          accept="image/*"
                          onChange={handleLogoUpload}
                        />
                        <label
                          htmlFor="logo-upload"
                          className="cursor-pointer"
                        >
                          <div className="space-y-2">
                            <div className="text-4xl">+</div>
                            <div className="text-sm">
                              Click to upload your agency logo
                            </div>
                            <div className="text-xs text-muted-foreground">
                              PNG, JPG up to 5MB
                            </div>
                          </div>
                        </label>
                      </>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setCurrentStep(1)}
                    >
                      Back
                    </Button>
                    <Button className="flex-1" onClick={handleLogoNext}>
                      Continue
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        voice === "default"
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      }`}
                      onClick={() => setVoice("default")}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Default Voice</div>
                          <div className="text-sm text-muted-foreground">
                            Professional narrator
                          </div>
                        </div>
                        {voice === "default" && (
                          <div className="w-4 h-4 bg-primary rounded-full" />
                        )}
                      </div>
                    </div>
                    <div
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        voice === "clone"
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      }`}
                      onClick={() => setVoice("clone")}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Record My Voice</div>
                          <div className="text-sm text-muted-foreground">
                            Clone your voice (30 sec sample)
                          </div>
                        </div>
                        {voice === "clone" && (
                          <div className="w-4 h-4 bg-primary rounded-full" />
                        )}
                      </div>
                    </div>
                  </div>

                  {voice === "clone" && (
                    <div className="border border-border rounded-lg p-4">
                      <div className="text-center space-y-4">
                        <div className="text-sm text-muted-foreground">
                          Record 30 seconds of you speaking
                        </div>
                        <Button
                          variant={voiceRecording ? "destructive" : "outline"}
                          onClick={toggleVoiceRecording}
                        >
                          {voiceRecording ? "Stop Recording" : "Start Recording"}
                        </Button>
                        {voiceRecording && (
                          <div className="text-sm text-muted-foreground">
                            Recording...
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setCurrentStep(2)}
                    >
                      Back
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleComplete}
                      disabled={loading}
                    >
                      {loading ? "Setting up..." : "Get Started"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}