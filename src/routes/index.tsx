import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import {
  Flame,
  Zap,
  Leaf,
  Plug,
  Lightbulb,
  Bell,
  CheckCircle2,
  ClipboardCheck,
  CalendarClock,
  Mail,
  LogIn,
  Phone,
  Tag,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Star,
  MessageCircle,
  X,
  Send,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import gasSafeLogo from "@/assets/gas-safe.jpg";
import napitLogo from "@/assets/napit.jpg";
import stromaLogo from "@/assets/stroma.jpg";
import trustmarkLogo from "@/assets/trustmark.jpg";
import trustpilotLogo from "@/assets/trustpilot.svg";
import lcLogo from "@/assets/lc-logo.png";
import lcBot from "@/assets/lc-bot.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Landlord Certificates · Gas, Electric & EPC booked in 60 seconds" },
      {
        name: "description",
        content:
          "Gas Safety, EICR, EPC and PAT certificates for London landlords. Gas Safe 552272, NAPIT, Stroma and TrustMark accredited. 14 years trading.",
      },
      { property: "og:title", content: "Landlord Certificates, booked in 60 seconds" },
      {
        property: "og:description",
        content: "London's calmest way to stay compliant. Certified engineers, fixed prices, certificate emailed within 24 hours.",
      },
    ],
  }),
  component: DirectionA,
});

type ResidentialService = {
  code: string;
  name: string;
  price: number;
  turn: string;
  context: string;
  valid: string;
  pricingNote: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  covered: string[];
  notCovered: string[];
};

const SERVICES: ResidentialService[] = [
  {
    code: "CP12",
    name: "Gas Safety (CP12)",
    price: 40,
    turn: "Same day",
    context: "Legally required for every rental with a gas appliance. Renewed annually before expiry.",
    valid: "Valid 12 months",
    pricingNote: "from £40 · price depends on number of appliances",
    icon: Flame,
    covered: [
      "Gas meter, boiler, hob, oven and fireplace",
      "All gas connections and pipework",
      "Flue and ventilation checks",
      "Pressure and flow tests",
    ],
    notCovered: [
      "Inaccessible flues or boiler compartments",
      "Repairs or parts (separate quote provided)",
    ],
  },
  {
    code: "EICR",
    name: "Electrical (EICR)",
    price: 70,
    turn: "24 hrs",
    context: "Mandatory electrical inspection for all private rentals in England since 2020.",
    valid: "Valid 5 years",
    pricingNote: "from £70 · price depends on property size and circuits",
    icon: Zap,
    covered: [
      "Visual + dead + live testing of all circuits",
      "Consumer unit / fuse board inspection",
      "C1, C2 and C3 fault grading with report",
      "Earthing and bonding checks",
    ],
    notCovered: [
      "3-phase supply (extra charge — call for quote)",
      "Remedial work (separate quote provided)",
    ],
  },
  {
    code: "EPC",
    name: "Energy (EPC)",
    price: 65,
    turn: "48 hrs",
    context: "Required before letting. Minimum rating E, rising to C from 2028 for new tenancies.",
    valid: "Valid 10 years",
    pricingNote: "from £65 · price depends on property size",
    icon: Leaf,
    covered: [
      "Heating, insulation, lighting and windows",
      "Hot water system assessment",
      "Energy efficiency rating (A–G)",
      "Improvement recommendations",
    ],
    notCovered: [
      "Commercial properties (separate commercial EPC)",
      "Planning permissions for extensions",
    ],
  },
  {
    code: "PAT",
    name: "PAT Testing",
    price: 55,
    turn: "Same day",
    context: "Portable appliance testing, best practice for furnished lets and HMOs.",
    valid: "Recommended yearly",
    pricingNote: "from £55 · price depends on number of items",
    icon: Plug,
    covered: [
      "Visual inspection and electrical test",
      "All portable appliances including extension leads",
      "Pass/fail labels applied to each item",
      "Written report of all tested items",
    ],
    notCovered: [
      "Fixed appliances (covered under EICR)",
      "Built-in ovens or hobs",
    ],
  },
];

const COMMERCIAL_SERVICES = [
  {
    icon: Lightbulb,
    name: "Emergency Lighting Certificate",
    price: "£90",
    desc: "Required for all HMOs and commercial properties. Annual inspection and certification.",
  },
  {
    icon: Bell,
    name: "Fire Alarm Testing",
    price: "£90",
    desc: "Domestic and commercial properties. 6-monthly testing recommended by BS 5839.",
  },
  {
    icon: Zap,
    name: "Commercial EICR",
    price: "from £150",
    desc: "Priced by circuit count. Required for commercial premises and larger HMOs.",
  },
];

const JUNE_DEALS = [
  {
    label: "June Deal \u2014 Ends 30 June",
    name: "Gas Safety + Boiler Service",
    price: 85,
    saving: "Save ~\u00a340 vs. booking separately",
    cards: [
      { title: "Gas Safety", sub: "CP12 Certificate", color: "#B8860B" },
      { title: "Boiler Service", sub: "Annual inspection", color: "#1B579A" },
    ],
  },
  {
    label: "June Deal \u2014 Ends 30 June",
    name: "EICR + PAT Testing",
    sub: "1\u20133 bed \u00b7 up to 20 items",
    price: 99,
    saving: "Save \u00a346 vs. booking separately",
    cards: [
      { title: "EICR", sub: "Electrical inspection", color: "#1B579A" },
      { title: "PAT Testing", sub: "Up to 20 items", color: "#3D7516" },
    ],
  },
];

const CHECKLISTS = {
  CP12: [
    "Clear access to boiler and gas meter",
    "Pilot light lit and gas supply on",
    "All rooms accessible including loft",
    "Pets secured during the visit",
    "Previous Gas Safety Certificate to hand",
    "Someone aged 18+ on site",
  ],
  EICR: [
    "Access to consumer unit / fuse board",
    "All rooms accessible including cupboards",
    "Any known electrical faults noted in advance",
    "Keys for any locked cupboards or meter boxes",
    "Someone aged 18+ on site",
  ],
  EPC: [
    "Access to loft hatch (insulation measured)",
    "Heating and hot water operational",
    "All rooms accessible",
    "Planning permissions for extensions available if applicable",
    "Someone aged 18+ on site",
  ],
  PAT: [
    "List of all portable appliances compiled",
    "All appliances accessible and not in use",
    "Extension leads and power strips included",
    "Recently repaired items flagged to engineer",
    "Someone aged 18+ on site",
  ],
};

const USPS = [
  {
    icon: ShieldCheck,
    heading: "Won't be beaten on price",
    body: "Fixed prices, no hidden fees. We'll match any like-for-like written quote.",
  },
  {
    icon: Zap,
    heading: "Fast London availability",
    body: "Every borough covered. Most bookings confirmed within 15 minutes by SMS.",
  },
  {
    icon: Star,
    heading: "3,554 verified reviews",
    body: "4.7 on Trustpilot. Over 12,000 certificates issued since 2012.",
  },
];

const FAQS = [
  {
    q: "How quickly can an engineer attend?",
    a: "Most London bookings are confirmed within 15 minutes by SMS. Choose your preferred window at checkout and we'll find the earliest available slot at your property.",
  },
  {
    q: "What happens if my property fails the inspection?",
    a: "You receive a detailed report of any C1/C2 issues with transparent remedial quotes. No pressure — you can use your own contractor and we re-issue the certificate free once work is signed off.",
  },
  {
    q: "Do you cover all London boroughs?",
    a: "Yes, all 32 London boroughs plus the City of London. We also cover surrounding areas including Croydon, Bromley, Watford and Romford.",
  },
  {
    q: "Can I store and share certificates with tenants and agents?",
    a: "Every certificate is stored in your free landlord portal. One click to email the PDF to a tenant, agent or local authority.",
  },
  {
    q: "Do you offer discounts for portfolios or agents?",
    a: "Yes — portfolio and agent rates available. Call us on 0203 772 5959 for a tailored quote.",
  },
];

type BoroughTile = { name: string; short: string; col: number; row: number; inner: boolean };

const BOROUGH_TILES: BoroughTile[] = [
  // Outer — Zone 3–4 (next-day)
  { name: "Enfield",        short: "ENFL",  col: 3, row: 0, inner: false },
  { name: "Harrow",         short: "HARR",  col: 0, row: 1, inner: false },
  { name: "Barnet",         short: "BARN",  col: 2, row: 1, inner: false },
  { name: "Haringey",       short: "HARI",  col: 3, row: 1, inner: false },
  { name: "Waltham Forest", short: "WLTH",  col: 4, row: 1, inner: false },
  { name: "Havering",       short: "HAVE",  col: 6, row: 1, inner: false },
  { name: "Hillingdon",     short: "HILD",  col: 0, row: 2, inner: false },
  { name: "Brent",          short: "BREN",  col: 1, row: 2, inner: false },
  { name: "Redbridge",      short: "REDB",  col: 6, row: 2, inner: false },
  { name: "Barking & D",    short: "BARK",  col: 7, row: 2, inner: false },
  { name: "Ealing",         short: "EALG",  col: 1, row: 3, inner: false },
  { name: "Newham",         short: "NWHM",  col: 7, row: 3, inner: false },
  { name: "Hounslow",       short: "HOUN",  col: 0, row: 4, inner: false },
  { name: "Richmond",       short: "RICH",  col: 1, row: 4, inner: false },
  { name: "Bexley",         short: "BEXL",  col: 8, row: 4, inner: false },
  { name: "Kingston",       short: "KING",  col: 2, row: 5, inner: false },
  { name: "Merton",         short: "MERT",  col: 3, row: 5, inner: false },
  { name: "Croydon",        short: "CROY",  col: 5, row: 5, inner: false },
  { name: "Bromley",        short: "BROM",  col: 7, row: 5, inner: false },
  { name: "Sutton",         short: "SUTT",  col: 3, row: 6, inner: false },
  // Inner — Zone 1–2 (same-day)
  { name: "Camden",         short: "CAMDN", col: 3, row: 2, inner: true },
  { name: "Islington",      short: "ISLN",  col: 4, row: 2, inner: true },
  { name: "Hackney",        short: "HACK",  col: 5, row: 2, inner: true },
  { name: "H&F",            short: "H&F",   col: 2, row: 3, inner: true },
  { name: "K&C",            short: "K&C",   col: 3, row: 3, inner: true },
  { name: "Westminster",    short: "WSTM",  col: 4, row: 3, inner: true },
  { name: "City",           short: "CITY",  col: 5, row: 3, inner: true },
  { name: "Tower Hamlets",  short: "TWRH",  col: 6, row: 3, inner: true },
  { name: "Greenwich",      short: "GRNW",  col: 8, row: 3, inner: true },
  { name: "Wandsworth",     short: "WAND",  col: 3, row: 4, inner: true },
  { name: "Lambeth",        short: "LAMB",  col: 4, row: 4, inner: true },
  { name: "Southwark",      short: "SWRK",  col: 5, row: 4, inner: true },
  { name: "Lewisham",       short: "LEWI",  col: 6, row: 4, inner: true },
];

