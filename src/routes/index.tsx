import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Flame,
  Zap,
  Leaf,
  Plug,
  Droplets,
  ShieldAlert,
  CheckCircle2,
  ClipboardCheck,
  CalendarClock,
  Mail,
  LogIn,
  Phone,
  Tag,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import gasSafeAsset from "@/assets/gas-safe.jpg.asset.json";
import napitAsset from "@/assets/napit.jpg.asset.json";
import stromaAsset from "@/assets/stroma.jpg.asset.json";
import trustmarkAsset from "@/assets/trustmark.jpg.asset.json";
import trustpilotAsset from "@/assets/trustpilot.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Landlord Certificates · Gas, Electric & EPC booked in 60 seconds" },
      {
        name: "description",
        content:
          "Gas Safety, EICR, EPC, PAT and Legionella certificates for London landlords. Gas Safe, NAPIT, Stroma and TrustMark accredited. 14 years trading.",
      },
      { property: "og:title", content: "Landlord Certificates, booked in 60 seconds" },
      {
        property: "og:description",
        content: "London's calmest way to stay compliant. Certified engineers, fixed prices, next-day slots.",
      },
    ],
  }),
  component: DirectionA,
});

type Service = {
  code: string;
  name: string;
  price: number;
  turn: string;
  context: string;
  valid: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
};

const SERVICES: Service[] = [
  {
    code: "CP12",
    name: "Gas Safety (CP12)",
    price: 40,
    turn: "Same day",
    context: "Legally required for every rental with a gas appliance. Renewed annually before expiry.",
    valid: "Valid 12 months",
    icon: Flame,
  },
  {
    code: "EICR",
    name: "Electrical (EICR)",
    price: 70,
    turn: "24 hrs",
    context: "Mandatory electrical inspection for all private rentals in England since 2020.",
    valid: "Valid 5 years",
    icon: Zap,
  },
  {
    code: "EPC",
    name: "Energy (EPC)",
    price: 65,
    turn: "48 hrs",
    context: "Required before letting. Minimum rating E, rising to C from 2028 for new tenancies.",
    valid: "Valid 10 years",
    icon: Leaf,
  },
  {
    code: "PAT",
    name: "PAT Testing",
    price: 55,
    turn: "Same day",
    context: "Portable appliance testing, best practice for furnished lets and HMOs.",
    valid: "Recommended yearly",
    icon: Plug,
  },
  {
    code: "LEG",
    name: "Legionella Risk",
    price: 65,
    turn: "48 hrs",
    context: "Risk assessment of the water system, a landlord's duty under HSE guidance.",
    valid: "Review every 2 years",
    icon: Droplets,
  },
  {
    code: "FIRE",
    name: "Fire Risk",
    price: 95,
    turn: "48 hrs",
    context: "Required for HMOs and communal areas under the Fire Safety Order.",
    valid: "Review annually",
    icon: ShieldAlert,
  },
];

const BUNDLES = [
  { name: "Gas + Electric", codes: ["CP12", "EICR"], save: "Save £11" },
  { name: "New Tenancy Pack", codes: ["CP12", "EICR", "EPC"], save: "Save £22" },
  { name: "HMO Compliance", codes: ["CP12", "EICR", "EPC", "FIRE", "LEG"], save: "Save £40" },
];

const FAQS = [
  {
    q: "How quickly can an engineer attend?",
    a: "Most London bookings get a same-day or next-day slot. Choose your preferred window at checkout and we confirm by SMS within 15 minutes.",
  },
  {
    q: "What happens if my property fails the inspection?",
    a: "You receive a detailed report of any C1/C2 issues with transparent remedial quotes. No pressure, you can use your own contractor and we re-issue the certificate free once work is signed off.",
  },
  {
    q: "Do you cover all London boroughs?",
    a: "Yes, all 32 London boroughs plus the City. We also cover Zones 1 to 6 surrounding areas including Croydon, Bromley, Watford and Romford.",
  },
  {
    q: "Can I store and share certificates with tenants and agents?",
    a: "Every certificate is stored in your free landlord portal. One click to email the PDF to a tenant, agent or local authority.",
  },
  {
    q: "Do you offer discounts for portfolios or agents?",
    a: "Yes, 15% off for 5+ properties and dedicated account management for letting agents. Get in touch for a tailored quote.",
  },
];

const CHECKLIST = [
  "Clear access to the boiler, gas meter and consumer unit",
  "Pilot lights lit and gas supply turned on",
  "All rooms accessible, including loft if applicable",
  "Pets secured during the visit",
  "Previous certificates handy (we'll cross-check)",
  "Someone aged 18+ on site, or keys with the concierge",
];

