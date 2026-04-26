"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";

interface Profile {
  full_name: string;
  agency: string;
  phone: string;
  logo_url: string;
  voice_setting: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState<Profile>({
    full_name: "",
    agency: "",
    phone: "",
    logo_url: "",
    voice_setting: "default",
  });

  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (isMounted) router.replace("/login");
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (isMounted && data) {
        setProfile(data);
        if (data.logo_url) {
          setLogoPreview(data.logo_url);
        }
        setLoading(false);
      }
    }
    
    loadProfile();
    
    return () => {
      isMounted = false;
    };
  }, [supabase, router]);

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

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        let logoUrl = profile.logo_url;
        if (logo) {
          const fileExt = logo.name.split(".").pop();
          const fileName = `${user.id}-logo.${fileExt}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("logos")
            .upload(fileName, logo);
          if (!uploadError && uploadData) {
            const { data: urlData } = supabase.storage
              .from("logos")
              .getPublicUrl(fileName);
            logoUrl = urlData.publicUrl;
          }
        }

        await supabase.from("profiles").upsert({
          id: user.id,
          full_name: profile.full_name,
          agency: profile.agency,
          phone: profile.phone,
          logo_url: logoUrl,
          voice_setting: profile.voice_setting,
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error(error);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold font-heading">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="api">API Keys</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-lg font-heading">
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your personal details and branding
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center overflow-hidden relative">
                    {logoPreview ? (
                      <Image
                        src={logoPreview}
                        alt="Logo"
                        fill
                        className="object-contain"
                      />
                    ) : (
                      <span className="text-2xl text-muted-foreground">+</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      id="logo-upload-settings"
                      className="hidden"
                      accept="image/*"
                      onChange={handleLogoUpload}
                    />
                    <label htmlFor="logo-upload-settings">
                      <Button variant="outline" size="sm">
                        <span className="cursor-pointer">Upload Logo</span>
                      </Button>
                    </label>
                    <p className="text-xs text-muted-foreground mt-2">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={profile.full_name}
                      onChange={(e) =>
                        setProfile({ ...profile, full_name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="agency">Agency Name</Label>
                    <Input
                      id="agency"
                      value={profile.agency}
                      onChange={(e) =>
                        setProfile({ ...profile, agency: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Voice Setting</Label>
                  <div className="flex gap-3">
                    <Button
                      variant={profile.voice_setting === "default" ? "default" : "outline"}
                      onClick={() => setProfile({ ...profile, voice_setting: "default" })}
                    >
                      Default Voice
                    </Button>
                    <Button
                      variant={profile.voice_setting === "clone" ? "default" : "outline"}
                      onClick={() => setProfile({ ...profile, voice_setting: "clone" })}
                    >
                      Clone My Voice
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  {saved && (
                    <span className="text-sm text-green-600">Saved successfully!</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-lg font-heading">Billing</CardTitle>
                <CardDescription>Manage your subscription and payments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-medium">Professional Plan</div>
                      <div className="text-sm text-muted-foreground">
                        $39 per listing
                      </div>
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      Active
                    </span>
                  </div>
                  <Button variant="outline" className="w-full">
                    Manage Subscription
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api">
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-lg font-heading">API Keys</CardTitle>
                <CardDescription>
                  Manage API keys for integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>OpenAI API Key</Label>
                  <Input type="password" placeholder="sk-..." />
                </div>
                <div className="space-y-2">
                  <Label>ElevenLabs API Key</Label>
                  <Input type="password" placeholder="api key..." />
                </div>
                <Button>Save API Keys</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}