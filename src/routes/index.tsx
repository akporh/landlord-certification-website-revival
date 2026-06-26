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
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Star,
  MessageCircle,
  X,
  Send,
  MapPin,
  Search,
} from "lucide-react";
import gasSafeLogo from "@/assets/gas-safe.jpg";
import napitLogo from "@/assets/napit.jpg";
import stromaLogo from "@/assets/stroma.jpg";
import trustmarkLogo from "@/assets/trustmark.jpg";
import trustpilotLogo from "@/assets/trustpilot.svg";
import lcLogo from "@/assets/lc-logo.png";

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
        content: "London's calmest way to stay compliant. Certified engineers, fixed prices, next-day slots.",
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
    label: "June Deal — Ends 30 June",
    name: "Gas Safety + Boiler Service",
    price: 85,
    saving: "Save ~£40 vs. booking separately",
    bg: "#1B3A6B",
    glow: "rgba(212,160,23,0.35)",
    cards: [
      { title: "Gas Safety", sub: "CP12 Certificate", color: "#B8860B", rotate: -10, tx: -20, ty: 10 },
      { title: "Boiler Service", sub: "Annual inspection", color: "#1B579A", rotate: 6, tx: 30, ty: -10 },
    ],
  },
  {
    label: "June Deal — Ends 30 June",
    name: "EICR + PAT Testing",
    sub: "1–3 bed · up to 20 items",
    price: 99,
    saving: "Save £46 vs. booking separately",
    bg: "#2D6A27",
    glow: "rgba(27,87,154,0.4)",
    cards: [
      { title: "EICR", sub: "Electrical inspection", color: "#1B579A", rotate: -8, tx: -20, ty: 12 },
      { title: "PAT Testing", sub: "Up to 20 items", color: "#3D7516", rotate: 7, tx: 28, ty: -8 },
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
    heading: "Same-day and next-day slots",
    body: "Across all 32 London boroughs. SMS confirmation within 15 minutes.",
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
    a: "Most London bookings get a same-day or next-day slot. Choose your preferred window at checkout and we confirm by SMS within 15 minutes.",
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

function getPostcodeResult(code: string): { status: "covered" | "fringe" | "outside"; message: string } {
  const upper = code.trim().toUpperCase().replace(/\s+/g, " ");
  const londonInner = /^(E|EC|N|NW|SE|SW|W|WC)\d/;
  const londonOuter = /^(BR|CR|DA|EN|HA|IG|KT|RM|SM|TW|UB|WD)\d/;
  if (!upper) return { status: "outside", message: "" };
  if (londonInner.test(upper)) return { status: "covered", message: "We cover your area — next-day slots available." };
  if (londonOuter.test(upper)) return { status: "fringe", message: "M25 fringe area — call us to confirm availability: 0203 772 5959" };
  return { status: "outside", message: "Outside our coverage area. Call us and we'll try to help: 0203 772 5959" };
}

type ChatMessage = {
  role: "ai" | "user" | "agent";
  content: string;
  canvas?: { type: string; data: Record<string, unknown> };
};

function DirectionA() {
  const [offerSlide, setOfferSlide] = useState(0);
  const [selected, setSelected] = useState<string[]>(["CP12", "EICR"]);
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [activeChecklistTab, setActiveChecklistTab] = useState<keyof typeof CHECKLISTS>("CP12");
  const [postcode, setPostcode] = useState("");
  const [postcodeResult, setPostcodeResult] = useState<{ status: string; message: string } | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "ai", content: "Hi! I'm the LC assistant. I can help with pricing, coverage, or booking. What do you need?" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [handoffActive, setHandoffActive] = useState(false);
  const [renewalContext, setRenewalContext] = useState<{ cert: string | null; awaitingDate: boolean }>({ cert: null, awaitingDate: false });
  const chatEndRef = useRef<HTMLDivElement>(null);

  const toggle = (code: string) =>
    setSelected((s) => (s.includes(code) ? s.filter((c) => c !== code) : [...s, code]));

  const total = SERVICES.filter((s) => selected.includes(s.code)).reduce((a, b) => a + b.price, 0);

  useEffect(() => {
    if (chatOpen) chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatOpen]);

  function getMockResponse(userMsg: string): { content: string; canvas?: { type: string; data: Record<string, unknown> }; handoff?: boolean } {
    const lower = userMsg.toLowerCase();

    // Human handoff
    if (["speak to someone", "real person", "human", "agent", "call me", "speak to a person"].some((t) => lower.includes(t))) {
      return { content: "Connecting you now...", handoff: true };
    }

    // Renewal flow — awaiting date
    if (renewalContext.awaitingDate) {
      const months = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
      const matchedMonth = months.find((m) => lower.includes(m));
      const yearMatch = lower.match(/20\d{2}/);
      if (matchedMonth || yearMatch) {
        const certType = renewalContext.cert ?? "Gas Safety";
        const validity: Record<string, { years: number; label: string }> = {
          "Gas Safety": { years: 1, label: "1 year" },
          "EICR": { years: 5, label: "5 years" },
          "EPC": { years: 10, label: "10 years" },
          "PAT": { years: 1, label: "1 year (recommended)" },
        };
        const v = validity[certType] ?? validity["Gas Safety"];
        const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        const monthIdx = matchedMonth ? months.indexOf(matchedMonth) : new Date().getMonth();
        const year = yearMatch ? parseInt(yearMatch[0]) : new Date().getFullYear();
        const renewalYear = year + v.years;
        const renewalMonth = monthNames[monthIdx];
        setRenewalContext({ cert: null, awaitingDate: false });
        return {
          content: `Your ${certType} certificate is due for renewal in **${renewalMonth} ${renewalYear}** (valid for ${v.label}). Want me to arrange a visit before it expires?`,
          canvas: {
            type: "renewal-timeline",
            data: {
              cert: certType,
              lastDone: `${monthNames[monthIdx]} ${year}`,
              dueDate: `${renewalMonth} ${renewalYear}`,
              validity: v.label,
            },
          },
        };
      }
    }

    // Certificate renewal / due date question
    const certKeywords: Array<[string[], string]> = [
      [["gas", "cp12", "boiler"], "Gas Safety"],
      [["eicr", "electric", "electrical"], "EICR"],
      [["epc", "energy"], "EPC"],
      [["pat"], "PAT"],
    ];
    const isDueQuestion = ["due", "expire", "renewal", "when", "renew", "remind"].some((t) => lower.includes(t));
    if (isDueQuestion) {
      for (const [keywords, certName] of certKeywords) {
        if (keywords.some((k) => lower.includes(k))) {
          setRenewalContext({ cert: certName, awaitingDate: true });
          return { content: `Sure — when was your last ${certName} inspection? (e.g. "June 2024")` };
        }
      }
      setRenewalContext({ cert: "Gas Safety", awaitingDate: true });
      return { content: "Happy to help. Which certificate — Gas Safety, EICR, EPC or PAT? And when was your last inspection?" };
    }

    // Pricing / quote
    if (["price", "cost", "how much", "quote", "cheap", "fee", "charge"].some((t) => lower.includes(t))) {
      const services = [
        { name: "Gas Safety (CP12)", price: "from £40" },
        { name: "EICR", price: "from £70" },
        { name: "EPC", price: "from £65" },
        { name: "PAT Testing", price: "from £55" },
      ];
      const juneDeal = lower.includes("gas") || lower.includes("bundle")
        ? [{ name: "☀️ June deal: Gas + Boiler Service", price: "£85 (save 60%)" }, { name: "June deal: EICR + PAT", price: "£99 (save £46)" }]
        : [];
      return {
        content: "Here's our current pricing. All prices are fixed — no hidden fees.",
        canvas: { type: "price-calculator", data: { services: [...services, ...juneDeal] } },
      };
    }

    // Coverage / postcode
    if (["cover", "area", "borough", "postcode", "london", "zone"].some((t) => lower.includes(t))) {
      const postcodeMatch = lower.match(/[a-z]{1,2}\d{1,2}/i);
      const covered = postcodeMatch ? /^(e|ec|n|nw|se|sw|w|wc)/i.test(postcodeMatch[0]) : true;
      return {
        content: covered
          ? "Yes, we cover that area — same-day and next-day slots available."
          : "That's an M25 fringe area. Call us on 0203 772 5959 to confirm availability.",
        canvas: { type: "coverage-result", data: { covered } },
      };
    }

    // Booking
    if (["book", "appoint", "slot", "visit", "schedule", "available"].some((t) => lower.includes(t))) {
      return { content: "We have same-day and next-day slots across all London boroughs. Quickest to call: 0203 772 5959 Mon–Fri 9am–5pm. Or use the 'Get quote' button above to select your certificates." };
    }

    // HMO / commercial
    if (["hmo", "commercial", "house in multiple", "fire alarm", "emergency light", "letting agent"].some((t) => lower.includes(t))) {
      return {
        content: "For HMOs and commercial properties we offer Emergency Lighting Certificates (£90), Fire Alarm Testing (£90) and Commercial EICR (from £150). All require annual or bi-annual inspection. Call 0203 772 5959 for a tailored quote.",
      };
    }

    // Certificate validity / what's covered
    if (["valid", "last", "how long", "covered", "include", "what do you"].some((t) => lower.includes(t))) {
      return { content: "Gas Safety (CP12) is valid for 1 year. EICR is valid for 5 years. EPC is valid for 10 years. PAT Testing is recommended annually. Our engineers are Gas Safe (552272), NAPIT and Stroma certified." };
    }

    // Fallback
    return { content: "I can help with pricing, coverage, certificate renewals or booking. What do you need?" };
  }

  function sendMessage() {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setMessages((m) => [...m, { role: "user", content: userMsg }]);
    setChatLoading(true);

    setTimeout(() => {
      const response = getMockResponse(userMsg);
      if (response.handoff) {
        setMessages((m) => [...m, { role: "ai", content: "Connecting you now..." }]);
        setTimeout(() => {
          setHandoffActive(true);
          setMessages((m) => [...m, { role: "agent", content: "Hi, this is Sarah from Landlord Certificates. How can I help you today?" }]);
          setChatLoading(false);
        }, 1500);
      } else {
        setMessages((m) => [...m, { role: "ai" as const, content: response.content, canvas: response.canvas }]);
        setChatLoading(false);
      }
    }, 600);
  }

  function checkPostcode() {
    setPostcodeResult(getPostcodeResult(postcode));
  }

  return (
    <div
      style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "var(--cream)", color: "var(--ink)" }}
      className="min-h-screen"
    >
      {/* 1. OFFER BAR */}
      <div className="text-white text-center text-xs py-2 px-4" style={{ background: "var(--navy-deep)" }}>
        <span className="inline-flex items-center gap-2 flex-wrap justify-center">
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
            <a href="#hmo" className="hover:text-[var(--navy)]">HMO</a>
            <a href="#offers" className="hover:text-[var(--navy)]">Offers</a>
            <a href="#coverage" className="hover:text-[var(--navy)]">Coverage</a>
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

      {/* 7. HMO & COMMERCIAL */}
      <section id="hmo" className="border-y" style={{ borderColor: "var(--line)", background: "white" }}>
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--navy)" }}>HMO & Commercial</div>
              <h2 className="mt-2 text-[32px] font-bold tracking-tight">Certificates for HMOs and commercial properties.</h2>
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

      {/* 8. JUNE DEALS CAROUSEL */}
      <section id="offers" className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--emerald-deep)" }}>This month</div>
            <h2 className="mt-2 text-[32px] font-bold tracking-tight">June deals. Real prices. No code needed.</h2>
          </div>
          <a href="#quote" className="text-sm font-semibold inline-flex items-center gap-1" style={{ color: "var(--navy)" }}>
            Build your own bundle <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="relative">
          {JUNE_DEALS.map((d, i) => (
            <div
              key={d.name}
              className="relative rounded-2xl overflow-hidden items-center"
              style={{
                background: d.bg,
                minHeight: 260,
                display: offerSlide === i ? "flex" : "none",
              }}
            >
              {/* Left: copy */}
              <div className="relative z-10 px-10 py-10 max-w-md">
                <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {d.label}
                </div>
                <h3 className="mt-2 text-2xl font-bold text-white leading-tight">{d.name}</h3>
                {"sub" in d && d.sub && (
                  <div className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>{d.sub}</div>
                )}
                <div className="mt-4 text-[56px] font-extrabold text-white tracking-tight leading-none">£{d.price}</div>
                <div className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>{d.saving}</div>
                <a
                  href="tel:02037725959"
                  className="mt-6 inline-block rounded-lg bg-white px-6 py-2.5 text-sm font-semibold"
                  style={{ color: d.bg }}
                >
                  Book now →
                </a>
              </div>

              {/* Right: floating certificate cards */}
              <div className="absolute right-0 top-0 h-full w-[50%] pointer-events-none hidden md:block">
                {/* glow behind cards */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div style={{
                    width: 220, height: 220,
                    borderRadius: "50%",
                    background: d.glow,
                    filter: "blur(48px)",
                  }} />
                </div>
                {/* cards */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {d.cards.map((c, ci) => (
                    <div
                      key={ci}
                      style={{
                        position: "absolute",
                        transform: `rotate(${c.rotate}deg) translate(${c.tx}px, ${c.ty}px)`,
                        width: 148,
                        borderRadius: 14,
                        background: c.color,
                        padding: "18px 16px",
                        boxShadow: "0 12px 40px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.12)",
                      }}
                    >
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 6 }}>Certificate</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>{c.title}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 4 }}>{c.sub}</div>
                      <div style={{ marginTop: 18, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", gap: 6 }}>
                        <CheckCircle2 size={13} style={{ color: "rgba(255,255,255,0.7)" }} />
                        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>Issued same day</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Prev / Next arrows */}
          <button
            onClick={() => setOfferSlide((s) => (s - 1 + JUNE_DEALS.length) % JUNE_DEALS.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full transition-colors"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          <button
            onClick={() => setOfferSlide((s) => (s + 1) % JUNE_DEALS.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full transition-colors"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="mt-4 flex justify-center gap-2">
          {JUNE_DEALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setOfferSlide(i)}
              className="h-2 rounded-full transition-all"
              style={{
                width: offerSlide === i ? 24 : 8,
                background: offerSlide === i ? "var(--navy)" : "var(--line)",
              }}
            />
          ))}
        </div>
      </section>

      {/* 9. COVERAGE MAP */}
      <section id="coverage" className="border-y" style={{ borderColor: "var(--line)", background: "white" }}>
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] items-start">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--navy)" }}>Coverage</div>
              <h2 className="mt-2 text-[32px] font-bold tracking-tight leading-tight">All 32 London boroughs.</h2>
              <p className="mt-4 text-[15px]" style={{ color: "var(--ink-soft)" }}>
                Same-day and next-day slots across Greater London. M25 fringe areas covered — call to confirm.
              </p>

              <div className="mt-8">
                <div className="text-[13px] font-medium mb-2">Check your postcode</div>
                <div className="flex gap-2">
                  <input
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && checkPostcode()}
                    placeholder="e.g. E14 5AB"
                    className="flex-1 rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-[var(--navy)]"
                    style={{ borderColor: "var(--line)" }}
                  />
                  <button
                    onClick={checkPostcode}
                    className="rounded-lg px-4 py-2.5 text-sm font-semibold text-white flex items-center gap-1.5"
                    style={{ background: "var(--navy)" }}
                  >
                    <Search className="h-4 w-4" /> Check
                  </button>
                </div>
                {postcodeResult && postcodeResult.message && (
                  <div
                    className="mt-3 rounded-lg px-4 py-3 text-sm flex items-start gap-2"
                    style={{
                      background: postcodeResult.status === "covered"
                        ? "color-mix(in oklab, var(--emerald) 8%, white)"
                        : postcodeResult.status === "fringe"
                        ? "oklch(0.98 0.04 90)"
                        : "oklch(0.98 0.02 25)",
                      border: `1px solid ${postcodeResult.status === "covered" ? "color-mix(in oklab, var(--emerald) 20%, white)" : "var(--line)"}`,
                    }}
                  >
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: postcodeResult.status === "covered" ? "var(--emerald-deep)" : "var(--ink-soft)" }} />
                    {postcodeResult.message}
                  </div>
                )}
              </div>

              <div className="mt-8">
                <div className="text-[13px] font-semibold mb-3" style={{ color: "var(--ink-soft)" }}>All boroughs covered</div>
                <div className="flex flex-wrap gap-1.5">
                  {LONDON_BOROUGHS.map((b) => (
                    <span key={b} className="text-[11px] px-2 py-0.5 rounded-md" style={{ background: "color-mix(in oklab, var(--navy) 8%, white)", color: "var(--navy)" }}>{b}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* SVG borough cartogram */}
            <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "rgba(255,255,255,0.1)", background: "var(--navy-deep)" }}>
              <div className="p-5 overflow-x-auto">
                <svg viewBox="0 0 492 268" xmlns="http://www.w3.org/2000/svg" className="w-full min-w-[380px]">
                  {BOROUGH_TILES.map((b) => {
                    const x = b.col * 54 + 3;
                    const y = b.row * 38 + 3;
                    return (
                      <g key={b.name}>
                        <rect
                          x={x} y={y} width={50} height={33} rx={4}
                          style={{
                            fill: b.inner ? "var(--emerald)" : "rgba(255,255,255,0.10)",
                            stroke: b.inner ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.12)",
                            strokeWidth: 1,
                          }}
                        />
                        <text
                          x={x + 25} y={y + 11.5}
                          fontSize="6.2" textAnchor="middle" dominantBaseline="middle"
                          style={{
                            fill: b.inner ? "rgba(0,0,0,0.75)" : "rgba(255,255,255,0.65)",
                            fontFamily: "system-ui, sans-serif",
                            fontWeight: "700",
                            letterSpacing: "0.08em",
                          }}
                        >
                          {b.short}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
              <div className="border-t px-5 py-3 flex flex-wrap gap-5 text-xs" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <div className="flex items-center gap-2" style={{ color: "rgba(255,255,255,0.55)" }}>
                  <div className="h-3 w-6 rounded-sm" style={{ background: "var(--emerald)" }} />
                  Same-day (Zone 1–2)
                </div>
                <div className="flex items-center gap-2" style={{ color: "rgba(255,255,255,0.55)" }}>
                  <div className="h-3 w-6 rounded-sm border" style={{ background: "rgba(255,255,255,0.10)", borderColor: "rgba(255,255,255,0.18)" }} />
                  Next-day (Zone 3–4)
                </div>
                <a href="tel:02037725959" className="ml-auto flex items-center gap-1 font-medium" style={{ color: "var(--emerald)" }}>
                  <Phone className="h-3 w-3" /> M25 fringe — call us
                </a>
              </div>
            </div>
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
              { n: "02", t: "Engineer visits", d: "A Gas Safe or NAPIT-registered engineer attends, with same-day and next-day slots across every London borough.", icon: CalendarClock },
              { n: "03", t: "Certificate delivered", d: "Your signed PDF arrives by email the same day, stored securely in your landlord portal and shareable in one click.", icon: Mail },
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

      {/* 11. CHECKLISTS (tabbed) */}
      <section className="border-b" style={{ borderColor: "var(--line)", background: "white" }}>
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] items-start">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--emerald-deep)" }}>Before we arrive</div>
              <h2 className="mt-2 text-[32px] font-bold tracking-tight leading-tight">A two-minute checklist for a smooth inspection.</h2>
              <p className="mt-4 text-[15px]" style={{ color: "var(--ink-soft)" }}>
                A little prep means our engineer is in and out faster — and your certificate lands in your inbox the same day.
              </p>
            </div>
            <div>
              {/* Tabs */}
              <div className="flex rounded-lg border overflow-hidden mb-5" style={{ borderColor: "var(--line)" }}>
                {(Object.keys(CHECKLISTS) as Array<keyof typeof CHECKLISTS>).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActiveChecklistTab(key)}
                    className="flex-1 py-2 text-sm font-semibold transition-colors"
                    style={{
                      background: activeChecklistTab === key ? "var(--navy)" : "white",
                      color: activeChecklistTab === key ? "white" : "var(--ink-soft)",
                      borderRight: key !== "PAT" ? "1px solid var(--line)" : "none",
                    }}
                  >
                    {key}
                  </button>
                ))}
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {CHECKLISTS[activeChecklistTab].map((item) => (
                  <li key={item} className="flex items-start gap-3 rounded-xl border p-4" style={{ borderColor: "var(--line)" }}>
                    <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: "var(--emerald-deep)" }} />
                    <span className="text-[14px] leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
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

      {/* AI CHAT WIDGET */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {chatOpen && (
          <div
            className="flex flex-col rounded-2xl overflow-hidden"
            style={{
              width: 380,
              height: 520,
              boxShadow: "var(--shadow-xl)",
              border: "1px solid rgba(27,87,154,0.15)",
              background: "white",
            }}
          >
            {/* Chat header */}
            <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ background: "var(--navy)" }}>
              <div className="flex items-center gap-2.5">
                <img src={lcLogo} alt="LC" className="h-7 w-auto brightness-0 invert" />
                <div>
                  <div className="text-[14px] font-semibold text-white">LC Assistant</div>
                  <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.5)" }}>⚡ Powered by onAiR</div>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-white opacity-70 hover:opacity-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: "oklch(0.98 0.005 255)" }}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "agent" && (
                    <div className="w-full">
                      <div className="text-[10px] font-semibold uppercase tracking-wider mb-1 px-1" style={{ color: "var(--emerald-deep)" }}>── Sarah joined ──</div>
                      <div
                        className="rounded-2xl px-4 py-3 text-[14px] leading-relaxed max-w-[85%]"
                        style={{
                          background: "color-mix(in oklab, var(--emerald) 8%, white)",
                          border: "1px solid color-mix(in oklab, var(--emerald) 20%, white)",
                          borderRadius: "12px 12px 12px 2px",
                        }}
                      >
                        {msg.content}
                      </div>
                    </div>
                  )}
                  {msg.role === "ai" && (
                    <div
                      className="rounded-2xl px-4 py-3 text-[14px] leading-relaxed max-w-[85%]"
                      style={{
                        background: "white",
                        border: "1px solid var(--line)",
                        borderRadius: "12px 12px 12px 2px",
                      }}
                    >
                      {msg.content}
                      {msg.canvas && <ChatCanvas canvas={msg.canvas} />}
                    </div>
                  )}
                  {msg.role === "user" && (
                    <div
                      className="rounded-2xl px-4 py-3 text-[14px] leading-relaxed max-w-[85%] text-white"
                      style={{ background: "var(--navy)", borderRadius: "12px 12px 2px 12px" }}
                    >
                      {msg.content}
                    </div>
                  )}
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl px-4 py-3 text-[14px]" style={{ background: "white", border: "1px solid var(--line)", borderRadius: "12px 12px 12px 2px" }}>
                    <span className="inline-flex gap-1">
                      <span className="animate-bounce">·</span>
                      <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>·</span>
                      <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>·</span>
                    </span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="flex gap-2 p-3 border-t" style={{ borderColor: "var(--line)" }}>
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder={handoffActive ? "Chat with Sarah..." : "Ask about pricing, coverage..."}
                className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:border-[var(--navy)]"
                style={{ borderColor: "var(--line)" }}
              />
              <button
                onClick={sendMessage}
                disabled={chatLoading || !chatInput.trim()}
                className="rounded-lg px-3 py-2 text-white disabled:opacity-40"
                style={{ background: "var(--navy)" }}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setChatOpen((o) => !o)}
          className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg"
          style={{ background: "var(--navy)", boxShadow: "var(--shadow-lg)" }}
        >
          {chatOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </button>
      </div>
    </div>
  );
}