function DirectionA() {
  const [selected, setSelected] = useState<string[]>(["CP12", "EICR"]);
  const [postcode, setPostcode] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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
      {/* OFFER BAR */}
      <div className="text-white text-center text-xs py-2 px-4" style={{ background: "var(--navy-deep)" }}>
        <span className="inline-flex items-center gap-2">
          <Tag className="h-3.5 w-3.5" style={{ color: "var(--emerald)" }} />
          <strong>June offer:</strong> Save 15% on any 2+ certificates · use code{" "}
          <span className="font-mono px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.1)" }}>BUNDLE15</span>
        </span>
      </div>

      {/* NAV */}
      <header className="sticky top-0 z-40 border-b" style={{ background: "rgba(253,252,248,0.85)", backdropFilter: "blur(12px)", borderColor: "var(--line)" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md" style={{ background: "var(--navy)" }} />
            <span className="text-[15px] font-semibold tracking-tight">Landlord Certificates</span>
          </div>
          <nav className="hidden gap-7 text-sm md:flex" style={{ color: "var(--ink-soft)" }}>
            <a href="#services" className="hover:text-[var(--navy)]">Certificates</a>
            <a href="#offers" className="hover:text-[var(--navy)]">Offers</a>
            <a href="#how" className="hover:text-[var(--navy)]">How it works</a>
            <a href="#faq" className="hover:text-[var(--navy)]">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <a href="tel:02034881555" className="hidden text-sm font-medium md:inline-flex items-center gap-1.5" style={{ color: "var(--ink)" }}>
              <Phone className="h-3.5 w-3.5" /> 020 3488 1555
            </a>
            <a href="/portal" className="hidden md:inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium" style={{ borderColor: "var(--line)", color: "var(--ink)" }}>
              <LogIn className="h-3.5 w-3.5" /> Sign in
            </a>
            <a href="#quote" className="rounded-md px-4 py-2 text-sm font-semibold text-white" style={{ background: "var(--emerald-deep)" }}>Get quote</a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto grid max-w-6xl gap-12 px-6 pt-16 pb-20 lg:grid-cols-[1.1fr_1fr] lg:pt-24">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs" style={{ borderColor: "var(--line)", color: "var(--ink-soft)" }}>
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "var(--emerald)" }} />
            Gas Safe · NAPIT · Stroma · TrustMark · 14 years in London
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
            <Stat n="4.7/5" l="on Trustpilot" />
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
              const Icon = s.icon;
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
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" style={{ color: on ? "var(--emerald-deep)" : "var(--ink-soft)" }} />
                    <div className="text-[13px] font-semibold">{s.name}</div>
                  </div>
                  <div className="mt-1 text-xs" style={{ color: "var(--ink-soft)" }}>from £{s.price} · {s.turn}</div>
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

      {/* ACCREDITATIONS */}
      <section id="trust" className="border-y" style={{ borderColor: "var(--line)", background: "white" }}>
        <div className="mx-auto max-w-6xl px-6 py-7">
          <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--ink-soft)" }}>
              Accredited by
            </div>

            <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
              <AccredBadge logo={gasSafeAsset.url} name="Gas Safe" sub="Reg. No. 552272" />
              <AccredBadge logo={napitAsset.url} name="NAPIT" sub="Certified" />
              <AccredBadge logo={stromaAsset.url} name="Stroma" sub="Certified" />
              <AccredBadge logo={trustmarkAsset.url} name="TrustMark" sub="Gov. Endorsed" />
            </div>

            {/* Trustpilot card */}
            <div className="flex items-center gap-3 rounded-lg border px-4 py-3" style={{ borderColor: "var(--line)", background: "color-mix(in oklab, var(--emerald) 5%, white)" }}>
              <img src={trustpilotAsset.url} alt="Trustpilot" className="h-10 w-auto object-contain" />
              <div className="hidden sm:block h-9 w-px" style={{ background: "var(--line)" }} />
              <div className="hidden sm:block leading-tight">
                <div className="text-[16px] font-extrabold" style={{ color: "var(--ink)" }}>4.7 out of 5</div>
                <div className="text-[11px]" style={{ color: "var(--ink-soft)" }}>3,554 verified reviews</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OFFERS / BUNDLES */}
      <section id="offers" className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--emerald-deep)" }}>This month</div>
            <h2 className="mt-2 text-[32px] font-bold tracking-tight">Bundle and save up to 20%.</h2>
          </div>
          <a href="#quote" className="text-sm font-semibold inline-flex items-center gap-1" style={{ color: "var(--navy)" }}>
            Build your own bundle <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {BUNDLES.map((b) => {
            const items = SERVICES.filter((s) => b.codes.includes(s.code));
            const sum = items.reduce((a, c) => a + c.price, 0);
            return (
              <div key={b.name} className="rounded-2xl border bg-white p-6" style={{ borderColor: "var(--line)" }}>
                <div className="flex items-center justify-between">
                  <div className="text-[15px] font-semibold">{b.name}</div>
                  <span className="text-xs font-semibold rounded-full px-2 py-0.5" style={{ background: "color-mix(in oklab, var(--emerald) 14%, white)", color: "var(--emerald-deep)" }}>{b.save}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {items.map((i) => {
                    const Icon = i.icon;
                    return (
                      <span key={i.code} className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs" style={{ borderColor: "var(--line)", color: "var(--ink-soft)" }}>
                        <Icon className="h-3 w-3" /> {i.code}
                      </span>
                    );
                  })}
                </div>
                <div className="mt-5 flex items-end justify-between border-t pt-4" style={{ borderColor: "var(--line)" }}>
                  <div className="text-2xl font-bold" style={{ color: "var(--navy-deep)" }}>£{sum - Number(b.save.replace(/\D/g, ""))}</div>
                  <a href="#quote" className="text-sm font-semibold" style={{ color: "var(--navy)" }}>Choose →</a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW, tightened layout: icon + number on same line */}
      <section id="how" className="border-y" style={{ borderColor: "var(--line)", background: "white" }}>
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="max-w-2xl text-[36px] font-bold leading-tight tracking-tight">
            The calmest way to stay compliant.
          </h2>
          <p className="mt-3 max-w-xl text-[15px]" style={{ color: "var(--ink-soft)" }}>
            Three steps. No phone tag, no paper trail, no surprise fees.
          </p>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              {
                n: "01",
                t: "Choose & quote",
                d: "Pick the certificates you need above for a live price, or call us and we'll find the earliest slot at your property.",
                icon: ClipboardCheck,
              },
              {
                n: "02",
                t: "Engineer visits",
                d: "A Gas Safe or NAPIT-registered engineer attends, with same-day and next-day slots across every London borough.",
                icon: CalendarClock,
              },
              {
                n: "03",
                t: "Certificate delivered",
                d: "Your signed PDF arrives by email the same day, stored securely in your landlord portal and shareable in one click.",
                icon: Mail,
              },
            ].map(({ n, t, d, icon: Icon }) => (
              <div key={n}>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "color-mix(in oklab, var(--emerald) 12%, white)" }}>
                    <Icon className="h-5 w-5" style={{ color: "var(--emerald-deep)" }} />
                  </div>
                  <div className="text-sm font-bold tracking-wider" style={{ color: "var(--emerald-deep)" }}>{n}</div>
                </div>
                <div className="mt-4 text-lg font-semibold">{t}</div>
                <div className="mt-1.5 text-[15px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="mx-auto max-w-6xl px-6 py-24">
        <div className="flex items-end justify-between">
          <h2 className="text-[36px] font-bold tracking-tight max-w-xl">Every certificate a London landlord needs.</h2>
          <a className="hidden md:inline text-sm font-semibold" style={{ color: "var(--navy)" }}>Compare all →</a>
        </div>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border md:grid-cols-2 lg:grid-cols-3" style={{ borderColor: "var(--line)", background: "var(--line)" }}>
          {SERVICES.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.code} className="bg-white p-7 flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: "color-mix(in oklab, var(--emerald) 12%, white)" }}>
                    <Icon className="h-5 w-5" style={{ color: "var(--emerald-deep)" }} />
                  </div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--ink-soft)" }}>{s.code}</div>
                </div>
                <div className="mt-4 text-lg font-semibold">{s.name}</div>
                <div className="mt-1 text-sm" style={{ color: "var(--ink-soft)" }}>{s.turn} turnaround · {s.valid}</div>
                <p className="mt-3 text-[14px] leading-relaxed flex-1" style={{ color: "var(--ink-soft)" }}>{s.context}</p>
                <div className="mt-6 flex items-end justify-between border-t pt-4" style={{ borderColor: "var(--line)" }}>
                  <div>
                    <div className="text-xs" style={{ color: "var(--ink-soft)" }}>from</div>
                    <div className="text-2xl font-bold">£{s.price}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <a className="text-sm font-semibold" style={{ color: "var(--navy)" }}>Book →</a>
                    <a className="text-xs" style={{ color: "var(--ink-soft)" }}>Learn more</a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* PRE-INSPECTION CHECKLIST */}
      <section className="border-y" style={{ borderColor: "var(--line)", background: "white" }}>
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1fr_1.2fr] items-start">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--emerald-deep)" }}>Before we arrive</div>
            <h2 className="mt-2 text-[32px] font-bold tracking-tight leading-tight">A two-minute checklist for a smooth inspection.</h2>
            <p className="mt-4 text-[15px]" style={{ color: "var(--ink-soft)" }}>
              A little prep means our engineer is in and out faster, and your certificate lands in your inbox the same day.
            </p>
            <a href="#" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--navy)" }}>
              Download the full checklist (PDF) <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {CHECKLIST.map((c) => (
              <li key={c} className="flex items-start gap-3 rounded-xl border p-4" style={{ borderColor: "var(--line)" }}>
                <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: "var(--emerald-deep)" }} />
                <span className="text-[14px] leading-relaxed">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* PROOF / TRUSTPILOT */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider" style={{ background: "color-mix(in oklab, var(--navy) 8%, white)", color: "var(--navy)" }}>
              What landlords say
            </div>
            <h2 className="mt-4 text-[40px] font-bold tracking-tight leading-[1.05]" style={{ color: "var(--navy-deep)" }}>
              Trusted by 3,554<br />London landlords.
            </h2>
          </div>
          <div className="rounded-xl border bg-white px-6 py-4 text-center" style={{ borderColor: "var(--line)" }}>
            <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--ink-soft)" }}>Rated on Trustpilot</div>
            <div className="mt-1 flex items-center justify-center gap-2">
              <span style={{ color: "var(--emerald-deep)" }}>★★★★★</span>
              <span className="text-2xl font-bold">4.7</span>
            </div>
            <div className="text-xs" style={{ color: "var(--ink-soft)" }}>3,554 reviews</div>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { q: "Been using Landlord Certificates for our Gas Safeties and boiler services for years. Both the admin team and their engineers are professional and efficient, a company you can genuinely trust.", a: "Portfolio Landlord" },
            { q: "Great service, excellent communication and timely arrival. Efficient boiler service and comprehensive review of gas safety requirements. Would highly recommend to any landlord.", a: "London Landlord" },
            { q: "I have used Landlord Certificates repeatedly over the years and find them to be highly efficient and reliable. Will continue using them for the foreseeable future without hesitation.", a: "Buy-to-Let Landlord" },
          ].map(({ q, a }) => (
            <figure key={a} className="rounded-2xl border bg-white p-6" style={{ borderColor: "var(--line)" }}>
              <div className="text-sm" style={{ color: "var(--emerald-deep)" }}>★★★★★</div>
              <blockquote className="mt-3 text-[15px] leading-relaxed">"{q}"</blockquote>
              <figcaption className="mt-5 border-t pt-4" style={{ borderColor: "var(--line)" }}>
                <div className="text-sm font-semibold">{a}</div>
                <div className="text-xs" style={{ color: "var(--ink-soft)" }}>Verified Trustpilot Review</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t" style={{ borderColor: "var(--line)", background: "white" }}>
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--emerald-deep)" }}>FAQ</div>
            <h2 className="mt-2 text-[32px] font-bold tracking-tight leading-tight">Answers before you book.</h2>
            <p className="mt-4 text-[15px]" style={{ color: "var(--ink-soft)" }}>
              Still unsure? Call us on{" "}
              <a href="tel:02034881555" className="font-semibold" style={{ color: "var(--navy)" }}>020 3488 1555</a>{" "}
              for a real person, weekdays 8am to 7pm.
            </p>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--line)" }}>
            {FAQS.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q} className="border-b" style={{ borderColor: "var(--line)" }}>
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="flex w-full items-center justify-between py-5 text-left"
                  >
                    <span className="text-[16px] font-semibold pr-4">{f.q}</span>
                    <ChevronDown
                      className="h-5 w-5 flex-shrink-0 transition-transform"
                      style={{ color: "var(--ink-soft)", transform: open ? "rotate(180deg)" : "none" }}
                    />
                  </button>
                  {open && (
                    <p className="pb-5 text-[15px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>{f.a}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "var(--navy-deep)", color: "white" }}>
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-10 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-md" style={{ background: "var(--emerald)" }} />
                <span className="font-semibold">Landlord Certificates</span>
              </div>
              <p className="mt-4 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>London's certificate experts since 2010. Gas Safe 552272.</p>
              <a href="/portal" className="mt-5 inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium" style={{ borderColor: "rgba(255,255,255,0.2)", color: "white" }}>
                <LogIn className="h-3.5 w-3.5" /> Landlord portal
              </a>
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

function AccredBadge({ logo, name, sub }: { logo: string; name: string; sub: string }) {
  return (
    <div className="flex items-center gap-3">
      <img src={logo} alt={`${name} ${sub}`} className="h-14 w-auto object-contain" />
      <div className="leading-tight">
        <div className="text-[13px] font-semibold" style={{ color: "var(--ink)" }}>{name}</div>
        <div className="text-[11px]" style={{ color: "var(--ink-soft)" }}>{sub}</div>
      </div>
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
