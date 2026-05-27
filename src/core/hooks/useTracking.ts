/**
 * Tracking client — envía eventos al edge `ingest-event`.
 * Falla silenciosamente: nunca debe romper UX.
 */
import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "rdm_session_id";

function getSessionId(): string {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export interface TrackPayload {
  event_type: string;
  entity_type?: string;
  entity_id?: string;
  payload?: Record<string, unknown>;
  route?: string;
}

export async function track(input: TrackPayload): Promise<void> {
  try {
    await supabase.functions.invoke("ingest-event", {
      body: {
        ...input,
        session_id: getSessionId(),
        route: input.route ?? (typeof window !== "undefined" ? window.location.pathname : undefined),
      },
    });
  } catch {
    // swallow — tracking nunca rompe UX
  }
}

export function useTracking() {
  return { track };
}
