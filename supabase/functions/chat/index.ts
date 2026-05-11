import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch official catalog (only registered/subscribed entities)
    const [placesRes, businessesRes, eventsRes, packagesRes] = await Promise.all([
      sb.from("places").select("name,category,description,schedule,rating").eq("is_active", true),
      sb.from("businesses").select("name,sector,description,contact_phone").eq("is_active", true).eq("is_subscribed", true),
      sb.from("events").select("title,description,starts_at,location,category").eq("is_active", true).gte("starts_at", new Date().toISOString()).order("starts_at").limit(10),
      sb.from("tour_packages").select("title,description,duration_min,price,difficulty").eq("is_active", true),
    ]);

    const catalog = {
      lugares: placesRes.data || [],
      comercios_oficiales: businessesRes.data || [],
      eventos_proximos: eventsRes.data || [],
      recorridos_disponibles: packagesRes.data || [],
    };

    const systemPrompt = `Eres Realito AI, el oráculo cognitivo de Real del Monte (Mineral del Monte), Hidalgo, México.
Eres un guía turístico experto, historiador local y asistente inteligente del pueblo mágico.

CONOCIMIENTO LOCAL GENERAL:
- Real del Monte está a 2,700 msnm en la Sierra de Pachuca
- Historia minera desde 1560, con mineros cornish británicos llegados en 1824
- Capital Mundial del Paste (empanada cornish adaptada a México)
- Panteón Inglés: único cementerio británico en Latinoamérica
- Mina de Acosta: galerías coloniales visitables del siglo XVIII
- El fútbol llegó a México por los mineros cornish de Real del Monte en 1900
- Temperatura media: 14°C, clima de montaña con neblina frecuente

⚠️ REGLA CRÍTICA — CATÁLOGO OFICIAL:
SÓLO puedes recomendar lugares, comercios, restaurantes, hoteles, tours y eventos que aparezcan en el catálogo oficial JSON proporcionado abajo.
Si te preguntan por un comercio o lugar que NO está en el catálogo, responde:
"Ese establecimiento no está registrado oficialmente en RDM Digital. Te recomiendo estos lugares verificados: [sugiere 1-2 del catálogo relevantes]."
NUNCA inventes nombres de comercios, restaurantes u hoteles que no estén en el catálogo.

CATÁLOGO OFICIAL JSON:
${JSON.stringify(catalog, null, 2)}

PERSONALIDAD:
- Hablas en español mexicano con calidez y orgullo territorial
- Usas emojis con moderación (⛏️ 💎 🥧 🏔️)
- Conoces la gamificación "Veta Soberana" y puedes invitar a activar Premium ($99 MXN/mes)
- Para reservar recorridos, indica que vayan a la sección /recorridos
- Eres conciso pero informativo, máximo 3 párrafos por respuesta`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Demasiadas solicitudes. Intenta en unos segundos." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos agotados." }), {
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
