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
- "price-calculator": { "services": [{ "name": "...", "price": "..." }] }
  Use when the user asks about pricing. List each service with its price as a string (e.g. "from £40").
- "coverage-result": { "covered": true/false, "postcode": "E14", "borough": "Tower Hamlets", "zone": "same-day" }
  Use when the user asks if you cover their area or postcode.
  covered: true for any London borough or M25 area, false otherwise.
  postcode: the postcode district they mentioned (e.g. "E14", "SW11").
  borough: the London borough for that postcode.
  zone: "same-day" for inner London (zones 1–2), "next-day" for outer London.
- "renewal-timeline": { "cert": "Gas Safety", "lastDone": "May 2023", "dueDate": "May 2024", "validity": "1 year" }
  Use when the user asks when their certificate is due or mentions a past inspection date.
  cert: the certificate type. lastDone: when they last had it done. dueDate: add validity period to lastDone. validity: "1 year", "5 years", or "10 years".

Set handoff: true if user is frustrated, repeats unanswered question, or explicitly asks for a human. Be warm but concise.`;

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
