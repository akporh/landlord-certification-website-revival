import { defineEventHandler, readBody, setResponseHeader } from "h3";

const SYSTEM = `You are the LC Assistant for Landlord Certificates Ltd, a London property certificate company.
You help landlords book Gas Safety (CP12), EICR, EPC and PAT certificates, and HMO services (Emergency Lighting, Fire Alarm Testing, Commercial EICR).

Respond briefly and helpfully. For pricing or coverage questions, return structured canvas data.
Never use double dashes (--) in replies. Use a comma, period, or reword instead.

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
  Use renewal-timeline when the landlord asks when their certificate is due, when it expires, or mentions a past inspection date.
  cert: the certificate type (Gas Safety, EICR, EPC, PAT).
  lastDone: when they last had the inspection (month and year, e.g. "May 2023").
  dueDate: when renewal is due — add the validity period to lastDone (Gas Safety: 1 yr, EICR: 5 yr, EPC: 10 yr, PAT: 1 yr).
  validity: human-readable validity period (e.g. "1 year", "5 years").

Set handoff: true if user is frustrated, repeats unanswered question, or explicitly asks for a human.`;

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
