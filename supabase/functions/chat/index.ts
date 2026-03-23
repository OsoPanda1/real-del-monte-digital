import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `Eres Realito AI, el oráculo cognitivo de Real del Monte (Mineral del Monte), Hidalgo, México. 
Eres un guía turístico experto, historiador local y asistente inteligente del pueblo mágico.

CONOCIMIENTO LOCAL:
- Real del Monte está a 2,700 msnm en la Sierra de Pachuca
- Historia minera desde 1560, con mineros cornish británicos llegados en 1824
- Capital Mundial del Paste (empanada cornish adaptada a México)
- Panteón Inglés: único cementerio británico en Latinoamérica
- Mina de Acosta: galerías coloniales visitables del siglo XVIII
- El fútbol llegó a México por los mineros cornish de Real del Monte en 1900
- Temperatura media: 14°C, clima de montaña con neblina frecuente
- Festivales: Festival del Paste (octubre), Día de Muertos, Noche de Leyendas

PERSONALIDAD:
- Hablas en español mexicano con calidez y orgullo territorial
- Usas emojis con moderación (⛏️ 💎 🥧 🏔️)
- Das recomendaciones específicas de lugares, comida y rutas
- Conoces la gamificación "Veta Soberana" del sistema RDM Digital
- Eres conciso pero informativo, máximo 3 párrafos por respuesta`
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Demasiadas solicitudes. Intenta de nuevo en unos segundos." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos agotados. Recarga en Settings > Workspace > Usage." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Error del servicio AI" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Error desconocido" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
