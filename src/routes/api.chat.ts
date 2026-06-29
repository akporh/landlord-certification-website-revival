import { createFileRoute } from "@tanstack/react-router";

const SYSTEM = `You are the LC Assistant for Landlord Certificates Ltd, a London property certificate company.
You help landlords book Gas Safety (CP12), EICR, EPC, PAT and HMO services (Emergency Lighting, Fire Alarm, Commercial EICR).

Be brief, warm, plain-English. When the user's intent maps to a canvas, ALWAYS return the matching canvas instead of long text.

Prices: Gas Safety CP12 from £40, EICR from £70, EPC from £65, PAT from £55, Emergency Lighting £90, Fire Alarm £90, Commercial EICR from £150.
June deals: Gas Safety + Boiler Service £85 · EICR + PAT £99.
Phone 0203 772 5959 · Gas Safe 552272.

Demo landlord on file: Andrew Mason · 14 Forest Road, Walthamstow E17 6JF.

Respond as JSON ONLY:
{ "content": "<reply>", "canvas": { "type": "<type>", "data": {} } | null, "handoff": false }

Canvas types (use exactly these):

1. "price-calculator" → { "services": [{ "name": "Gas Safety", "price": "£40" }] }
   For straight quote questions.

2. "appliance-counter" → { "basePrice": 40, "perItem": 10 }
   When user is unsure how many gas appliances.

3. "booking-slots" → { "service": "Gas Safety" }
   When user asks to book / see slots.

4. "coverage-result" → { "covered": true, "borough": "Wandsworth", "postcode": "SW18", "zone": "same-day" }
   When user asks if you cover an area.
   zone: "same-day" for inner London (zones 1-2), "next-day" for outer London.

5. "certificate-preview" → { "type": "Gas Safety (CP12)", "address": "14 Forest Road, E17 6JF", "engineer": "Mark T.", "gasSafeNo": "552272", "issued": "12 Mar 2026", "expires": "12 Mar 2027", "status": "Pass" }
   When user asks to see / download their certificate.

6. "renewal-timeline" → { "cert": "Gas Safety", "lastDone": "May 2025", "dueDate": "May 2026", "validity": "1 year" }
   When user asks when something is due. Validity: Gas 1y, EICR 5y, EPC 10y, PAT 1y.

7. "eicr-codes" → { "code": "C2" }
   When user asks what an EICR code means (C1, C2, C3, FI).

8. "portfolio-table" → { "properties": [{ "address": "...", "cert": "Gas Safety", "status": "valid"|"due"|"expired", "expires": "..." }] }
   When agent / portfolio landlord asks about multiple properties.

Set handoff: true only if user explicitly asks for a human.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["ANTHROPIC_API_KEY"];
        if (!apiKey) {
          return Response.json({ content: "Chat service is not configured. Call us on 0203 772 5959.", canvas: null, handoff: false });
        }

        let body: { message: string; history?: Array<{ role: string; content: string }> };
        try {
          body = (await request.json()) ?? { message: "" };
        } catch {
          return Response.json({ content: "Invalid request.", canvas: null, handoff: false });
        }

        const messages = [
          ...(body.history ?? [])
            .filter((m) => m.role === "user" || m.role === "ai")
            .map((m) => ({ role: m.role === "ai" ? "assistant" : "user", content: m.content })),
          { role: "user" as const, content: body.message },
        ];

        try {
          const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "x-api-key": apiKey,
              "anthropic-version": "2023-06-01",
              "content-type": "application/json",
            },
            body: JSON.stringify({
              model: "claude-haiku-4-5-20251001",
              max_tokens: 512,
              system: SYSTEM,
              messages,
            }),
          });

          const data = (await response.json()) as { content?: Array<{ type: string; text?: string }>; error?: { message: string } };

          if (!response.ok || data.error) {
            return Response.json({ content: "I'm having trouble connecting. Call us on 0203 772 5959.", canvas: null, handoff: false });
          }

          const text = data.content?.[0]?.text ?? "";
          let parsed: { content: string; canvas: Record<string, unknown> | null; handoff: boolean };
          try {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);
          } catch {
            parsed = { content: text, canvas: null, handoff: false };
          }

          return Response.json(parsed);
        } catch {
          return Response.json({ content: "I'm having trouble connecting. Call us on 0203 772 5959.", canvas: null, handoff: false });
        }
      },
    },
  },
});
