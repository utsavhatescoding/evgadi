"use client";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "");
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

type JsonObject = Record<string, unknown>;

async function request<T>(table: string, init?: RequestInit): Promise<T> {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase is not configured");
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
    ...init,
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) throw new Error(`Database request failed: ${response.status}`);
  if (response.status === 204 || response.headers.get("content-length") === "0") return [] as T;
  return response.json() as Promise<T>;
}

export async function loadVehicles<T>(): Promise<T[]> {
  return request<T[]>(
    "vehicles?select=id,brand,model,variant,price,battery,range,rangeStandard:range_standard,seats,clearance,dc,serviceCities:service_cities,serviceCount:service_count,qa,evidence,imageUrl:image_url,sourceUrl:source_url,sourceLabel:source_label,verifiedAt:verified_at,bodyType:body_type&status=eq.active&order=brand.asc,model.asc",
    { headers: { Prefer: "return=representation" } },
  );
}

export async function submitBuyerEnquiry(payload: JsonObject) {
  if (!isSupabaseConfigured) return;
  return request("buyer_enquiries", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function saveRecommendationSession(payload: JsonObject) {
  if (!isSupabaseConfigured) return;
  try {
    await request("recommendation_sessions", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch {
    // Recommendation analytics must never block the buyer journey.
  }
}
