import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface GenerationRequest {
  listingId: string;
  propertyName: string;
  address: string;
  photos: string[];
  description?: string;
  voiceId?: string;
  userId: string;
}

async function generateScript(propertyName: string, description?: string): Promise<string> {
  const deepseekApiKey = process.env.DEEPSEEK_API_KEY;
  
  if (!deepseekApiKey) {
    return `Welcome to ${propertyName}. This stunning property offers exceptional living spaces with premium finishes throughout.`;
  }

  try {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${deepseekApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are a professional real estate copywriter. Write compelling 30-60 second video narration scripts for luxury property listings. Be concise, engaging, and highlight key features."
          },
          {
            role: "user",
            content: `Write a video script for: ${propertyName}. ${description || "Highlight the property's best features."}`
          }
        ],
        max_tokens: 200,
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || `Welcome to ${propertyName}. This stunning property awaits you.`;
  } catch (error) {
    console.error("Script generation error:", error);
    return `Welcome to ${propertyName}. Experience luxury living at its finest.`;
  }
}

async function generateVoiceover(script: string, voiceId?: string): Promise<string> {
  const elevenApiKey = process.env.ELEVENLABS_API_KEY;
  const voice = voiceId || "21m00Tcm4TlvDq8ikWAM"; // Rachel default
  
  if (!elevenApiKey) {
    console.warn("No ElevenLabs API key - returning placeholder");
    return "";
  }

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
      method: "POST",
      headers: {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": elevenApiKey,
      },
      body: JSON.stringify({
        text: script,
        model_id: "eleven_turbo_v2_5",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs error: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(audioBuffer).toString("base64");
    return `data:audio/mpeg;base64,${base64}`;
  } catch (error) {
    console.error("Voiceover generation error:", error);
    return "";
  }
}

async function generateVideo(imageUrl: string, prompt: string): Promise<string> {
  const falApiKey = process.env.FAL_AI_KEY;
  
  if (!falApiKey) {
    console.warn("No fal.ai API key - returning placeholder");
    return "";
  }

  try {
    const response = await fetch("https://queue.fal.run/fal-ai/kling-video/v1/generations", {
      method: "POST",
      headers: {
        "Authorization": `Key ${falApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        image_url: imageUrl,
        mode: "std",
        duration: 5,
      }),
    });

    if (!response.ok) {
      throw new Error(`fal.ai error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.request_id) {
      const result = await waitForCompletion(data.request_id, falApiKey);
      return result?.video?.url || "";
    }
    
    return data.video?.url || "";
  } catch (error) {
    console.error("Video generation error:", error);
    return "";
  }
}

async function waitForCompletion(requestId: string, apiKey: string, maxAttempts = 60) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(
        `https://queue.fal.run/fal-ai/kling-video/v1/generations/${requestId}`,
        {
          headers: { "Authorization": `Key ${apiKey}` },
        }
      );
      
      const data = await response.json();
      
      if (data.status === "COMPLETED") {
        return data;
      }
      
      if (data.status === "FAILED") {
        throw new Error("Video generation failed");
      }
      
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error("Polling error:", error);
      break;
    }
  }
  
  return null;
}

export async function POST(request: Request) {
  try {
    const body: GenerationRequest = await request.json();
    const { listingId, propertyName, address, photos, description, voiceId, userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!photos || photos.length === 0) {
      return NextResponse.json({ error: "No photos provided" }, { status: 400 });
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("subscription_tier, credits")
      .eq("id", userId)
      .single();

    const isPro = profile?.subscription_tier === "pro";
    const hasCredits = (profile?.credits || 0) > 0;

    if (!isPro && !hasCredits) {
      return NextResponse.json(
        { error: "No credits available. Please purchase a plan." },
        { status: 402 }
      );
    }

    const { data: generation, error: genError } = await supabaseAdmin
      .from("generations")
      .insert({
        user_id: userId,
        listing_id: listingId,
        property_name: propertyName,
        address: address,
        status: "processing",
        input_photos: photos,
        current_step: "script",
        progress: 0,
        steps: {
          script: "processing",
          voiceover: "pending",
          video: "pending",
          combining: "pending",
        },
      })
      .select()
      .single();

    if (genError || !generation) {
      return NextResponse.json({ error: "Failed to create generation" }, { status: 500 });
    }

    const videos: { variant: number; url: string; voiceover_url: string; name: string }[] = [];

    for (let i = 0; i < 4; i++) {
      await supabaseAdmin
        .from("generations")
        .update({ 
          currentStep: `variant_${i + 1}`,
          progress: Math.round((i / 4) * 100),
        })
        .eq("id", generation.id);

      const script = await generateScript(propertyName, description);
      
      await supabaseAdmin
        .from("generations")
        .update({ 
          current_step: "voiceover",
          progress: Math.round(((i + 0.25) / 4) * 100),
          steps: {
            script: "completed",
            voiceover: "processing",
            video: "pending",
            combining: "pending",
          },
        })
        .eq("id", generation.id);

      const voiceoverUrl = await generateVoiceover(script, voiceId);

      await supabaseAdmin
        .from("generations")
        .update({ 
          current_step: "video",
          progress: Math.round(((i + 0.5) / 4) * 100),
          steps: {
            script: "completed",
            voiceover: "completed",
            video: "processing",
            combining: "pending",
          },
        })
        .eq("id", generation.id);

      const imageUrl = photos[i % photos.length];
      const videoUrl = await generateVideo(imageUrl, script);

      await supabaseAdmin
        .from("generations")
        .update({ 
          current_step: "combining",
          progress: Math.round(((i + 0.75) / 4) * 100),
          steps: {
            script: "completed",
            voiceover: "completed",
            video: "completed",
            combining: "processing",
          },
        })
        .eq("id", generation.id);

      videos.push({
        variant: i + 1,
        url: videoUrl || "",
        voiceover_url: voiceoverUrl || "",
        name: `${propertyName} - Variant ${i + 1}`,
      });

      await supabaseAdmin
        .from("generations")
        .update({ 
          current_step: "complete",
          progress: Math.round(((i + 1) / 4) * 100),
          steps: {
            script: "completed",
            voiceover: "completed",
            video: "completed",
            combining: "completed",
          },
        })
        .eq("id", generation.id);
    }

    await supabaseAdmin
      .from("generations")
      .update({
        status: "completed",
        videos: videos,
        current_step: "complete",
        progress: 100,
      })
      .eq("id", generation.id);

    if (!isPro) {
      await supabaseAdmin
        .from("profiles")
        .update({
          credits: (profile?.credits || 1) - 1,
        })
        .eq("id", userId);
    }

    return NextResponse.json({
      success: true,
      generationId: generation.id,
      videos,
    });
  } catch (error) {
    console.error("Generation error:", error);
    
    return NextResponse.json(
      { error: "Failed to generate reels" },
      { status: 500 }
    );
  }
}