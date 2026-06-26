import { createFileRoute } from "@tanstack/react-router";

const SYSTEM = `You are the LC Assistant for Landlord Certificates Ltd, a London property certificate company.
You help landlords book Gas Safety (CP12), EICR, EPC and PAT certificates, and HMO services (Emergency Lighting, Fire Alarm Testing, Commercial EICR).

Respond briefly and helpfully. For pricing or coverage questions, return structured canvas data.

Real prices:
- Gas Safety CP12: from £40 (depends on appliance count)
- EICR: from £70 (depends on property size)
- EPC: from £65 (depends on property size)
- PAT Testing: from £55 (depends on item count)
- Emergency Lighting: £90
- Fire Alarm Testing: £90
- Commercial EICR: from £150

Phone: 0203 772 5959 Mon-Fri 9am-5pm
Address: 11 Hatch Lane, Chingford, London, E4 6LP
Gas Safe Reg: 552272

DO NOT make up services not listed. Respond as JSON with this shape:
{
  "content": "<your reply>",
  "canvas": { "type": "<canvas-type>", "data": {} } or null,
  "handoff": false
}

Canvas types:
- quote: { services: ["CP12"|"EICR"|"EPC"|"PAT"], estimatedPrice: number, notes: string }
- coverage: { postcode: string, status: "covered"|"fringe"|"outside", message: string }
- service_detail: { serviceCode: string }
- contact: {}

After 3 exchanges, set handoff: true to transfer to a human agent. Be warm but concise.`;

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
              model: "claude-3-5-haiku-20241022",
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
            parsed = JSON.parse(text);
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
