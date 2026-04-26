"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

const voiceOptions = [
  { id: "default", label: "Default narrator", description: "Professional voice" },
  { id: "clone", label: "Your voice", description: "Cloned voice" },
];

const musicOptions = [
  { id: "upbeat", label: "Upbeat", description: "Energetic and motivating" },
  { id: "calm", label: "Calm", description: "Relaxing atmosphere" },
  { id: "luxury", label: "Luxury", description: "Premium feel" },
];

export default function NewReelPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [propertyName, setPropertyName] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [description, setDescription] = useState("");
  const [listingUrl, setListingUrl] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("default");
  const [selectedMusic, setSelectedMusic] = useState("luxury");
  const [numVariations, setNumVariations] = useState(4);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    if (files.length + newFiles.length > 10) {
      alert("Maximum 10 photos allowed");
      return;
    }
    setFiles((prev) => [...prev, ...newFiles]);

    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }, [files]);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length < 5) {
      alert("Please upload at least 5 photos");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: reel, error: reelError } = await supabase
        .from("reels")
        .insert({
          user_id: user.id,
          property_name: propertyName || "Untitled",
          property_address: propertyAddress,
          description,
          status: "processing",
        })
        .select()
        .single();

      if (reelError) throw reelError;

      for (const file of files) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${reel.id}/${Date.now()}-${Math.random()}.${fileExt}`;
        await supabase.storage.from("uploads").upload(fileName, file);
      }

      router.push(`/dashboard/reel/${reel.id}`);
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold font-heading">Create New Reel</h1>
          <p className="text-muted-foreground">
            Upload your listing photos and generate cinematic reels
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="border border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-heading">Upload Photos</CardTitle>
              <CardDescription>
                Upload 5-10 high-quality photos of the property
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {previews.map((preview, index) => (
                  <div
                    key={index}
                    className="aspect-square relative border border-border rounded-sm overflow-hidden group"
                  >
                    <img
                      src={preview}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
                      {index + 1}
                    </div>
                  </div>
                ))}
                {files.length < 10 && (
                  <label className="aspect-square border-2 border-dashed border-border rounded-sm flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <div className="text-center p-2">
                      <div className="text-2xl">+</div>
                      <div className="text-xs text-muted-foreground">
                        {files.length}/10
                      </div>
                    </div>
                  </label>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <Label htmlFor="listingUrl" className="text-sm">
                  Or paste listing URL (optional)
                </Label>
                <Input
                  id="listingUrl"
                  placeholder="https://..."
                  value={listingUrl}
                  onChange={(e) => setListingUrl(e.target.value)}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-heading">
                Property Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="propertyName">Property Name</Label>
                  <Input
                    id="propertyName"
                    placeholder="e.g., Luxury Sunset Villa"
                    value={propertyName}
                    onChange={(e) => setPropertyName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propertyAddress">Address</Label>
                  <Input
                    id="propertyAddress"
                    placeholder="123 Main St, City"
                    value={propertyAddress}
                    onChange={(e) => setPropertyAddress(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Short description for the voiceover..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-heading">Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm">Voice</Label>
                <div className="flex gap-3">
                  {voiceOptions.map((voice) => (
                    <div
                      key={voice.id}
                      onClick={() => setSelectedVoice(voice.id)}
                      className={`flex-1 p-3 border-2 rounded-sm cursor-pointer transition-colors ${
                        selectedVoice === voice.id
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      }`}
                    >
                      <div className="font-medium text-sm">{voice.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {voice.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Music Mood</Label>
                <div className="flex gap-3">
                  {musicOptions.map((music) => (
                    <div
                      key={music.id}
                      onClick={() => setSelectedMusic(music.id)}
                      className={`flex-1 p-3 border-2 rounded-sm cursor-pointer transition-colors ${
                        selectedMusic === music.id
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      }`}
                    >
                      <div className="font-medium text-sm">{music.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {music.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Number of Variations</Label>
                <div className="flex gap-3">
                  {[2, 4, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setNumVariations(num)}
                      className={`flex-1 p-3 border-2 rounded-sm transition-colors ${
                        numVariations === num
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      }`}
                    >
                      <div className="font-medium">{num}</div>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || files.length < 5}
              className="flex-1 h-12"
            >
              {loading
                ? "Creating..."
                : `Generate ${numVariations} Cinematic Reels`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}