const LONDON_BOROUGHS = [
  "Barking & Dagenham", "Barnet", "Bexley", "Brent", "Bromley",
  "Camden", "City of London", "Croydon", "Ealing", "Enfield",
  "Greenwich", "Hackney", "Hammersmith & Fulham", "Haringey", "Harrow",
  "Havering", "Hillingdon", "Hounslow", "Islington", "Kensington & Chelsea",
  "Kingston upon Thames", "Lambeth", "Lewisham", "Merton", "Newham",
  "Redbridge", "Richmond upon Thames", "Southwark", "Sutton", "Tower Hamlets",
  "Waltham Forest", "Wandsworth", "Westminster",
];


type ChatMessage = {
  role: "ai" | "user" | "agent";
  content: string;
  canvas?: { type: string; data: Record<string, unknown> };
};

function DirectionA() {
  
  const [selected, setSelected] = useState<string[]>(["CP12", "EICR"]);
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [postcode, setPostcode] = useState("");
  
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatEverOpened, setChatEverOpened] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [pulseActive, setPulseActive] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "ai", content: "Hi, I can quote prices, check coverage, or show your certificates.\n\nWhat do you need?" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [handoffActive, setHandoffActive] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [activeCanvas, setActiveCanvas] = useState<{ type: string; data: Record<string, unknown> } | null>(null);

  function resetChat() {
    setMessages([{ role: "ai", content: "Hi, I can quote prices, check coverage, or show your certificates.\n\nWhat do you need?" }]);
    setChatInput("");
    setChatLoading(false);
    setHandoffActive(false);
    setConfirmReset(false);
    setActiveCanvas(null);
  }
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setPulseActive(false), 8000);
    return () => clearTimeout(t);
  }, []);

  function openChat() {
    setChatOpen(true);
    setChatEverOpened(true);
    setShowTooltip(false);
  }

  const toggle = (code: string) =>
    setSelected((s) => (s.includes(code) ? s.filter((c) => c !== code) : [...s, code]));

  const total = SERVICES.filter((s) => selected.includes(s.code)).reduce((a, b) => a + b.price, 0);

  useEffect(() => {
    if (chatOpen) chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatOpen]);

  async function sendMessage(override?: string) {
    const userMsg = (override ?? chatInput).trim();
    if (!userMsg || chatLoading) return;
    if (!override) setChatInput("");
    const history = messages.filter((m) => m.role === "user" || m.role === "ai");
    setMessages((m) => [...m, { role: "user", content: userMsg }]);
    setChatLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history }),
      });
      const data = await res.json() as { content: string; canvas: { type: string; data: Record<string, unknown> } | null; handoff: boolean };
      if (data.handoff) {
        setMessages((m) => [...m, { role: "ai", content: "Connecting you now..." }]);
        setTimeout(() => {
          setHandoffActive(true);
          setMessages((m) => [...m, { role: "agent", content: "Hi, this is Sarah from Landlord Certificates. How can I help you today?" }]);
          setChatLoading(false);
        }, 1500);
      } else {
        setMessages((m) => [...m, { role: "ai" as const, content: data.content, canvas: data.canvas ?? undefined }]);
        setChatLoading(false);
      }
    } catch {
      setMessages((m) => [...m, { role: "ai", content: "I'm having trouble connecting. Call us on 0203 772 5959." }]);
      setChatLoading(false);
    }
  }



  return (
    <div
      style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "var(--cream)", color: "var(--ink)" }}
      className="min-h-screen"
    >
      {/* 1. OFFER BAR */}
      <div className="text-white text-center text-sm py-3 px-4" style={{ background: "var(--navy-deep)" }}>
        <span className="inline-flex items-center gap-2.5 flex-wrap justify-center">
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "var(--emerald)" }} />
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "var(--emerald)" }} />
          </span>
          <Tag className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "var(--emerald)" }} />
          <strong>June deals:</strong> Gas Safety + Boiler Service £85 (save 60%) · EICR + PAT from £99 (save £46) · Ends 30 June
        </span>
      </div>

      {/* 2. NAV */}
      <header className="sticky top-0 z-40 border-b" style={{ background: "rgba(253,252,248,0.85)", backdropFilter: "blur(12px)", borderColor: "var(--line)" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <img src={lcLogo} alt="Landlord Certificates" className="h-9 w-auto" />
          </div>
          <nav className="hidden gap-7 text-sm md:flex" style={{ color: "var(--ink-soft)" }}>
            <a href="#services" className="hover:text-[var(--navy)]">Certificates</a>
            <a href="#commercial" className="hover:text-[var(--navy)]">Commercial</a>
            <a href="#offers" className="hover:text-[var(--navy)]">Offers</a>
            <a href="#coverage" className="hover:text-[var(--navy)]">Coverage</a>
            <Link to="/clients" className="hover:text-[var(--navy)]">For Agents</Link>
            <a href="#faq" className="hover:text-[var(--navy)]">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <a href="tel:02037725959" className="hidden text-sm font-medium md:inline-flex items-center gap-1.5" style={{ color: "var(--ink)" }}>
              <Phone className="h-3.5 w-3.5" /> 0203 772 5959
            </a>
            <a href="/portal" className="hidden md:inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium" style={{ borderColor: "var(--line)", color: "var(--ink)" }}>
              <LogIn className="h-3.5 w-3.5" /> Sign in
            </a>
            <a href="#quote" className="rounded-md px-4 py-2 text-sm font-semibold text-white" style={{ background: "var(--emerald-deep)" }}>Get quote</a>
          </div>
        </div>
      </header>

      {/* 3. HERO + QUOTE CARD */}
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
            Gas, electrical, energy and PAT certificates for London landlords and letting agents. Fixed prices. Real engineers. Certificate emailed within 24 hours.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm" style={{ color: "var(--ink-soft)" }}>
            <Stat n="12,000+" l="certificates issued" />
            <Stat n="4.7/5" l="on Trustpilot" />
            <Stat n="14 yrs" l="in business" />
          </div>
        </div>

        {/* QUOTE CARD */}
        <div id="quote" className="rounded-2xl border bg-white p-6" style={{ borderColor: "var(--line)", boxShadow: "var(--shadow-xl)" }}>
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
                {selected.length} cert{selected.length === 1 ? "" : "s"} selected
              </div>
              <div className="text-3xl font-bold tracking-tight" style={{ color: "var(--navy-deep)" }}>£{total}</div>
            </div>
            <a href="tel:02037725959" className="rounded-lg px-5 py-3 text-sm font-semibold text-white" style={{ background: "var(--navy)" }}>
              Book engineer →
            </a>
          </div>
        </div>
      </section>

      {/* 4. TRUST STRIP (accreditations) */}
      <section id="trust" className="border-y" style={{ borderColor: "var(--line)", background: "white" }}>
        <div className="mx-auto max-w-6xl px-6 py-7">
          <div className="flex items-center justify-between gap-6">
            {/* Accreditation logos — single line */}
            <div className="flex items-center gap-5 min-w-0">
              <span className="text-[9px] font-semibold uppercase tracking-[0.15em] flex-shrink-0 whitespace-nowrap" style={{ color: "oklch(0.65 0.01 256)" }}>Accredited by</span>
              <AccredBadge logo={gasSafeLogo} name="Gas Safe" sub="Reg. No. 552272" />
              <AccredBadge logo={napitLogo} name="NAPIT" sub="Certified" />
              <AccredBadge logo={stromaLogo} name="Stroma" sub="Certified" />
              <AccredBadge logo={trustmarkLogo} name="TrustMark" sub="Gov. Endorsed" />
            </div>

            {/* Trustpilot badge */}
            <div className="flex-shrink-0 flex items-center gap-3 rounded-lg border px-4 py-3" style={{ borderColor: "#e0e0e0" }}>
              {/* Left: logo+stars on same line, tagline below */}
              <div>
                <div className="flex items-center gap-2">
                  <img src={trustpilotLogo} alt="Trustpilot" className="h-[18px] w-auto object-contain" />
                  <div className="flex gap-[3px]">
                    {[1,2,3,4,5].map((i) => (
                      <span key={i} className="flex h-[20px] w-[20px] flex-shrink-0 items-center justify-center" style={{ background: "#00b67a" }}>
                        <svg viewBox="0 0 24 24" className="h-[12px] w-[12px]">
                          <polygon points="12,2 14.6,9.1 22,9.6 16.6,14.2 18.5,21.5 12,17.6 5.5,21.5 7.4,14.2 2,9.6 9.4,9.1" fill="white" />
                        </svg>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-1 text-[11px] whitespace-nowrap" style={{ color: "#737373" }}>
                  Rated <strong style={{ color: "#191919" }}>'Excellent'</strong> by our customers
                </div>
              </div>
              {/* Divider */}
              <div className="self-stretch w-px mx-1" style={{ background: "#e0e0e0" }} />
              {/* Right: score + review count */}
              <div className="leading-tight">
                <div className="text-[17px] font-extrabold whitespace-nowrap" style={{ color: "#191919" }}>4.7 out of 5</div>
                <div className="text-[11px] whitespace-nowrap" style={{ color: "#737373" }}>3,554 verified reviews</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. USP STRIP */}
      <section className="border-b" style={{ borderColor: "var(--line)", background: "var(--navy-faint)" }}>
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="grid gap-8 md:grid-cols-3">
            {USPS.map(({ icon: Icon, heading, body }) => (
              <div key={heading} className="flex items-start gap-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: "color-mix(in oklab, var(--navy) 10%, white)" }}>
                  <Icon className="h-5 w-5" style={{ color: "var(--navy)" }} />
                </div>
                <div>
                  <div className="text-[15px] font-semibold">{heading}</div>
                  <div className="mt-1 text-[14px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>{body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. RESIDENTIAL SERVICES */}
      <section id="services" className="mx-auto max-w-6xl px-6 py-24">
        <div className="flex items-end justify-between">
          <h2 className="text-[36px] font-bold tracking-tight max-w-xl">Every certificate a London landlord needs.</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {SERVICES.map((s) => {
            const Icon = s.icon;
            const expanded = expandedService === s.code;
            return (
              <div key={s.code} className="bg-white rounded-2xl border flex flex-col" style={{ borderColor: "var(--line)", boxShadow: "var(--shadow-sm)" }}>
                <div className="p-7 flex flex-col flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: "color-mix(in oklab, var(--emerald) 12%, white)" }}>
                      <Icon className="h-5 w-5" style={{ color: "var(--emerald-deep)" }} />
                    </div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--ink-soft)" }}>{s.code}</div>
                  </div>
                  <div className="mt-4 text-lg font-semibold">{s.name}</div>
                  <div className="mt-0.5 text-sm" style={{ color: "var(--ink-soft)" }}>{s.turn} turnaround · {s.valid}</div>
                  <p className="mt-3 text-[14px] leading-relaxed flex-1" style={{ color: "var(--ink-soft)" }}>{s.context}</p>

                  <button
                    onClick={() => setExpandedService(expanded ? null : s.code)}
                    className="mt-4 text-[13px] font-medium text-left flex items-center gap-1"
                    style={{ color: "var(--navy)" }}
                  >
                    What's covered / not covered
                    <ChevronDown className="h-3.5 w-3.5 transition-transform" style={{ transform: expanded ? "rotate(180deg)" : "none" }} />
                  </button>

                  {expanded && (
                    <div className="mt-3 grid grid-cols-2 gap-3 border-t pt-3" style={{ borderColor: "var(--line)" }}>
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--emerald-deep)" }}>Covered</div>
                        <ul className="space-y-1.5">
                          {s.covered.map((c) => (
                            <li key={c} className="flex items-start gap-1.5 text-[12px]" style={{ color: "var(--ink-soft)" }}>
                              <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" style={{ color: "var(--emerald-deep)" }} />
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--ink-soft)" }}>Not covered</div>
                        <ul className="space-y-1.5">
                          {s.notCovered.map((c) => (
                            <li key={c} className="flex items-start gap-1.5 text-[12px]" style={{ color: "var(--ink-soft)" }}>
                              <span className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-center leading-none" style={{ color: "var(--ink-soft)" }}>–</span>
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex items-end justify-between border-t pt-4" style={{ borderColor: "var(--line)" }}>
                    <div>
                      <div className="text-xs" style={{ color: "var(--ink-soft)" }}>{s.pricingNote}</div>
                    </div>
                    <a href="tel:02037725959" className="text-sm font-semibold" style={{ color: "var(--navy)" }}>Book →</a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. COMMERCIAL & HMO */}
      <section id="commercial" className="border-y" style={{ borderColor: "var(--line)", background: "white" }}>
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--navy)" }}>Commercial & HMO</div>
              <h2 className="mt-2 text-[32px] font-bold tracking-tight">Certificates for commercial properties and HMOs.</h2>
              <p className="mt-3 text-[15px] max-w-xl" style={{ color: "var(--ink-soft)" }}>
                Legal requirements for Houses in Multiple Occupation, commercial premises and larger managed properties.
              </p>
            </div>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {COMMERCIAL_SERVICES.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.name} className="rounded-2xl border p-7 flex flex-col" style={{ borderColor: "var(--line)", boxShadow: "var(--shadow-sm)" }}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: "color-mix(in oklab, var(--navy) 10%, white)" }}>
                    <Icon className="h-5 w-5" style={{ color: "var(--navy)" }} />
                  </div>
                  <div className="mt-4 text-[15px] font-semibold">{s.name}</div>
                  <p className="mt-2 text-[14px] leading-relaxed flex-1" style={{ color: "var(--ink-soft)" }}>{s.desc}</p>
                  <div className="mt-5 flex items-center justify-between border-t pt-4" style={{ borderColor: "var(--line)" }}>
                    <div className="text-xl font-bold" style={{ color: "var(--navy-deep)" }}>{s.price}</div>
                    <a href="tel:02037725959" className="text-sm font-semibold" style={{ color: "var(--navy)" }}>
                      Call for details →
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. DEALS — Bold Bundle Section */}
      <section id="offers" className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0f2047 0%, #1a3a6b 40%, #134e2d 100%)" }} />
        {/* Floating glow blobs */}
        <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #d4a017 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #4ade80 0%, transparent 70%)", filter: "blur(50px)" }} />

        <div className="relative mx-auto max-w-6xl px-6 py-20">
          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider" style={{ background: "rgba(212,160,23,0.15)", color: "#fbbf24", border: "1px solid rgba(212,160,23,0.3)" }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#fbbf24" }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#fbbf24" }} />
              </span>
              Limited time bundles
            </div>
            <h2 className="mt-5 text-[36px] md:text-[44px] font-bold text-white tracking-tight leading-tight">Bundle & Save</h2>
            <p className="mt-3 text-[15px] max-w-lg mx-auto" style={{ color: "rgba(255,255,255,0.6)" }}>
              Book two certificates together and save. No code needed. Prices are fixed and include VAT.
            </p>
          </div>

          {/* Deal cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {JUNE_DEALS.map((d, i) => (
                <div
                  key={d.name}
                  className="relative group rounded-2xl overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(8px)" }}
                >
                  {/* Ribbon */}
                  <div className="absolute top-0 right-0 z-10">
                    <div className="relative overflow-hidden rounded-bl-2xl px-5 py-2 text-xs font-bold uppercase tracking-wider text-white" style={{ background: "linear-gradient(135deg, #d4a017, #b8860b)" }}>
                      Save {i === 0 ? "~\u00a340" : "\u00a346"}
                    </div>
                  </div>

                  <div className="p-8 md:p-10">
                    {/* Label */}
                    <div className="text-[11px] font-semibold uppercase tracking-wider mb-4" style={{ color: "rgba(255,255,255,0.45)" }}>
                      {d.label}
                    </div>

                    {/* Bundle visual: two overlapping mini cards */}
                    <div className="relative h-32 mb-6">
                      {d.cards.map((c, ci) => (
                        <div
                          key={ci}
                          className="absolute top-0 flex items-center gap-3 rounded-xl px-5 py-4 shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
                          style={{
                            left: ci === 0 ? 0 : 60,
                            top: ci === 0 ? 0 : 28,
                            width: 220,
                            background: ci === 0 ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.92)",
                            boxShadow: ci === 0 ? "0 8px 30px rgba(0,0,0,0.25)" : "0 4px 20px rgba(0,0,0,0.15)",
                            zIndex: ci === 0 ? 2 : 1,
                            transform: `rotate(${ci === 0 ? -2 : 1}deg)`,
                          }}
                        >
                          <div className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "color-mix(in oklab, " + c.color + " 12%, white)" }}>
                            <CheckCircle2 className="h-5 w-5" style={{ color: c.color }} />
                          </div>
                          <div>
                            <div className="text-sm font-bold" style={{ color: "#0f172a" }}>{c.title}</div>
                            <div className="text-[11px]" style={{ color: "#64748b" }}>{c.sub}</div>
                          </div>
                        </div>
                      ))}
                      {/* "+" connector */}
                      <div className="absolute left-[108px] top-[56px] z-20 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: "#d4a017", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
                        +
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-baseline gap-3">
                        <span className="text-[52px] font-extrabold text-white tracking-tight leading-none">&pound;{d.price}</span>
                        <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded" style={{ background: "rgba(212,160,23,0.2)", color: "#fbbf24" }}>Bundle price</span>
                      </div>
                      {"sub" in d && d.sub && (
                        <div className="text-[13px]" style={{ color: "rgba(255,255,255,0.55)" }}>{d.sub}</div>
                      )}
                      <div className="text-[13px] font-medium" style={{ color: "#4ade80" }}>{d.saving}</div>
                    </div>

                    {/* CTA */}
                    <a
                      href="tel:02037725959"
                      className="mt-6 inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
                      style={{ background: "linear-gradient(135deg, #d4a017, #b8860b)", boxShadow: "0 4px 20px rgba(212,160,23,0.35)" }}
                    >
                      Book this bundle <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>

                  {/* Bottom progress bar / urgency strip */}
                  <div className="flex items-center gap-3 px-8 md:px-10 py-3" style={{ background: "rgba(0,0,0,0.2)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <CalendarClock className="h-4 w-4 flex-shrink-0" style={{ color: "rgba(255,255,255,0.4)" }} />
                    <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.5)" }}>Engineers available across all 32 London boroughs</span>
                  </div>
                </div>
            ))}
          </div>

          {/* Trust microcopy */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-[12px]" style={{ color: "rgba(255,255,255,0.4)" }}>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" /> Fixed prices, no hidden fees
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" /> Certificate issued same day
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" /> Gas Safe / NAPIT registered engineers
            </span>
          </div>
        </div>
      </section>

      {/* 9. COVERAGE — Atmospheric London halo */}
      <section id="coverage" className="border-y" style={{ borderColor: "rgba(255,255,255,0.08)", background: "var(--navy-deep)" }}>
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="relative overflow-hidden rounded-3xl px-8 py-24 md:px-16 md:py-32" style={{ background: "var(--navy-deep)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)" }}>
            {/* Atmospheric London halo backdrop */}
            <div className="pointer-events-none absolute inset-0 opacity-25">
              <svg
                className="absolute left-1/2 top-1/2 h-[140%] w-auto -translate-x-1/2 -translate-y-1/2"
                viewBox="0 0 1000 800"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                style={{ color: "var(--emerald)" }}
              >
                {/* London silhouette — dashed */}
                <path
                  d="M500,100 Q600,80 750,150 T900,300 T850,550 T600,700 T400,750 T150,600 T100,350 T250,150 Z"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="4 8"
                  opacity="0.5"
                />
                {/* Inner ring — solid */}
                <path
                  d="M500,150 Q580,130 700,200 T820,320 T780,500 T580,620 T420,670 T200,550 T160,380 T280,200 Z"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  opacity="0.4"
                />
                {/* Concentric rings */}
                <circle cx="500" cy="400" r="220" stroke="currentColor" strokeWidth="0.5" opacity="0.12" />
                <circle cx="500" cy="400" r="290" stroke="currentColor" strokeWidth="0.5" opacity="0.10" />
                <circle cx="500" cy="400" r="360" stroke="currentColor" strokeWidth="0.5" opacity="0.08" />
                {/* Thames — luminous emerald thread */}
                <path
                  d="M180,430 Q320,400 460,420 T740,430"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  opacity="0.6"
                  strokeLinecap="round"
                />
              </svg>
              {/* Radial vignette to fade edges into navy */}
              <div
                className="absolute inset-0"
                style={{
                  background: "radial-gradient(ellipse at center, transparent 0%, rgba(15,28,68,0.6) 60%, var(--navy-deep) 100%)",
                }}
              />
            </div>

            {/* Content */}
            <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
              <span className="mb-4 text-[11px] font-semibold tracking-[0.22em] uppercase" style={{ color: "var(--emerald)" }}>
                Greater London Coverage
              </span>

              <h2 className="text-[40px] md:text-[64px] font-bold tracking-tight leading-[1.02] text-white" style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>
                We cover every<br />
                <span style={{ color: "var(--emerald)" }}>London borough.</span>
              </h2>

              <p className="mt-6 max-w-xl text-[16px] md:text-[18px] leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                From the heart of the Square Mile to the furthest reaches of the M25 fringe, our accredited engineers are always nearby.
              </p>

              {/* KPI stats */}
              <div className="mt-16 grid w-full grid-cols-1 gap-8 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:gap-4 items-center">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[36px] font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>32</span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: "rgba(255,255,255,0.5)" }}>
                    London boroughs
                  </span>
                </div>
                <div className="hidden md:block h-12 w-px" style={{ background: "rgba(255,255,255,0.1)" }} />
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-6 w-6" style={{ color: "var(--emerald)" }} />
                    <span className="text-[36px] font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>M25</span>
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: "rgba(255,255,255,0.5)" }}>
                    Fringe covered
                  </span>
                </div>
                <div className="hidden md:block h-12 w-px" style={{ background: "rgba(255,255,255,0.1)" }} />
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[36px] font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>24hr</span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: "rgba(255,255,255,0.5)" }}>
                    Certificate email
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-16">
                <a
                  href="tel:02037725959"
                  className="group inline-flex items-center gap-6 rounded-full px-6 py-3 transition-all"
                  style={{ background: "rgba(255,255,255,0.05)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)" }}
                >
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-full"
                    style={{ background: "var(--emerald)", color: "var(--navy-deep)" }}
                  >
                    <Phone className="h-4 w-4" />
                  </span>
                  <div className="flex flex-col items-start pr-2">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "rgba(255,255,255,0.45)" }}>
                      Not sure? Call us
                    </span>
                    <span className="text-[18px] font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      0203 772 5959
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* Bottom decor accent */}
            <div
              className="absolute bottom-0 left-1/2 h-px w-1/3 -translate-x-1/2"
              style={{ background: "linear-gradient(to right, transparent, var(--emerald), transparent)", opacity: 0.3 }}
            />
          </div>
        </div>
      </section>


      {/* 10. HOW IT WORKS */}
      <section id="how" className="border-b" style={{ borderColor: "var(--line)", background: "var(--cream)" }}>
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="max-w-2xl text-[36px] font-bold leading-tight tracking-tight">
            The calmest way to stay compliant.
          </h2>
          <p className="mt-3 max-w-xl text-[15px]" style={{ color: "var(--ink-soft)" }}>
            Three steps. No phone tag, no paper trail, no surprise fees.
          </p>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              { n: "01", t: "Choose & quote", d: "Pick the certificates you need for a live price, or call us and we'll find the earliest slot at your property.", icon: ClipboardCheck },
              { n: "02", t: "Engineer visits", d: "A Gas Safe or NAPIT-registered engineer attends at your chosen time, covering every London borough.", icon: CalendarClock },
              { n: "03", t: "Certificate delivered", d: "Your signed PDF arrives by email within 24 hours, stored securely in your landlord portal and shareable in one click.", icon: Mail },
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

      {/* 11. CHECKLISTS — all visible at once */}
      <section className="border-b" style={{ borderColor: "var(--line)", background: "white" }}>
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--emerald-deep)" }}>Before we arrive</div>
            <h2 className="mt-2 text-[32px] font-bold tracking-tight leading-tight">A two-minute checklist for a smooth inspection.</h2>
            <p className="mt-4 text-[15px]" style={{ color: "var(--ink-soft)" }}>
              A little prep means our engineer is in and out faster, and your certificate lands in your inbox sooner.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {(Object.keys(CHECKLISTS) as Array<keyof typeof CHECKLISTS>).map((key) => {
              const labels: Record<string, string> = {
                CP12: "Gas Safety (CP12)",
                EICR: "Electrical (EICR)",
                EPC: "Energy (EPC)",
                PAT: "Portable Appliances (PAT)",
              };
              return (
                <div key={key} className="rounded-2xl border p-7" style={{ borderColor: "var(--line)", background: "var(--cream)" }}>
                  <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: "var(--line)" }}>
                    <div className="text-[15px] font-bold" style={{ color: "var(--navy-deep)" }}>{labels[key]}</div>
                    <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ background: "color-mix(in oklab, var(--emerald) 14%, white)", color: "var(--emerald-deep)" }}>
                      {CHECKLISTS[key].length} steps
                    </span>
                  </div>
                  <ul className="mt-4 space-y-3">
                    {CHECKLISTS[key].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircle2 className="h-4.5 w-4.5 mt-0.5 flex-shrink-0" style={{ color: "var(--emerald-deep)", width: 18, height: 18 }} />
                        <span className="text-[14px] leading-relaxed" style={{ color: "var(--ink)" }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* 12. TESTIMONIALS */}
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

      {/* 13. FAQ */}
      <section id="faq" className="border-t" style={{ borderColor: "var(--line)", background: "white" }}>
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--emerald-deep)" }}>FAQ</div>
            <h2 className="mt-2 text-[32px] font-bold tracking-tight leading-tight">Answers before you book.</h2>
            <p className="mt-4 text-[15px]" style={{ color: "var(--ink-soft)" }}>
              Still unsure? Call us on{" "}
              <a href="tel:02037725959" className="font-semibold" style={{ color: "var(--navy)" }}>0203 772 5959</a>{" "}
              for a real person, Mon–Fri 9am–5pm.
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

      {/* 14. FOOTER */}
      <footer style={{ background: "var(--navy-deep)", color: "white" }}>
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-10 md:grid-cols-4">
            <div>
              <img src={lcLogo} alt="Landlord Certificates" className="h-10 w-auto brightness-0 invert" />
              <p className="mt-4 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>London's certificate experts since 2012.</p>
              <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>Gas Safe Reg. No. 552272</p>
              <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>11 Hatch Lane, Chingford, London, E4 6LP</p>
              <a href="tel:02037725959" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>
                <Phone className="h-3.5 w-3.5" /> 0203 772 5959
              </a>
              <a href="/portal" className="mt-4 flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium w-fit" style={{ borderColor: "rgba(255,255,255,0.2)", color: "white" }}>
                <LogIn className="h-3.5 w-3.5" /> Landlord portal
              </a>
            </div>
            <FooterCol title="Certificates" items={["Gas Safety (CP12)", "EICR", "EPC", "PAT Testing", "Emergency Lighting", "Fire Alarm Testing", "Commercial EICR"]} />
            <FooterCol title="Coverage" items={["Wandsworth", "Hackney", "Camden", "Lambeth", "Chingford", "All 32 boroughs"]} />
            <FooterCol title="Company" items={["About", "Reviews", "Contact", "Terms", "Privacy"]} />
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-between border-t pt-6 text-xs" style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}>
            <div>© 2026 Landlord Certificates Ltd · Mon–Fri 9am–5pm</div>
            <Link to="/direction-c" className="underline">View Direction C →</Link>
          </div>
        </div>
      </footer>

      <FixedDealPill />

      {/* AI CHAT WIDGET — contemporary */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {chatOpen && (
          <div
            className="flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300"
            style={{
              width: 400,
              height: 640,
              maxHeight: "calc(100vh - 120px)",
              borderRadius: 28,
              boxShadow: "0 30px 80px -20px rgba(15,30,60,0.35), 0 10px 30px -10px rgba(15,30,60,0.2)",
              border: "1px solid rgba(15,30,60,0.06)",
              background: "white",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 flex-shrink-0 border-b" style={{ borderColor: "rgba(15,30,60,0.06)" }}>
              {activeCanvas ? (
                <button
                  onClick={() => setActiveCanvas(null)}
                  className="flex items-center gap-2 rounded-full px-3 py-1.5 hover:bg-black/5 transition-colors"
                  style={{ color: "var(--ink)" }}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="text-[14px] font-medium">Back to chat</span>
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="relative h-11 w-11 rounded-full flex items-center justify-center overflow-hidden" style={{ background: "linear-gradient(135deg, color-mix(in oklab, var(--emerald) 18%, white), color-mix(in oklab, var(--navy) 8%, white))" }}>
                    <img src={lcBot} alt="LC bot" className="h-12 w-12 object-contain -mb-1" />
                  </div>
                  <div>
                    <div className="text-[15px] font-semibold" style={{ color: "var(--ink)" }}>LC Assistant</div>
                    <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--ink-soft)" }}>
                      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "var(--emerald)" }} />
                      Online · replies instantly
                    </div>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-1">
                {messages.length > 1 && !confirmReset && !activeCanvas && (
                  <button
                    onClick={() => setConfirmReset(true)}
                    className="rounded-full px-2.5 py-1 text-[11px] font-medium hover:bg-black/5 transition-colors"
                    style={{ color: "var(--ink-soft)" }}
                  >
                    New chat
                  </button>
                )}
                <button onClick={() => { setChatOpen(false); setConfirmReset(false); setActiveCanvas(null); }} className="rounded-full p-1.5 hover:bg-black/5 transition-colors" style={{ color: "var(--ink-soft)" }}>
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* New chat confirmation strip */}
            {confirmReset && (
              <div className="flex items-center justify-between gap-3 px-4 py-3 flex-shrink-0" style={{ background: "color-mix(in oklab, var(--navy) 4%, white)", borderBottom: "1px solid rgba(15,30,60,0.08)" }}>
                <span className="text-[12px]" style={{ color: "var(--ink)" }}>Start a new chat? This conversation will be closed.</span>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => setConfirmReset(false)} className="rounded-full px-2.5 py-1 text-[11px] font-medium hover:bg-black/5 transition-colors" style={{ color: "var(--ink-soft)" }}>
                    Cancel
                  </button>
                  <button onClick={resetChat} className="rounded-full px-2.5 py-1 text-[11px] font-semibold text-white transition-colors" style={{ background: "var(--navy)" }}>
                    Start over
                  </button>
                </div>
              </div>
            )}

            {/* Fullscreen canvas view or messages */}
            {activeCanvas ? (
              <div className="flex-1 overflow-y-auto px-4 py-5" style={{ background: "white" }}>
                <ChatCanvas canvas={activeCanvas} onSend={(msg) => { setActiveCanvas(null); sendMessage(msg); }} />
              </div>
            ) : (
              <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4" style={{ background: "white" }}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex animate-in fade-in slide-in-from-bottom-1 duration-300 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "agent" && (
                    <div className="w-full">
                      <div className="text-[10px] font-semibold uppercase tracking-wider mb-2 px-1" style={{ color: "var(--emerald-deep)" }}>Sarah joined the chat</div>
                      <div className="flex gap-2.5 items-start">
                        <div className="h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0" style={{ background: "var(--emerald-deep)" }}>S</div>
                        <div className="text-[14px] leading-relaxed pt-1" style={{ color: "var(--ink)" }}>{msg.content}</div>
                      </div>
                    </div>
                  )}
                  {msg.role === "ai" && (
                    <div className="flex gap-2.5 items-start max-w-[88%]">
                      <img src={lcBot} alt="" className="h-8 w-8 object-contain flex-shrink-0 rounded-full" style={{ background: "color-mix(in oklab, var(--emerald) 10%, white)" }} />
                      <div className="min-w-0">
                        <div className="text-[14px] leading-relaxed whitespace-pre-line pt-1" style={{ color: "var(--ink)" }}>{msg.content}</div>
                        {msg.canvas && (
                          <button
                            onClick={() => setActiveCanvas(msg.canvas!)}
                            className="mt-2 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition-all hover:scale-[1.02]"
                            style={{ background: "color-mix(in oklab, var(--emerald) 8%, white)", border: "1px solid color-mix(in oklab, var(--emerald) 20%, white)", color: "var(--emerald-deep)" }}
                          >
                            <ChevronRight className="h-3.5 w-3.5" /> View details
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                  {msg.role === "user" && (
                    <div
                      className="px-4 py-2.5 text-[14px] leading-relaxed max-w-[80%] text-white"
                      style={{ background: "var(--emerald-deep)", borderRadius: "20px 20px 4px 20px" }}
                    >
                      {msg.content}
                    </div>
                  )}
                </div>
              ))}
              {!handoffActive && messages.length === 1 && !chatLoading && (
                <div className="flex flex-wrap gap-2 pl-10 pt-1">
                  {[
                    { label: "See my certificate", message: "Can I see my gas safety certificate?" },
                    { label: "Get a quote", message: "How much for a 2-bed Gas Safety with 3 appliances?" },
                    { label: "Check coverage", message: "Do you cover SW18?" },
                    { label: "Book a slot", message: "Can I book now?" },
                    { label: "When is mine due?", message: "When is my gas safety certificate due?" },
                    { label: "What's a C2 code?", message: "My EICR says C2 — what does that mean?" },
                  ].map(({ label, message }) => (
                    <button
                      key={label}
                      onClick={() => sendMessage(message)}
                      className="rounded-full px-3 py-1.5 text-[12px] font-medium transition-all hover:scale-[1.02]"
                      style={{ background: "color-mix(in oklab, var(--emerald) 8%, white)", border: "1px solid color-mix(in oklab, var(--emerald) 20%, white)", color: "var(--emerald-deep)" }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
              {chatLoading && (
                <div className="flex gap-2.5 items-start">
                  <img src={lcBot} alt="" className="h-8 w-8 object-contain flex-shrink-0 rounded-full" style={{ background: "color-mix(in oklab, var(--emerald) 10%, white)" }} />
                  <div className="flex gap-1 pt-3">
                    <span className="h-1.5 w-1.5 rounded-full animate-bounce" style={{ background: "var(--ink-soft)" }} />
                    <span className="h-1.5 w-1.5 rounded-full animate-bounce" style={{ background: "var(--ink-soft)", animationDelay: "0.15s" }} />
                    <span className="h-1.5 w-1.5 rounded-full animate-bounce" style={{ background: "var(--ink-soft)", animationDelay: "0.3s" }} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Composer */}
            <div className="p-3 flex-shrink-0">
              <div className="flex items-center gap-2 rounded-2xl px-2 py-1.5" style={{ background: "color-mix(in oklab, var(--navy) 4%, white)", border: "1px solid rgba(15,30,60,0.08)" }}>
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder={handoffActive ? "Chat with Sarah..." : "Message LC Assistant..."}
                  className="flex-1 bg-transparent px-2 py-2 text-[14px] outline-none placeholder:opacity-50"
                  style={{ color: "var(--ink)" }}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={chatLoading || !chatInput.trim()}
                  className="h-9 w-9 rounded-full flex items-center justify-center text-white disabled:opacity-30 transition-all hover:scale-105 disabled:scale-100"
                  style={{ background: "var(--emerald-deep)" }}
                  aria-label="Send"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <div className="text-center text-[10px] mt-2" style={{ color: "var(--ink-soft)", opacity: 0.6 }}>
                Powered by on-ai-rails
              </div>
            </div>
              </>
            )}
          </div>
        )}

        {/* Launcher */}
        {!chatOpen && (
          <div className="flex items-center gap-3">
            {!chatEverOpened && showTooltip && (
              <div
                className="rounded-2xl px-3.5 py-2 text-[13px] font-medium pointer-events-none animate-in fade-in slide-in-from-right-2"
                style={{ background: "white", color: "var(--ink)", boxShadow: "0 10px 30px -10px rgba(15,30,60,0.2)", border: "1px solid rgba(15,30,60,0.06)", whiteSpace: "nowrap" }}
              >
                👋 Hi, ask me anything
              </div>
            )}
            <div className="relative">
              {pulseActive && (
                <span className="absolute inset-0 rounded-full animate-ping opacity-40" style={{ background: "var(--emerald)" }} />
              )}
              <button
                onClick={openChat}
                onMouseEnter={() => !chatEverOpened && setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="relative flex h-16 w-16 items-center justify-center rounded-full overflow-hidden transition-transform hover:scale-105"
                style={{
                  background: "white",
                  boxShadow: "0 12px 32px -8px rgba(15,30,60,0.35), 0 4px 12px -4px rgba(15,30,60,0.2)",
                  border: "2px solid color-mix(in oklab, var(--emerald) 25%, white)",
                }}
                aria-label="Open LC Assistant"
              >
                <img src={lcBot} alt="LC bot" className="h-[72px] w-[72px] object-contain object-top -mb-2" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FixedDealPill() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => { if (window.scrollY > 280) setVisible(true); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible || dismissed) return null;

  return (
    <div
      className="fixed z-50 flex items-center gap-3 rounded-full px-4 py-3 shadow-[0_8px_32px_-8px_rgba(15,30,60,0.45)]"
      style={{ bottom: "24px", left: "24px", background: "var(--navy-deep)", color: "white", maxWidth: "calc(100vw - 48px)" }}
    >
      <span className="relative flex h-2 w-2 flex-shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "var(--emerald)" }} />
        <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "var(--emerald)" }} />
      </span>
      <span className="text-[13px] font-medium whitespace-nowrap">
        <span style={{ color: "var(--emerald)" }}>June deal:</span> Gas + Boiler £85 · Ends 30 Jun
      </span>
      <a
        href="#offers"
        onClick={() => setDismissed(true)}
        className="rounded-full px-3 py-1 text-[12px] font-bold flex-shrink-0"
        style={{ background: "var(--emerald)", color: "rgba(0,0,0,0.8)" }}
      >
        See deal
      </a>
      <button
        onClick={() => setDismissed(true)}
        className="flex-shrink-0 text-[18px] leading-none opacity-50 hover:opacity-100 ml-1"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}

const POSTCODE_ZONES: Record<string, { borough: string; zone: "same-day" | "next-day" }> = {
  E1:{borough:"Tower Hamlets",zone:"same-day"},E2:{borough:"Tower Hamlets",zone:"same-day"},E3:{borough:"Tower Hamlets",zone:"same-day"},E14:{borough:"Tower Hamlets",zone:"same-day"},
  E5:{borough:"Hackney",zone:"same-day"},E8:{borough:"Hackney",zone:"same-day"},E9:{borough:"Hackney",zone:"same-day"},N16:{borough:"Hackney",zone:"same-day"},
  EC1:{borough:"Islington",zone:"same-day"},EC2:{borough:"City of London",zone:"same-day"},EC3:{borough:"City of London",zone:"same-day"},EC4:{borough:"City of London",zone:"same-day"},
  N1:{borough:"Islington",zone:"same-day"},N4:{borough:"Islington",zone:"same-day"},N5:{borough:"Islington",zone:"same-day"},N7:{borough:"Islington",zone:"same-day"},N19:{borough:"Islington",zone:"same-day"},
  NW1:{borough:"Camden",zone:"same-day"},NW3:{borough:"Camden",zone:"same-day"},NW5:{borough:"Camden",zone:"same-day"},WC1:{borough:"Camden",zone:"same-day"},
  NW6:{borough:"Brent",zone:"same-day"},NW8:{borough:"Westminster",zone:"same-day"},W1:{borough:"Westminster",zone:"same-day"},W2:{borough:"Westminster",zone:"same-day"},WC2:{borough:"Westminster",zone:"same-day"},
  W6:{borough:"Hammersmith & Fulham",zone:"same-day"},W12:{borough:"Hammersmith & Fulham",zone:"same-day"},W14:{borough:"Hammersmith & Fulham",zone:"same-day"},
  W8:{borough:"Kensington & Chelsea",zone:"same-day"},W10:{borough:"Kensington & Chelsea",zone:"same-day"},W11:{borough:"Kensington & Chelsea",zone:"same-day"},
  SW1:{borough:"Westminster",zone:"same-day"},SW3:{borough:"Kensington & Chelsea",zone:"same-day"},SW5:{borough:"Kensington & Chelsea",zone:"same-day"},SW7:{borough:"Kensington & Chelsea",zone:"same-day"},SW10:{borough:"Kensington & Chelsea",zone:"same-day"},
  SW6:{borough:"Hammersmith & Fulham",zone:"same-day"},SW8:{borough:"Lambeth",zone:"same-day"},SW9:{borough:"Lambeth",zone:"same-day"},SW11:{borough:"Wandsworth",zone:"same-day"},
  SW12:{borough:"Wandsworth",zone:"same-day"},SW15:{borough:"Wandsworth",zone:"same-day"},SW17:{borough:"Wandsworth",zone:"same-day"},SW18:{borough:"Wandsworth",zone:"same-day"},
  SE1:{borough:"Southwark",zone:"same-day"},SE5:{borough:"Southwark",zone:"same-day"},SE8:{borough:"Lewisham",zone:"same-day"},SE10:{borough:"Greenwich",zone:"same-day"},
  SE11:{borough:"Lambeth",zone:"same-day"},SE15:{borough:"Southwark",zone:"same-day"},SE16:{borough:"Southwark",zone:"same-day"},SE17:{borough:"Southwark",zone:"same-day"},SE24:{borough:"Lambeth",zone:"same-day"},
  E4:{borough:"Waltham Forest",zone:"next-day"},E6:{borough:"Newham",zone:"next-day"},E7:{borough:"Newham",zone:"next-day"},E10:{borough:"Waltham Forest",zone:"next-day"},E11:{borough:"Waltham Forest",zone:"next-day"},
  E12:{borough:"Newham",zone:"next-day"},E13:{borough:"Newham",zone:"next-day"},E15:{borough:"Newham",zone:"next-day"},E16:{borough:"Newham",zone:"next-day"},E17:{borough:"Waltham Forest",zone:"next-day"},E18:{borough:"Redbridge",zone:"next-day"},
  N2:{borough:"Barnet",zone:"next-day"},N3:{borough:"Barnet",zone:"next-day"},N6:{borough:"Haringey",zone:"next-day"},N8:{borough:"Haringey",zone:"next-day"},N9:{borough:"Enfield",zone:"next-day"},
  N10:{borough:"Haringey",zone:"next-day"},N11:{borough:"Enfield",zone:"next-day"},N12:{borough:"Barnet",zone:"next-day"},N13:{borough:"Enfield",zone:"next-day"},N14:{borough:"Enfield",zone:"next-day"},
  N15:{borough:"Haringey",zone:"next-day"},N17:{borough:"Haringey",zone:"next-day"},N18:{borough:"Enfield",zone:"next-day"},N20:{borough:"Barnet",zone:"next-day"},N21:{borough:"Enfield",zone:"next-day"},N22:{borough:"Haringey",zone:"next-day"},
  NW2:{borough:"Brent",zone:"next-day"},NW4:{borough:"Barnet",zone:"next-day"},NW7:{borough:"Barnet",zone:"next-day"},NW9:{borough:"Brent",zone:"next-day"},NW10:{borough:"Brent",zone:"next-day"},NW11:{borough:"Barnet",zone:"next-day"},
  W3:{borough:"Ealing",zone:"next-day"},W4:{borough:"Hounslow",zone:"next-day"},W5:{borough:"Ealing",zone:"next-day"},W7:{borough:"Ealing",zone:"next-day"},W13:{borough:"Ealing",zone:"next-day"},
  SW2:{borough:"Lambeth",zone:"next-day"},SW13:{borough:"Richmond upon Thames",zone:"next-day"},SW14:{borough:"Richmond upon Thames",zone:"next-day"},SW16:{borough:"Merton",zone:"next-day"},SW19:{borough:"Merton",zone:"next-day"},SW20:{borough:"Merton",zone:"next-day"},
  SE2:{borough:"Bexley",zone:"next-day"},SE3:{borough:"Lewisham",zone:"next-day"},SE4:{borough:"Lewisham",zone:"next-day"},SE6:{borough:"Lewisham",zone:"next-day"},SE7:{borough:"Greenwich",zone:"next-day"},
  SE9:{borough:"Greenwich",zone:"next-day"},SE12:{borough:"Lewisham",zone:"next-day"},SE13:{borough:"Lewisham",zone:"next-day"},SE14:{borough:"Lewisham",zone:"next-day"},SE18:{borough:"Greenwich",zone:"next-day"},
  SE19:{borough:"Bromley",zone:"next-day"},SE20:{borough:"Bromley",zone:"next-day"},SE23:{borough:"Lewisham",zone:"next-day"},SE25:{borough:"Croydon",zone:"next-day"},SE26:{borough:"Bromley",zone:"next-day"},SE27:{borough:"Lambeth",zone:"next-day"},
  HA1:{borough:"Harrow",zone:"next-day"},HA2:{borough:"Harrow",zone:"next-day"},HA3:{borough:"Harrow",zone:"next-day"},HA4:{borough:"Hillingdon",zone:"next-day"},HA5:{borough:"Harrow",zone:"next-day"},
  UB1:{borough:"Ealing",zone:"next-day"},UB2:{borough:"Ealing",zone:"next-day"},UB3:{borough:"Hillingdon",zone:"next-day"},UB4:{borough:"Hillingdon",zone:"next-day"},UB5:{borough:"Ealing",zone:"next-day"},
  TW1:{borough:"Richmond upon Thames",zone:"next-day"},TW2:{borough:"Hounslow",zone:"next-day"},TW3:{borough:"Hounslow",zone:"next-day"},TW4:{borough:"Hounslow",zone:"next-day"},TW7:{borough:"Hounslow",zone:"next-day"},TW8:{borough:"Hounslow",zone:"next-day"},TW9:{borough:"Richmond upon Thames",zone:"next-day"},TW10:{borough:"Richmond upon Thames",zone:"next-day"},TW11:{borough:"Richmond upon Thames",zone:"next-day"},TW12:{borough:"Richmond upon Thames",zone:"next-day"},
  KT1:{borough:"Kingston upon Thames",zone:"next-day"},KT2:{borough:"Kingston upon Thames",zone:"next-day"},KT3:{borough:"Merton",zone:"next-day"},KT4:{borough:"Sutton",zone:"next-day"},
  SM1:{borough:"Sutton",zone:"next-day"},SM2:{borough:"Sutton",zone:"next-day"},SM3:{borough:"Sutton",zone:"next-day"},SM4:{borough:"Merton",zone:"next-day"},SM5:{borough:"Sutton",zone:"next-day"},SM6:{borough:"Sutton",zone:"next-day"},
  CR0:{borough:"Croydon",zone:"next-day"},CR2:{borough:"Croydon",zone:"next-day"},CR4:{borough:"Merton",zone:"next-day"},CR5:{borough:"Croydon",zone:"next-day"},CR7:{borough:"Croydon",zone:"next-day"},CR8:{borough:"Croydon",zone:"next-day"},
  BR1:{borough:"Bromley",zone:"next-day"},BR2:{borough:"Bromley",zone:"next-day"},BR3:{borough:"Bromley",zone:"next-day"},BR4:{borough:"Bromley",zone:"next-day"},BR5:{borough:"Bromley",zone:"next-day"},BR6:{borough:"Bromley",zone:"next-day"},
  DA1:{borough:"Bexley",zone:"next-day"},DA5:{borough:"Bexley",zone:"next-day"},DA6:{borough:"Bexley",zone:"next-day"},DA7:{borough:"Bexley",zone:"next-day"},DA8:{borough:"Bexley",zone:"next-day"},DA15:{borough:"Bexley",zone:"next-day"},DA16:{borough:"Bexley",zone:"next-day"},DA17:{borough:"Bexley",zone:"next-day"},DA18:{borough:"Bexley",zone:"next-day"},
  RM1:{borough:"Havering",zone:"next-day"},RM2:{borough:"Havering",zone:"next-day"},RM3:{borough:"Havering",zone:"next-day"},RM7:{borough:"Havering",zone:"next-day"},RM8:{borough:"Barking & Dagenham",zone:"next-day"},RM9:{borough:"Barking & Dagenham",zone:"next-day"},RM10:{borough:"Barking & Dagenham",zone:"next-day"},RM12:{borough:"Havering",zone:"next-day"},RM13:{borough:"Havering",zone:"next-day"},
  IG1:{borough:"Redbridge",zone:"next-day"},IG2:{borough:"Redbridge",zone:"next-day"},IG3:{borough:"Redbridge",zone:"next-day"},IG4:{borough:"Redbridge",zone:"next-day"},IG5:{borough:"Redbridge",zone:"next-day"},IG6:{borough:"Redbridge",zone:"next-day"},IG11:{borough:"Barking & Dagenham",zone:"next-day"},
};

function lookupPostcode(raw: string): { borough: string; zone: "same-day" | "next-day"; covered: boolean } | null {
  const upper = raw.trim().toUpperCase().replace(/\s+/g, "");
  for (const len of [4, 3, 2]) {
    const prefix = upper.slice(0, len);
    if (POSTCODE_ZONES[prefix]) return { ...POSTCODE_ZONES[prefix], covered: true };
  }
  if (/^(E|N|NW|W|WC|SW|SE|EC|HA|UB|TW|KT|SM|CR|BR|DA|RM|IG)\d/.test(upper)) {
    return { borough: "Greater London", zone: "next-day", covered: true };
  }
  return null;
}

function CoverageCanvas({ data, onSend }: { data: Record<string, unknown>; onSend: (msg?: string) => void }) {
  const initial = data.postcode as string | undefined;
  const [input, setInput] = useState(initial || "");
  const [result, setResult] = useState<{ borough: string; zone: "same-day" | "next-day"; covered: boolean } | null>(() => {
    if (data.borough) return { borough: data.borough as string, zone: (data.zone as "same-day" | "next-day") || "next-day", covered: data.covered as boolean };
    if (initial) return lookupPostcode(initial);
    return null;
  });

  function check() {
    const found = lookupPostcode(input);
    setResult(found ?? { borough: "", zone: "next-day", covered: false });
  }

  return (
    <div className="mt-3 rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(15,30,60,0.08)" }}>
      {result && (
        <div className="px-4 py-3 flex items-start gap-3" style={{ background: result.covered ? "color-mix(in oklab, var(--emerald) 5%, white)" : "rgba(220,38,38,0.04)", borderBottom: "1px solid rgba(15,30,60,0.06)" }}>
          <div className="h-9 w-9 rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ background: result.covered ? "var(--emerald-deep)" : "#dc2626" }}>
            {result.covered ? <CheckCircle2 className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <div className="text-[13px] font-semibold" style={{ color: "var(--ink)" }}>
                {result.covered ? `We cover ${result.borough}` : "Outside our zone"}
              </div>
              {result.covered && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: result.zone === "same-day" ? "color-mix(in oklab, var(--emerald) 15%, white)" : "color-mix(in oklab, var(--navy) 8%, white)", color: result.zone === "same-day" ? "var(--emerald-deep)" : "var(--navy)" }}>
                  {result.zone === "same-day" ? "Same-day" : "Next-day"}
                </span>
              )}
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: "var(--ink-soft)" }}>
              {result.covered ? (result.zone === "same-day" ? "Inner London · engineers based nearby" : "Outer London · next-day slots available") : "Call 0203 772 5959 to confirm"}
            </div>
          </div>
        </div>
      )}
      {result?.covered && (
        <button onClick={() => onSend("I'd like to book")} className="w-full py-2.5 text-[13px] font-semibold text-white" style={{ background: "var(--emerald-deep)", borderBottom: "1px solid rgba(15,30,60,0.06)" }}>
          Book now →
        </button>
      )}
      <div className="px-4 py-3 bg-white">
        {!result && <div className="text-[12px] mb-2 font-medium" style={{ color: "var(--ink)" }}>Check your postcode</div>}
        {result && <div className="text-[11px] mb-2" style={{ color: "var(--ink-soft)" }}>Check another postcode</div>}
        <div className="flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value.toUpperCase())} onKeyDown={(e) => e.key === "Enter" && check()} placeholder="e.g. SW11 2AB"
            className="flex-1 rounded-xl border px-3 py-2 text-[13px] outline-none focus:border-[var(--navy)] tracking-wide" style={{ borderColor: "rgba(15,30,60,0.12)" }} />
          <button onClick={check} disabled={!input.trim()} className="rounded-xl px-3 py-2 text-[13px] font-semibold text-white disabled:opacity-30" style={{ background: "var(--navy)" }}>Check</button>
        </div>
      </div>
    </div>
  );
}

type CanvasProps = { canvas: { type: string; data: Record<string, unknown> }; onSend: (msg?: string) => void };

function ChatCanvas({ canvas, onSend }: CanvasProps) {
  if (canvas.type === "price-calculator") {
    const services = (canvas.data.services as Array<{ name: string; price: string }>) || [];
    const total = services.reduce((a, s) => a + (parseInt(String(s.price).replace(/[^0-9]/g, ""), 10) || 0), 0);
    return (
      <div className="mt-3 rounded-2xl overflow-hidden" style={{ border: "1px solid color-mix(in oklab, var(--emerald) 18%, white)" }}>
        <div className="px-4 py-3" style={{ background: "color-mix(in oklab, var(--emerald) 6%, white)" }}>
          <div className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--emerald-deep)" }}>Live quote</div>
          {services.map((s) => (
            <div key={s.name} className="flex justify-between text-[13px] py-1.5 border-b last:border-0" style={{ borderColor: "rgba(15,30,60,0.06)" }}>
              <span style={{ color: "var(--ink)" }}>{s.name}</span>
              <span className="font-semibold" style={{ color: "var(--ink)" }}>{s.price}</span>
            </div>
          ))}
          <div className="flex justify-between text-[14px] pt-2 mt-1 font-bold">
            <span>Total</span><span style={{ color: "var(--emerald-deep)" }}>£{total}</span>
          </div>
        </div>
        <button onClick={() => onSend("I'd like to book this")} className="w-full py-2.5 text-[13px] font-semibold text-white" style={{ background: "var(--emerald-deep)" }}>
          Book at this price →
        </button>
      </div>
    );
  }

  if (canvas.type === "appliance-counter") {
    return <ApplianceCounter basePrice={(canvas.data.basePrice as number) ?? 40} perItem={(canvas.data.perItem as number) ?? 10} onConfirm={(p, total) => onSend(`Book Gas Safety, ${p} appliances, total £${total}`)} />;
  }

  if (canvas.type === "booking-slots") {
    return <BookingSlots service={(canvas.data.service as string) ?? "Inspection"} onConfirm={(slot) => onSend(`Booked: ${slot}`)} />;
  }

  if (canvas.type === "coverage-result") {
    return <CoverageCanvas data={canvas.data} onSend={onSend} />;
  }

  if (canvas.type === "certificate-preview") {
    const c = canvas.data as { type: string; address: string; engineer: string; gasSafeNo: string; issued: string; expires: string; status: string };
    const pass = c.status?.toLowerCase().includes("pass");
    return (
      <div className="mt-3 rounded-2xl overflow-hidden bg-white" style={{ border: "1px solid rgba(15,30,60,0.1)", boxShadow: "0 8px 24px -12px rgba(15,30,60,0.15)" }}>
        <div className="px-4 py-3 flex items-center justify-between" style={{ background: "var(--navy-deep)", color: "white" }}>
          <div>
            <div className="text-[10px] uppercase tracking-[0.15em] opacity-60">Certificate</div>
            <div className="text-[13px] font-semibold">{c.type}</div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: pass ? "var(--emerald)" : "#ef4444", color: pass ? "#052e16" : "white" }}>{c.status}</span>
        </div>
        <div className="p-4 space-y-2 text-[12px]">
          <Row label="Property" value={c.address} />
          <Row label="Engineer" value={c.engineer} />
          <Row label="Gas Safe №" value={c.gasSafeNo} />
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Row label="Issued" value={c.issued} />
            <Row label="Expires" value={c.expires} />
          </div>
        </div>
        <button className="w-full py-2.5 text-[13px] font-semibold border-t" style={{ borderColor: "rgba(15,30,60,0.08)", color: "var(--emerald-deep)" }}>
          ↓ Download PDF
        </button>
      </div>
    );
  }

  if (canvas.type === "renewal-timeline") {
    const { cert, lastDone, dueDate, validity } = canvas.data as { cert: string; lastDone: string; dueDate: string; validity: string };
    const issued = new Date(lastDone);
    const due = new Date(dueDate);
    const today = new Date();
    const totalMs = due.getTime() - issued.getTime();
    const elapsedMs = today.getTime() - issued.getTime();
    const progressPct = Math.min(100, Math.max(0, (elapsedMs / totalMs) * 100));
    const daysLeft = Math.round((due.getTime() - today.getTime()) / 86400000);
    const overdue = daysLeft < 0;
    const urgent = !overdue && daysLeft <= 30;
    const accentColor = overdue ? "#dc2626" : urgent ? "#ea580c" : "var(--emerald-deep)";
    const badgeText = overdue ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days left`;
    return (
      <div className="mt-3 rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(15,30,60,0.08)" }}>
        <div className="px-4 pt-3 pb-3 bg-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-semibold" style={{ color: "var(--ink)" }}>{cert} · valid {validity}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: accentColor }}>{badgeText}</span>
          </div>
          <div className="relative h-1.5 rounded-full" style={{ background: "rgba(15,30,60,0.08)" }}>
            <div className="absolute left-0 top-0 h-1.5 rounded-full" style={{ width: `${progressPct}%`, background: accentColor }} />
            {progressPct > 0 && progressPct < 100 && (
              <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow" style={{ left: `calc(${progressPct}% - 6px)`, background: accentColor }} />
            )}
          </div>
          <div className="flex justify-between text-[10px] mt-1.5" style={{ color: "var(--ink-soft)" }}>
            <span>Issued {lastDone}</span><span>Due {dueDate}</span>
          </div>
        </div>
        <button onClick={() => onSend(`Book ${cert} renewal`)} className="w-full py-2.5 text-[13px] font-semibold text-white" style={{ background: accentColor }}>
          Book renewal →
        </button>
      </div>
    );
  }

  if (canvas.type === "eicr-codes") {
    const code = ((canvas.data.code as string) ?? "C2").toUpperCase();
    const map: Record<string, { color: string; label: string; desc: string }> = {
      C1: { color: "#dc2626", label: "Danger present", desc: "Immediate risk to people. Engineer must make safe right away." },
      C2: { color: "#ea580c", label: "Potentially dangerous", desc: "Urgent remedial work required. Certificate marked unsatisfactory." },
      C3: { color: "#16a34a", label: "Improvement recommended", desc: "Not a fail. Improvement suggested but installation is still safe." },
      FI: { color: "#0ea5e9", label: "Further investigation", desc: "Engineer needs to investigate further to determine if remedial work is required." },
    };
    const c = map[code] ?? map.C2;
    return (
      <div className="mt-3 rounded-2xl overflow-hidden bg-white" style={{ border: "1px solid rgba(15,30,60,0.08)" }}>
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold text-[16px]" style={{ background: c.color }}>{code}</div>
            <div>
              <div className="text-[13px] font-semibold" style={{ color: "var(--ink)" }}>{c.label}</div>
              <div className="text-[11px]" style={{ color: "var(--ink-soft)" }}>EICR observation code</div>
            </div>
          </div>
          <p className="text-[12px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>{c.desc}</p>
          <div className="flex gap-1 mt-3">
            {["C1", "C2", "C3", "FI"].map((k) => (
              <div key={k} className="flex-1 h-1.5 rounded-full" style={{ background: k === code ? map[k].color : "rgba(15,30,60,0.08)" }} />
            ))}
          </div>
        </div>
        {code !== "C3" && (
          <button onClick={() => onSend("Get a remedial quote")} className="w-full py-2.5 text-[13px] font-semibold text-white border-t" style={{ background: c.color, borderColor: "rgba(15,30,60,0.08)" }}>
            Get remedial quote →
          </button>
        )}
      </div>
    );
  }

  if (canvas.type === "portfolio-table") {
    const props = (canvas.data.properties as Array<{ address: string; cert: string; status: string; expires: string }>) ?? [];
    const due = props.filter((p) => p.status === "due" || p.status === "expired").length;
    return (
      <div className="mt-3 rounded-2xl overflow-hidden bg-white" style={{ border: "1px solid rgba(15,30,60,0.08)" }}>
        <div className="px-4 py-2.5 flex items-center justify-between border-b" style={{ borderColor: "rgba(15,30,60,0.06)" }}>
          <span className="text-[12px] font-semibold" style={{ color: "var(--ink)" }}>{props.length} properties</span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(234,88,12,0.1)", color: "#ea580c" }}>{due} need action</span>
        </div>
        <div className="divide-y" style={{ borderColor: "rgba(15,30,60,0.06)" }}>
          {props.map((p, i) => {
            const tone = p.status === "valid" ? { bg: "color-mix(in oklab, var(--emerald) 12%, white)", fg: "var(--emerald-deep)", label: "Valid" } : p.status === "due" ? { bg: "rgba(234,88,12,0.12)", fg: "#ea580c", label: "Due soon" } : { bg: "rgba(220,38,38,0.12)", fg: "#dc2626", label: "Expired" };
            return (
              <div key={i} className="px-4 py-2.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[12px] font-medium truncate" style={{ color: "var(--ink)" }}>{p.address}</div>
                  <div className="text-[10px]" style={{ color: "var(--ink-soft)" }}>{p.cert} · {p.expires}</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: tone.bg, color: tone.fg }}>{tone.label}</span>
              </div>
            );
          })}
        </div>
        {due > 0 && (
          <button onClick={() => onSend(`Book all ${due} due certificates`)} className="w-full py-2.5 text-[13px] font-semibold text-white border-t" style={{ background: "var(--emerald-deep)", borderColor: "rgba(15,30,60,0.06)" }}>
            Book all {due} due →
          </button>
        )}
      </div>
    );
  }

  return null;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--ink-soft)" }}>{label}</div>
      <div className="text-[12px] font-medium" style={{ color: "var(--ink)" }}>{value}</div>
    </div>
  );
}

function ApplianceCounter({ basePrice, perItem, onConfirm }: { basePrice: number; perItem: number; onConfirm: (count: number, total: number) => void }) {
  const [counts, setCounts] = useState<Record<string, number>>({ Boiler: 1, Hob: 0, Oven: 0, "Gas fire": 0 });
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const price = basePrice + Math.max(0, total - 1) * perItem;
  return (
    <div className="mt-3 rounded-2xl overflow-hidden bg-white" style={{ border: "1px solid rgba(15,30,60,0.08)" }}>
      <div className="p-4 space-y-2">
        <div className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-1" style={{ color: "var(--emerald-deep)" }}>Appliance counter</div>
        {Object.keys(counts).map((k) => (
          <div key={k} className="flex items-center justify-between">
            <span className="text-[13px]" style={{ color: "var(--ink)" }}>{k}</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setCounts((c) => ({ ...c, [k]: Math.max(0, c[k] - 1) }))} className="h-6 w-6 rounded-full text-[14px] font-bold" style={{ background: "rgba(15,30,60,0.06)", color: "var(--ink)" }}>−</button>
              <span className="text-[13px] font-semibold w-4 text-center">{counts[k]}</span>
              <button onClick={() => setCounts((c) => ({ ...c, [k]: c[k] + 1 }))} className="h-6 w-6 rounded-full text-[14px] font-bold text-white" style={{ background: "var(--emerald-deep)" }}>+</button>
            </div>
          </div>
        ))}
        <div className="flex justify-between items-baseline pt-2 mt-1 border-t" style={{ borderColor: "rgba(15,30,60,0.08)" }}>
          <span className="text-[12px]" style={{ color: "var(--ink-soft)" }}>{total} appliance{total === 1 ? "" : "s"}</span>
          <span className="text-[18px] font-bold" style={{ color: "var(--emerald-deep)" }}>£{price}</span>
        </div>
      </div>
      <button onClick={() => onConfirm(total, price)} className="w-full py-2.5 text-[13px] font-semibold text-white" style={{ background: "var(--emerald-deep)" }}>
        Book at £{price} →
      </button>
    </div>
  );
}

function BookingSlots({ service, onConfirm }: { service: string; onConfirm: (slot: string) => void }) {
  const [picked, setPicked] = useState<string | null>(null);
  const days = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return { key: d.toISOString().slice(0, 10), label: d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }) };
  });
  const windows = ["8–11am", "11–2pm", "2–5pm"];
  if (picked && picked === "_confirmed") {
    return (
      <div className="mt-3 rounded-2xl p-4 flex items-start gap-3" style={{ border: "1px solid color-mix(in oklab, var(--emerald) 25%, white)", background: "color-mix(in oklab, var(--emerald) 5%, white)" }}>
        <CheckCircle2 className="h-5 w-5 flex-shrink-0" style={{ color: "var(--emerald-deep)" }} />
        <div>
          <div className="text-[13px] font-semibold" style={{ color: "var(--ink)" }}>Booked — ref LC{Math.floor(Math.random() * 90000 + 10000)}</div>
          <div className="text-[12px]" style={{ color: "var(--ink-soft)" }}>Confirmation sent to your email.</div>
        </div>
      </div>
    );
  }
  return (
    <div className="mt-3 rounded-2xl overflow-hidden bg-white" style={{ border: "1px solid rgba(15,30,60,0.08)" }}>
      <div className="p-4">
        <div className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-3" style={{ color: "var(--emerald-deep)" }}>{service} · pick a slot</div>
        <div className="space-y-2">
          {days.map((d) => (
            <div key={d.key}>
              <div className="text-[11px] font-medium mb-1" style={{ color: "var(--ink-soft)" }}>{d.label}</div>
              <div className="grid grid-cols-3 gap-1.5">
                {windows.map((w) => {
                  const id = `${d.key}|${w}`;
                  const active = picked === id;
                  return (
                    <button
                      key={w}
                      onClick={() => setPicked(id)}
                      className="rounded-lg py-1.5 text-[11px] font-medium transition-colors"
                      style={{
                        background: active ? "var(--emerald-deep)" : "color-mix(in oklab, var(--navy) 4%, white)",
                        color: active ? "white" : "var(--ink)",
                        border: `1px solid ${active ? "var(--emerald-deep)" : "rgba(15,30,60,0.08)"}`,
                      }}
                    >
                      {w}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        disabled={!picked}
        onClick={() => { const slot = picked!; setPicked("_confirmed"); onConfirm(slot.replace("|", " · ")); }}
        className="w-full py-2.5 text-[13px] font-semibold text-white disabled:opacity-40"
        style={{ background: "var(--emerald-deep)" }}
      >
        Confirm booking →
      </button>
    </div>
  );
}

function AccredBadge({ logo, name, sub }: { logo: string; name: string; sub: string }) {
  return (
    <div className="flex items-center gap-1 flex-shrink-0">
      <img src={logo} alt={name} className="h-10 w-auto object-contain" />
      <div className="leading-tight">
        <div className="text-[12px] font-semibold whitespace-nowrap" style={{ color: "var(--ink)" }}>{name}</div>
        <div className="text-[10px] whitespace-nowrap" style={{ color: "var(--ink-soft)" }}>{sub}</div>
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