function ChatCanvas({ canvas }: { canvas: { type: string; data: Record<string, unknown> } }) {
  if (canvas.type === "price-calculator") {
    const services = (canvas.data.services as Array<{ name: string; price: string }>) || [];
    return (
      <div className="mt-3 rounded-xl border p-3" style={{ borderColor: "var(--line)", background: "var(--navy-faint)" }}>
        <div className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--navy)" }}>Price estimate</div>
        {services.map((s: { name: string; price: string }) => (
          <div key={s.name} className="flex justify-between text-[13px] py-1">
            <span>{s.name}</span>
            <span className="font-semibold">{s.price}</span>
          </div>
        ))}
        <a href="tel:02037725959" className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "var(--navy)" }}>
          <Phone className="h-3 w-3" /> Book: 0203 772 5959
        </a>
      </div>
    );
  }
  if (canvas.type === "renewal-timeline") {
    const { cert, lastDone, dueDate, validity } = canvas.data as { cert: string; lastDone: string; dueDate: string; validity: string };
    return (
      <div className="mt-3 rounded-xl border p-3" style={{ borderColor: "var(--line)", background: "var(--navy-faint)" }}>
        <div className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--navy)" }}>Certificate renewal</div>
        <div className="text-[13px] space-y-1">
          <div className="flex justify-between"><span style={{ color: "var(--ink-soft)" }}>Certificate</span><span className="font-semibold">{cert}</span></div>
          <div className="flex justify-between"><span style={{ color: "var(--ink-soft)" }}>Last done</span><span>{lastDone}</span></div>
          <div className="flex justify-between"><span style={{ color: "var(--ink-soft)" }}>Valid for</span><span>{validity}</span></div>
          <div className="flex justify-between border-t mt-2 pt-2" style={{ borderColor: "var(--line)" }}><span style={{ color: "var(--ink-soft)" }}>Due</span><span className="font-bold" style={{ color: "var(--navy)" }}>{dueDate}</span></div>
        </div>
        <a href="tel:02037725959" className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "var(--navy)" }}>
          <Phone className="h-3 w-3" /> Book renewal: 0203 772 5959
        </a>
      </div>
    );
  }
  if (canvas.type === "coverage-result") {
    const covered = canvas.data.covered as boolean;
    return (
      <div className="mt-3 rounded-xl border p-3 text-[13px]" style={{ borderColor: covered ? "color-mix(in oklab, var(--emerald) 30%, white)" : "var(--line)", background: covered ? "color-mix(in oklab, var(--emerald) 6%, white)" : "white" }}>
        {covered ? "✓ We cover your area — next-day slots available." : "⚠ Please call us to confirm: 0203 772 5959"}
      </div>
    );
  }
  return null;
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
