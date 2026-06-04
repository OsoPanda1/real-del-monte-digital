/**
 * Tracking client — envía eventos al Edge Function `ingest-event`.
 * Debe fallar silenciosamente: jamás rompe la UX.
 */

import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "rdm_session_id";
const OFFLINE_QUEUE_KEY = "rdm_tracking_offline_queue";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof sessionStorage !== "undefined";
}

function getSessionId(): string | null {
  if (!isBrowser()) return null;

  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      id = crypto.randomUUID();
    } else {
      id = `rdm_${Math.random().toString(36).slice(2)}_${Date.now()}`;
    }
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export type RdmEventType =
  | "page_view"
  | "click"
  | "route_suggestion"
  | "commerce_view"
  | "commerce_click"
  | "donation_started"
  | "donation_completed"
  | "membership_started"
  | "membership_completed"
  | "wall_post_created"
  | "wall_post_liked"
  | "map_interaction"
  | "map_layer_toggled"
  | "legend_view"
  | "community_story_view"
  | "custom";

export interface TrackPayload {
  event_type: RdmEventType;
  entity_type?: string;
  entity_id?: string;
  payload?: Record<string, unknown>;
  route?: string;
  external_session_id?: string;
  /**
   * Si es true, indica al backend que debe anonimizar IP
   * (por ejemplo, truncando direcciones o usando agregación).
   */
  anonymize_ip?: boolean;
}

interface InternalTrackBody extends TrackPayload {
  session_id: string | null;
  route?: string;
  timestamp: string;
  sdk: string;
  sdk_version: string;
}

/**
 * Manejo de cola offline en localStorage.
 */

function loadOfflineQueue(): InternalTrackBody[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as InternalTrackBody[];
  } catch {
    return [];
  }
}

function saveOfflineQueue(queue: InternalTrackBody[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  } catch {
    // ignorar problemas de espacio/cupo
  }
}

async function flushOfflineQueue(): Promise<void> {
  if (!isBrowser()) return;
  if (!navigator.onLine) return;

  const queue = loadOfflineQueue();
  if (!queue.length) return;

  const remaining: InternalTrackBody[] = [];

  for (const event of queue) {
    try {
      if (!supabase?.functions) {
        remaining.push(event);
        continue;
      }

      await supabase.functions.invoke("ingest-event", {
        body: event,
      });
      // si no lanza error, se considera enviado
    } catch {
      // si falla este evento, lo dejamos en la cola
      remaining.push(event);
    }
  }

  saveOfflineQueue(remaining);
}

/**
 * Envía un evento a Supabase o lo deja en cola offline si no hay conexión.
 */
async function sendOrQueueEvent(body: InternalTrackBody): Promise<void> {
  try {
    // Primero intentamos flush de la cola anterior.
    await flushOfflineQueue();

    // Si no hay cliente o no hay conexión, encolamos.
    if (!supabase?.functions || (isBrowser() && !navigator.onLine)) {
      const queue = loadOfflineQueue();
      queue.push(body);
      saveOfflineQueue(queue);
      return;
    }

    await supabase.functions.invoke("ingest-event", { body });
  } catch {
    // En caso de fallo, volvemos a encolar para otro intento.
    const queue = loadOfflineQueue();
    queue.push(body);
    saveOfflineQueue(queue);
  }
}

/**
 * API pública de tracking genérico.
 */
export async function track(input: TrackPayload): Promise<void> {
  try {
    const sessionId = input.external_session_id ?? getSessionId();
    const route =
      input.route ??
      (isBrowser() ? window.location.pathname + window.location.search : undefined);

    const body: InternalTrackBody = {
      ...input,
      session_id: sessionId,
      route,
      timestamp: new Date().toISOString(),
      sdk: "rdm-web",
      sdk_version: "1.0.0",
    };

    await sendOrQueueEvent(body);
  } catch {
    // swallow — tracking nunca rompe UX
  }
}

/**
 * Hook básico de tracking.
 */
export function useTracking() {
  const trackEvent = useCallback((input: TrackPayload) => track(input), []);
  return { track: trackEvent };
}

