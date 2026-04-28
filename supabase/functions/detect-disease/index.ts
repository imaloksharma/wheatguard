// Detect wheat disease from an image URL using Lovable AI vision
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are an expert agricultural plant pathologist specializing in wheat (Triticum) diseases.
Analyze the provided crop image and identify whether the plant is healthy or shows signs of disease.

Possible classifications:
- Healthy
- Leaf Rust (Puccinia triticina)
- Stripe Rust / Yellow Rust (Puccinia striiformis)
- Stem Rust (Puccinia graminis)
- Powdery Mildew
- Septoria Leaf Blotch
- Tan Spot
- Fusarium Head Blight
- Other / Unknown

If the image is not a wheat plant, set disease to "Not a wheat plant" and is_healthy=false.
Always call the report_diagnosis function with your findings.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // --- Authentication: require a valid Supabase JWT ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabase = createClient(
      supabaseUrl,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // --- Input validation ---
    const { imageUrl } = await req.json();
    if (!imageUrl || typeof imageUrl !== "string" || imageUrl.length > 512) {
      return new Response(JSON.stringify({ error: "imageUrl required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    // Only allow images from this project's wheat-images storage bucket
    const allowedPrefix = `${supabaseUrl}/storage/v1/object/public/wheat-images/`;
    const allowedSignedPrefix = `${supabaseUrl}/storage/v1/object/sign/wheat-images/`;
    if (!imageUrl.startsWith(allowedPrefix) && !imageUrl.startsWith(allowedSignedPrefix)) {
      return new Response(JSON.stringify({ error: "Invalid image URL" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY missing");
      return new Response(JSON.stringify({ error: "Service unavailable" }), {
        status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this crop image and diagnose any disease." },
              { type: "image_url", image_url: { url: imageUrl } },
            ],
          },
        ],
        tools: [{
          type: "function",
          function: {
            name: "report_diagnosis",
            description: "Report the wheat disease diagnosis.",
            parameters: {
              type: "object",
              properties: {
                disease: { type: "string", description: "Disease name or 'Healthy'" },
                is_healthy: { type: "boolean" },
                confidence: { type: "number", description: "0-1 confidence score" },
                severity: { type: "string", enum: ["none", "mild", "moderate", "severe"] },
                description: { type: "string", description: "Brief description of visible symptoms (1-2 sentences)" },
                treatment: { type: "string", description: "Recommended treatment or care advice (1-3 sentences)" },
              },
              required: ["disease", "is_healthy", "confidence", "severity", "description", "treatment"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "report_diagnosis" } },
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      console.error("AI gateway error", resp.status, t);
      if (resp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (resp.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Add credits in Settings → Workspace → Usage." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      return new Response(JSON.stringify({ error: "No diagnosis returned" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("detect-disease error", e);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
