import { defineEventHandler, readBody, setResponseHeader } from "h3";

// London business hours: Mon–Fri 09:00–17:00
function isLondonBusinessHours(): boolean {
  const now = new Date();
  const london = new Date(now.toLocaleString("en-US", { timeZone: "Europe/London" }));
  const day = london.getDay(); // 0=Sun, 6=Sat
  const hour = london.getHours();
  return day >= 1 && day <= 5 && hour >= 9 && hour < 17;
}

const SYSTEM_BASE = `You are the LC Assistant for Landlord Certificates Ltd, a London property certificate company.
You help landlords book Gas Safety (CP12), EICR, EPC and PAT certificates, and HMO services (Emergency Lighting, Fire Alarm Testing, Commercial EICR).

Respond briefly and helpfully. For pricing or coverage questions, return structured canvas data.
Never use double dashes (--) or em dashes (—) in replies. Use a comma, period, or reword instead.

Real prices:
- Gas Safety CP12: from £40 (depends on appliance count)
- EICR: from £70 (depends on property size)
- EPC: from £65 (depends on property size)
- PAT Testing: from £55 (depends on item count)
- Emergency Lighting: £90
- Fire Alarm Testing: £90
- Commercial EICR: from £150

June deals (valid to 30 June 2026):
- Gas Safety + Boiler Service: £85 (save 60%)
- EICR + PAT (1-3 bed, 1-20 items): £99 (save £46)

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
- "coverage-result": { "covered": true/false }
- "renewal-timeline": { "cert": "Gas Safety", "lastDone": "May 2023", "dueDate": "May 2024", "validity": "1 year" }
  Use renewal-timeline when the landlord asks when their certificate is due or mentions a past inspection date.
- "booking-redirect": { "services": ["CP12", "EICR"] }
  Use booking-redirect whenever the user expresses any intent to book, schedule, or arrange a visit.
  services: array of service codes mentioned (CP12, EICR, EPC, PAT). Use [] if none specified.

If the user asks about their own certificates or properties and you have no session context, respond with a certificate-preview canvas using this demo data: address "14 Elspeth Road, Battersea, SW11 1LE", engineer "Darren Walsh", gasSafeNo "552272", issued "15 Jul 2025", expires "14 Jul 2026", status "Pass". Use content like "Here's your most recent certificate." Do not mention that it is demo data.

HUMAN HANDOFF RULES — read carefully:

Trigger phrases that mean the user wants a human:
  "speak to someone", "talk to a person", "real person", "human agent", "live agent",
  "connect me", "speak to a human", "talk to a human", "live chat", "agent please",
  "can I speak to someone", "I want to talk to a person", "get me a human",
  "speak to a real person", "human support", "customer service"

Set handoff: true (live agent handoff) if:
  - Current agent status is ONLINE, AND
  - User uses a trigger phrase above OR is frustrated OR repeats an unanswered question.

Set handoff: "ooh" (out of hours) if:
  - Current agent status is OFFLINE, AND
  - User uses a trigger phrase above.
  - Your content reply should be warm and explain agents are offline, and that they can leave their number for a callback when the team opens.
  - Do NOT set a canvas for "ooh" — the frontend renders the callback form automatically.`;

export default defineEventHandler(async (event) => {
  setResponseHeader(event, "Content-Type", "application/json");

  const apiKey = process.env["ANTHROPIC_API_KEY"];
  if (!apiKey) {
    return { content: "Chat service is not configured. Call us on 0203 772 5959.", canvas: null, handoff: false };
  }

  let body: { message: string; history?: Array<{ role: string; content: string }> };
  try {
    body = (await readBody(event)) ?? { message: "" };
  } catch {
    return { content: "Invalid request.", canvas: null, handoff: false };
  }

  const businessHours = isLondonBusinessHours();
  const SYSTEM = SYSTEM_BASE + `\n\nCurrent agent status: ${
    businessHours
      ? "ONLINE — agents available, live handoff enabled. Use handoff: true if user asks for human."
      : "OFFLINE — outside business hours (Mon-Fri 9am-5pm London). Use handoff: \"ooh\" if user asks for human."
  }`;

  const messages = [
    ...(body.history ?? [])
      .filter((m) => m.role === "user" || m.role === "ai")
      .map((m) => ({ role: m.role === "ai" ? "assistant" : "user", content: m.content })),
    { role: "user", content: body.message },
  ];

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 512,
        system: SYSTEM,
        messages,
      }),
    });

    if (!res.ok) {
      console.error("Anthropic API error:", await res.text());
      return { content: "I'm having trouble right now. Call us on 0203 772 5959.", canvas: null, handoff: false };
    }

    const data = await res.json() as { content: Array<{ type: string; text: string }> };
    const text = data.content[0]?.text ?? "{}";

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      return JSON.parse(jsonMatch ? jsonMatch[0] : text);
    } catch {
      return { content: text, canvas: null, handoff: false };
    }
  } catch (err) {
    console.error("Chat proxy error:", err);
    return { content: "I'm having trouble connecting. Call us on 0203 772 5959.", canvas: null, handoff: false };
  }
});