/**
 * Helper especializado para el Plano Turístico del RDM.
 *
 * Ejemplo:
 *   const tourism = useTourismTracking();
 *   tourism.trackPageView("/historia");
 *   tourism.trackMapInteraction("zoom", { level: 14 });
 */
export function useTourismTracking(options?: { anonymizeIp?: boolean }) {
  const { track: baseTrack } = useTracking();
  const anonymizeIp = options?.anonymizeIp ?? true;

  const trackPageView = useCallback(
    (route?: string) =>
      baseTrack({
        event_type: "page_view",
        route,
        anonymize_ip: anonymizeIp,
      }),
    [baseTrack, anonymizeIp],
  );

  const trackMapInteraction = useCallback(
    (interactionType: "pan" | "zoom" | "marker_click" | "route_toggle", extra?: Record<string, unknown>) =>
      baseTrack({
        event_type: "map_interaction",
        entity_type: "map",
        payload: {
          interaction_type: interactionType,
          ...extra,
        },
        anonymize_ip: anonymizeIp,
      }),
    [baseTrack, anonymizeIp],
  );

  const trackMapLayerToggle = useCallback(
    (layerId: string, enabled: boolean) =>
      baseTrack({
        event_type: "map_layer_toggled",
        entity_type: "map_layer",
        entity_id: layerId,
        payload: { enabled },
        anonymize_ip: anonymizeIp,
      }),
    [baseTrack, anonymizeIp],
  );

  const trackCommerceView = useCallback(
    (commerceId: string) =>
      baseTrack({
        event_type: "commerce_view",
        entity_type: "commerce",
        entity_id: commerceId,
        anonymize_ip: anonymizeIp,
      }),
    [baseTrack, anonymizeIp],
  );

  const trackCommerceClick = useCallback(
    (commerceId: string, action: "open_details" | "call" | "navigate") =>
      baseTrack({
        event_type: "commerce_click",
        entity_type: "commerce",
        entity_id: commerceId,
        payload: { action },
        anonymize_ip: anonymizeIp,
      }),
    [baseTrack, anonymizeIp],
  );

  const trackDonation = useCallback(
    (stage: "started" | "completed", payload?: Record<string, unknown>) =>
      baseTrack({
        event_type: stage === "started" ? "donation_started" : "donation_completed",
        entity_type: "donation",
        payload,
        anonymize_ip: anonymizeIp,
      }),
    [baseTrack, anonymizeIp],
  );

  const trackMembership = useCallback(
    (stage: "started" | "completed", payload?: Record<string, unknown>) =>
      baseTrack({
        event_type: stage === "started" ? "membership_started" : "membership_completed",
        entity_type: "membership",
        payload,
        anonymize_ip: anonymizeIp,
      }),
    [baseTrack, anonymizeIp],
  );

  const trackWallPost = useCallback(
    (action: "created" | "liked", postId?: string) =>
      baseTrack({
        event_type: action === "created" ? "wall_post_created" : "wall_post_liked",
        entity_type: "wall_post",
        entity_id: postId,
        anonymize_ip: anonymizeIp,
      }),
    [baseTrack, anonymizeIp],
  );

  const trackLegendView = useCallback(
    (legendId: string) =>
      baseTrack({
        event_type: "legend_view",
        entity_type: "legend",
        entity_id: legendId,
        anonymize_ip: anonymizeIp,
      }),
    [baseTrack, anonymizeIp],
  );

  const trackCommunityStoryView = useCallback(
    (storyId: string) =>
      baseTrack({
        event_type: "community_story_view",
        entity_type: "community_story",
        entity_id: storyId,
        anonymize_ip: anonymizeIp,
      }),
    [baseTrack, anonymizeIp],
  );

  return {
    trackPageView,
    trackMapInteraction,
    trackMapLayerToggle,
    trackCommerceView,
    trackCommerceClick,
    trackDonation,
    trackMembership,
    trackWallPost,
    trackLegendView,
    trackCommunityStoryView,
  };
}
