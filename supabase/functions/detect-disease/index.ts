// Detect wheat disease from an image URL using Lovable AI vision
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
    const { imageUrl } = await req.json();
    if (!imageUrl || typeof imageUrl !== "string") {
      return new Response(JSON.stringify({ error: "imageUrl required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

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
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
