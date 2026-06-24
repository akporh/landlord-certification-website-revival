import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/direction-c")({
  head: () => ({
    meta: [
      { title: "Direction C — Engineer's Console" },
      { name: "description", content: "Alternate design direction for landlord-certificates.co.uk" },
    ],
  }),
  component: DirectionC,
});

const SERVICES = [
  { code: "CP12", name: "Gas Safety", price: 60, turn: "Same day" },
  { code: "EICR", name: "Electrical", price: 120, turn: "24 hrs" },
  { code: "EPC", name: "Energy", price: 60, turn: "48 hrs" },
  { code: "PAT", name: "PAT Testing", price: 60, turn: "Same day" },
  { code: "LEG", name: "Legionella", price: 65, turn: "48 hrs" },
  { code: "FIRE", name: "Fire Risk", price: 95, turn: "48 hrs" },
];

function DirectionC() {
  const [selected, setSelected] = useState<string[]>(["CP12", "EICR"]);
  const toggle = (code: string) =>
    setSelected((s) => (s.includes(code) ? s.filter((c) => c !== code) : [...s, code]));
  const subtotal = SERVICES.filter((s) => selected.includes(s.code)).reduce((a, b) => a + b.price, 0);
  const discount = selected.length >= 2 ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - discount;

  return (
    <div
      className="min-h-screen"
      style={{
        fontFamily: "'Space Grotesk', system-ui, sans-serif",
        background: "var(--c-bg)",
        color: "var(--c-text)",
      }}
    >
      {/* MARQUEE */}
      <div className="overflow-hidden border-b py-2 text-[11px] uppercase tracking-[0.2em]" style={{ borderColor: "var(--c-line)", color: "var(--c-muted)" }}>
        <div className="flex animate-[marquee_30s_linear_infinite] gap-12 whitespace-nowrap">
          {Array(3).fill(null).map((_, i) => (
            <div key={i} className="flex gap-12">
              <span>● Gas Safe 552272</span>
              <span>● NICEIC Approved</span>
              <span>● 12,847 certificates issued</span>
              <span>● 4.9 ★ Trustpilot</span>
              <span>● £5M Insurance</span>
              <span>● Operating since 2010</span>
            </div>
          ))}
        </div>
      </div>

      {/* NAV */}
      <header className="border-b" style={{ borderColor: "var(--c-line)" }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-sm" style={{ background: "var(--c-lime)" }} />
            <span className="text-sm font-semibold tracking-tight">LANDLORD/CERTS</span>
          </div>
          <nav className="hidden gap-8 text-[13px] md:flex" style={{ color: "var(--c-muted)" }}>
            <a href="#">Certificates</a>
            <a href="#">Coverage</a>
            <a href="#">For agents</a>
            <a href="#">API</a>
          </nav>
          <button className="rounded-sm px-4 py-2 text-[13px] font-semibold" style={{ background: "var(--c-lime)", color: "var(--c-bg)" }}>
            Book →
          </button>
        </div>
      </header>

      {/* HERO — Console centerpiece */}
      <section className="mx-auto max-w-7xl px-6 pt-20 pb-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr_1fr]">
          <div className="flex flex-col justify-end">
            <div className="text-[11px] uppercase tracking-[0.25em]" style={{ color: "var(--c-muted)" }}>// quote engine</div>
            <div className="mt-6 font-mono text-xs leading-loose" style={{ color: "var(--c-muted)" }}>
              status: <span style={{ color: "var(--c-lime)" }}>online</span><br />
              engineers: <span style={{ color: "var(--c-text)" }}>24 active</span><br />
              avg dispatch: <span style={{ color: "var(--c-text)" }}>4h 12m</span><br />
              today's bookings: <span style={{ color: "var(--c-text)" }}>87</span>
            </div>
          </div>

          {/* QUOTE CONSOLE */}
          <div className="rounded-md border p-6" style={{ borderColor: "var(--c-line)", background: "var(--c-surface)" }}>
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em]" style={{ color: "var(--c-muted)" }}>
              <span>Instant quote</span>
              <span style={{ color: "var(--c-lime)" }}>● live</span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-1.5">
              {SERVICES.map((s) => {
                const on = selected.includes(s.code);
                return (
                  <button
                    key={s.code}
                    onClick={() => toggle(s.code)}
                    className="rounded-sm border p-3 text-left transition-all"
                    style={{
                      borderColor: on ? "var(--c-lime)" : "var(--c-line)",
                      background: on ? "color-mix(in oklab, var(--c-lime) 12%, var(--c-surface))" : "transparent",
                      color: on ? "var(--c-lime)" : "var(--c-text)",
                    }}
                  >
                    <div className="font-mono text-[10px]" style={{ color: on ? "var(--c-lime)" : "var(--c-muted)" }}>{s.code}</div>
                    <div className="mt-1 text-[13px] font-semibold">{s.name}</div>
                    <div className="mt-2 font-mono text-[11px]">£{s.price}</div>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <input placeholder="POSTCODE" className="rounded-sm border bg-transparent px-3 py-2.5 text-sm uppercase outline-none placeholder:text-[var(--c-muted)] focus:border-[var(--c-lime)]" style={{ borderColor: "var(--c-line)" }} />
              <input placeholder="EMAIL" className="rounded-sm border bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-[var(--c-muted)] focus:border-[var(--c-lime)]" style={{ borderColor: "var(--c-line)" }} />
            </div>

            <div className="mt-5 flex items-end justify-between border-t pt-5" style={{ borderColor: "var(--c-line)" }}>
              <div>
                <div className="font-mono text-[11px]" style={{ color: "var(--c-muted)" }}>
                  {selected.length} ITEMS{discount ? ` // -£${discount}` : ""}
                </div>
                <div className="text-4xl font-bold tracking-tight">£{total}</div>
              </div>
              <button className="rounded-sm px-5 py-3 text-[13px] font-bold uppercase tracking-wider" style={{ background: "var(--c-lime)", color: "var(--c-bg)" }}>
                Dispatch →
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-end text-right">
            <div className="text-[11px] uppercase tracking-[0.25em]" style={{ color: "var(--c-muted)" }}>// last booked</div>
            <div className="mt-6 space-y-3 font-mono text-[11px]" style={{ color: "var(--c-muted)" }}>
              <div>SW11 · CP12 · 2m ago</div>
              <div>E8 · EICR+EPC · 7m ago</div>
              <div>NW1 · PAT · 12m ago</div>
              <div>SE15 · CP12 · 18m ago</div>
            </div>
          </div>
        </div>

        {/* HUGE HEADLINE */}
        <h1 className="mt-20 text-[88px] font-bold leading-[0.92] tracking-[-0.04em] md:text-[128px]">
          Compliance,<br />
          <span style={{ color: "var(--c-lime)" }}>dispatched.</span>
        </h1>
        <p className="mt-8 max-w-xl text-[17px] leading-relaxed" style={{ color: "var(--c-muted)" }}>
          Every certificate a London landlord needs, booked from a single console. Engineers in 24 boroughs. Certificate in your inbox before the engineer leaves the property.
        </p>
      </section>

      {/* GRID OF TILES */}
      <section className="border-t" style={{ borderColor: "var(--c-line)" }}>
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="text-[11px] uppercase tracking-[0.25em]" style={{ color: "var(--c-muted)" }}>// service catalogue</div>
          <div className="mt-8 grid gap-px" style={{ background: "var(--c-line)", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            {SERVICES.map((s, i) => (
              <div key={s.code} className="p-7" style={{ background: "var(--c-bg)" }}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px]" style={{ color: "var(--c-muted)" }}>{String(i + 1).padStart(2, "0")} / {SERVICES.length}</span>
                  <span className="font-mono text-[10px]" style={{ color: "var(--c-lime)" }}>{s.code}</span>
                </div>
                <div className="mt-12 text-2xl font-semibold tracking-tight">{s.name}</div>
                <div className="mt-1 text-[13px]" style={{ color: "var(--c-muted)" }}>{s.turn}</div>
                <div className="mt-8 flex items-end justify-between">
                  <div className="text-3xl font-bold">£{s.price}</div>
                  <button className="text-[11px] uppercase tracking-wider" style={{ color: "var(--c-lime)" }}>Book →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE FEED */}
      <section className="border-t" style={{ borderColor: "var(--c-line)" }}>
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-2">
          <div>
            <div className="text-[11px] uppercase tracking-[0.25em]" style={{ color: "var(--c-muted)" }}>// trustpilot · live</div>
            <h2 className="mt-6 text-5xl font-bold tracking-tight">4.9 / 5</h2>
            <div className="mt-2 text-[13px]" style={{ color: "var(--c-muted)" }}>412 verified reviews</div>
          </div>
          <div className="space-y-px" style={{ background: "var(--c-line)" }}>
            {[
              ["Engineer arrived in the 30 minute window. Certificate by 2pm.", "Priya · SW11"],
              ["The agent portal alone is worth it. Saves us a day a week.", "Foxtons · SW18"],
              ["Honest pricing. No surprise fees. Booked them again same week.", "Mehmet · E8"],
            ].map(([q, a]) => (
              <div key={a as string} className="p-6" style={{ background: "var(--c-bg)" }}>
                <div style={{ color: "var(--c-lime)" }}>★★★★★</div>
                <p className="mt-2 text-[14px] leading-relaxed">"{q}"</p>
                <div className="mt-3 font-mono text-[11px]" style={{ color: "var(--c-muted)" }}>{a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t" style={{ borderColor: "var(--c-line)" }}>
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-6 py-10 text-[12px]" style={{ color: "var(--c-muted)" }}>
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-sm" style={{ background: "var(--c-lime)" }} />
            <span>LANDLORD/CERTS · GAS SAFE 552272 · NICEIC</span>
          </div>
          <Link to="/" className="underline">← Back to Direction A</Link>
        </div>
      </footer>

      <style>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-33.333%); } }
      `}</style>
    </div>
  );
}
