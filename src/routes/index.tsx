import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Landlord Certificates — Gas, Electric & EPC, booked in 60 seconds" },
      {
        name: "description",
        content:
          "Gas Safety, EICR, EPC, PAT and Legionella certificates for London landlords. Gas Safe registered, 14 years trading, 12,000+ certificates issued. Instant online booking.",
      },
      { property: "og:title", content: "Landlord Certificates — booked in 60 seconds" },
      {
        property: "og:description",
        content: "London's calmest way to stay compliant. Certified engineers, fixed prices, next-day slots.",
      },
    ],
  }),
  component: DirectionA,
});

const SERVICES = [
  { code: "CP12", name: "Gas Safety (CP12)", price: 60, turn: "Same day" },
  { code: "EICR", name: "Electrical (EICR)", price: 120, turn: "24 hrs" },
  { code: "EPC", name: "Energy (EPC)", price: 60, turn: "48 hrs" },
  { code: "PAT", name: "PAT Testing", price: 60, turn: "Same day" },
  { code: "LEG", name: "Legionella Risk", price: 65, turn: "48 hrs" },
  { code: "FIRE", name: "Fire Risk", price: 95, turn: "48 hrs" },
];

function DirectionA() {
  const [selected, setSelected] = useState<string[]>(["CP12", "EICR"]);
  const [postcode, setPostcode] = useState("");

  const toggle = (code: string) =>
    setSelected((s) => (s.includes(code) ? s.filter((c) => c !== code) : [...s, code]));

  const subtotal = SERVICES.filter((s) => selected.includes(s.code)).reduce((a, b) => a + b.price, 0);
  const bundleDiscount = selected.length >= 2 ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - bundleDiscount;

  return (
    <div
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        background: "var(--cream)",
        color: "var(--ink)",
      }}
      className="min-h-screen"
    >
      {/* NAV */}
      <header className="sticky top-0 z-40 border-b" style={{ background: "rgba(253,252,248,0.85)", backdropFilter: "blur(12px)", borderColor: "var(--line)" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md" style={{ background: "var(--navy)" }} />
            <span className="text-[15px] font-semibold tracking-tight">Landlord Certificates</span>
          </div>
          <nav className="hidden gap-7 text-sm md:flex" style={{ color: "var(--ink-soft)" }}>
            <a href="#services" className="hover:text-[var(--navy)]">Certificates</a>
            <a href="#how" className="hover:text-[var(--navy)]">How it works</a>
            <a href="#trust" className="hover:text-[var(--navy)]">Why us</a>
            <a href="#faq" className="hover:text-[var(--navy)]">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href="tel:02034881555" className="hidden text-sm font-medium md:block" style={{ color: "var(--ink)" }}>020 3488 1555</a>
            <a href="#quote" className="rounded-md px-4 py-2 text-sm font-semibold text-white" style={{ background: "var(--emerald-deep)" }}>Get quote</a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto grid max-w-6xl gap-12 px-6 pt-16 pb-20 lg:grid-cols-[1.1fr_1fr] lg:pt-24">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs" style={{ borderColor: "var(--line)", color: "var(--ink-soft)" }}>
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "var(--emerald)" }} />
            Gas Safe registered · NICEIC approved · 14 years in London
          </div>
          <h1 className="mt-6 text-[44px] font-bold leading-[1.05] tracking-tight lg:text-[60px]">
            Landlord certificates,<br />
            <span style={{ color: "var(--emerald-deep)" }}>booked in 60 seconds.</span>
          </h1>
          <p className="mt-6 max-w-lg text-[17px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
            Gas, electrical, energy and fire safety certificates for London landlords and letting agents. Fixed prices. Real engineers. Certificate emailed within 24 hours.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm" style={{ color: "var(--ink-soft)" }}>
            <Stat n="12,000+" l="certificates issued" />
            <Stat n="4.9/5" l="on Trustpilot" />
            <Stat n="14 yrs" l="in business" />
          </div>
        </div>

        {/* QUOTE CARD */}
        <div id="quote" className="rounded-2xl border bg-white p-6 shadow-[0_20px_60px_-30px_rgba(15,30,60,0.25)]" style={{ borderColor: "var(--line)" }}>
          <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--ink-soft)" }}>Instant quote</div>
          <div className="mt-1 text-lg font-semibold">What do you need?</div>

          <div className="mt-5 grid grid-cols-2 gap-2">
            {SERVICES.map((s) => {
              const on = selected.includes(s.code);
              return (
                <button
                  key={s.code}
                  onClick={() => toggle(s.code)}
                  className="rounded-lg border p-3 text-left transition-all"
                  style={{
                    borderColor: on ? "var(--emerald-deep)" : "var(--line)",
                    background: on ? "color-mix(in oklab, var(--emerald) 8%, white)" : "white",
                  }}
                >
                  <div className="text-[13px] font-semibold">{s.name}</div>
                  <div className="mt-0.5 text-xs" style={{ color: "var(--ink-soft)" }}>from £{s.price} · {s.turn}</div>
                </button>
              );
            })}
          </div>

          <div className="mt-5">
            <label className="text-xs font-medium" style={{ color: "var(--ink-soft)" }}>Property postcode</label>
            <input
              value={postcode}
              onChange={(e) => setPostcode(e.target.value.toUpperCase())}
              placeholder="e.g. SW11 4NP"
              className="mt-1.5 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-[var(--emerald-deep)]"
              style={{ borderColor: "var(--line)" }}
            />
          </div>

          <div className="mt-5 flex items-end justify-between border-t pt-4" style={{ borderColor: "var(--line)" }}>
            <div>
              <div className="text-xs" style={{ color: "var(--ink-soft)" }}>
                {selected.length} cert{selected.length === 1 ? "" : "s"}{bundleDiscount ? ` · 10% bundle saving` : ""}
              </div>
              <div className="text-3xl font-bold tracking-tight" style={{ color: "var(--navy-deep)" }}>£{total}</div>
            </div>
            <button className="rounded-lg px-5 py-3 text-sm font-semibold text-white" style={{ background: "var(--navy)" }}>
              Book engineer →
            </button>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section id="trust" className="border-y" style={{ borderColor: "var(--line)", background: "white" }}>
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-10 md:grid-cols-4">
          {[
            ["Gas Safe", "552272"],
            ["NICEIC", "Approved Contractor"],
            ["Trustpilot", "4.9 ★ · 412 reviews"],
            ["Insured", "£5M public liability"],
          ].map(([k, v]) => (
            <div key={k}>
              <div className="text-xs uppercase tracking-wider" style={{ color: "var(--ink-soft)" }}>{k}</div>
              <div className="mt-1 text-[15px] font-semibold">{v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="max-w-2xl text-[36px] font-bold leading-tight tracking-tight">
          The calmest way to stay compliant.
        </h2>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {[
            ["01", "Choose & quote", "Pick the certificates you need. Live price, no calls."],
            ["02", "Book a slot", "Same-day and next-day appointments across all London boroughs."],
            ["03", "Certificate by email", "Digitally signed PDF in your inbox within 24 hours of the visit."],
          ].map(([n, t, d]) => (
            <div key={n}>
              <div className="text-sm font-semibold" style={{ color: "var(--emerald-deep)" }}>{n}</div>
              <div className="mt-2 text-lg font-semibold">{t}</div>
              <div className="mt-2 text-[15px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>{d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="border-t" style={{ borderColor: "var(--line)", background: "white" }}>
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="flex items-end justify-between">
            <h2 className="text-[36px] font-bold tracking-tight">Every certificate a London landlord needs.</h2>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border md:grid-cols-2 lg:grid-cols-3" style={{ borderColor: "var(--line)", background: "var(--line)" }}>
            {SERVICES.map((s) => (
              <div key={s.code} className="bg-white p-7">
                <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--emerald-deep)" }}>{s.code}</div>
                <div className="mt-2 text-lg font-semibold">{s.name}</div>
                <div className="mt-1 text-sm" style={{ color: "var(--ink-soft)" }}>{s.turn} turnaround</div>
                <div className="mt-6 flex items-end justify-between">
                  <div>
                    <div className="text-xs" style={{ color: "var(--ink-soft)" }}>from</div>
                    <div className="text-2xl font-bold">£{s.price}</div>
                  </div>
                  <a className="text-sm font-semibold" style={{ color: "var(--navy)" }}>Book →</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROOF */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-10 md:grid-cols-3">
          {[
            ["Booked the CP12 and EICR together at 9pm, engineer arrived 10am the next day. Certificates by lunch.", "Priya · Battersea"],
            ["We manage 80 units. Their portal saves us a full day a week of chasing.", "James · Foxtons Wandsworth"],
            ["Honest pricing, no surprise add-ons. The only certificate company I now use.", "Mehmet · Hackney"],
          ].map(([q, a]) => (
            <figure key={a as string} className="rounded-2xl border p-6" style={{ borderColor: "var(--line)" }}>
              <div className="text-sm" style={{ color: "var(--emerald-deep)" }}>★★★★★</div>
              <blockquote className="mt-3 text-[15px] leading-relaxed">"{q}"</blockquote>
              <figcaption className="mt-4 text-xs" style={{ color: "var(--ink-soft)" }}>{a}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t" style={{ borderColor: "var(--line)", background: "var(--navy-deep)", color: "white" }}>
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-10 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-md" style={{ background: "var(--emerald)" }} />
                <span className="font-semibold">Landlord Certificates</span>
              </div>
              <p className="mt-4 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>London's certificate experts since 2010. Gas Safe 552272.</p>
            </div>
            <FooterCol title="Certificates" items={["Gas Safety", "EICR", "EPC", "PAT", "Legionella", "Fire Risk"]} />
            <FooterCol title="Coverage" items={["Wandsworth", "Hackney", "Camden", "Lambeth", "All boroughs"]} />
            <FooterCol title="Company" items={["About", "Reviews", "Contact", "Terms", "Privacy"]} />
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-between border-t pt-6 text-xs" style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}>
            <div>© 2026 Landlord Certificates Ltd.</div>
            <Link to="/direction-c" className="underline">View Direction C →</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="text-xl font-bold" style={{ color: "var(--navy-deep)" }}>{n}</div>
      <div className="text-xs">{l}</div>
    </div>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.5)" }}>{title}</div>
      <ul className="mt-4 space-y-2 text-sm">
        {items.map((i) => <li key={i}><a className="hover:text-white" style={{ color: "rgba(255,255,255,0.75)" }}>{i}</a></li>)}
      </ul>
    </div>
  );
}
