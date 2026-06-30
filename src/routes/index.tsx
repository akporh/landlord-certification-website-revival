import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect, useMemo } from "react";
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
  Home,
  Building2,
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
    codes: "CP12,BSV",
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
    codes: "EICR,PAT",
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
    body: "Every borough covered. Book online in under 60 seconds — confirmed instantly, no phone call needed.",
  },
  {
    icon: Star,
    heading: "3,554 verified reviews",
    body: "4.7 on Trustpilot. Over 12,000 certificates issued since 2012.",
  },
];

const FAQS = [
  {
    q: "How does booking work?",
    a: "Select your certificates, enter your postcode, and pick a date and time. The whole process takes under 60 seconds — no phone calls, no back-and-forth. You'll get an instant on-screen confirmation with your engineer's details, and a copy emailed to you.",
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

// ── Demo persona ────────────────────────────────────────────────────────────

const DEMO_LANDLORD = {
  name: "John Williams",
  properties: [
    {
      address: "14 Elspeth Road, Battersea, SW11 1LE",
      certs: [
        { type: "Gas Safety (CP12)", cert: "CP12", engineer: "Darren Walsh", gasSafeNo: "552272", issued: "15 Jul 2025", issuedISO: "2025-07-15", expires: "14 Jul 2026", expiresISO: "2026-07-14", status: "Pass", chipStatus: "due" as const },
        { type: "Electrical (EICR)",  cert: "EICR", engineer: "Marcus Reid",  gasSafeNo: "—",    issued: "3 Mar 2022",  issuedISO: "2022-03-03", expires: "3 Mar 2027",  expiresISO: "2027-03-03", status: "Pass", chipStatus: "valid" as const },
      ],
    },
    {
      address: "7 Albany Road, Camberwell, SE5 0AL",
      certs: [
        { type: "Gas Safety (CP12)", cert: "CP12", engineer: "Darren Walsh", gasSafeNo: "552272", issued: "20 Jun 2024", issuedISO: "2024-06-20", expires: "19 Jun 2025", expiresISO: "2025-06-19", status: "Pass", chipStatus: "expired" as const },
        { type: "Energy (EPC)",       cert: "EPC",  engineer: "Claire Santos", gasSafeNo: "—",  issued: "10 Jan 2020", issuedISO: "2020-01-10", expires: "10 Jan 2030", expiresISO: "2030-01-10", status: "Pass", chipStatus: "valid" as const },
      ],
    },
  ],
};

const DEMO_PORTFOLIO = DEMO_LANDLORD.properties.flatMap((p) =>
  p.certs.map((c) => ({ address: p.address, cert: c.type, status: c.chipStatus, expires: c.expires }))
);

function buildDemoCanvas(msg: string): { content: string; canvas: { type: string; data: Record<string, unknown> } } | null {
  const m = msg.toLowerCase();
  if (/my properties|my portfolio|all my certs|all certificates/.test(m)) {
    return {
      content: `Here’s your full portfolio, ${DEMO_LANDLORD.name}. One certificate needs attention.`,
      canvas: { type: "portfolio-table", data: { properties: DEMO_PORTFOLIO } },
    };
  }
  if (/my certificates?|see my|show my|my gas safety|my eicr|my epc|my pat/.test(m)) {
    const prop = DEMO_LANDLORD.properties[0];
    const cert = prop.certs[0];
    return {
      content: `Here’s your ${cert.type} for ${prop.address}, ${DEMO_LANDLORD.name}.`,
      canvas: {
        type: "certificate-preview",
        data: { type: cert.type, address: prop.address, engineer: cert.engineer, gasSafeNo: cert.gasSafeNo, issued: cert.issued, expires: cert.expires, status: cert.status },
      },
    };
  }
  if (/when.*(mine|my|due|expir|renew)|due soon|upcoming renewal/.test(m)) {
    const cert = DEMO_LANDLORD.properties[0].certs[0];
    return {
      content: `Your Battersea Gas Safety is due for renewal on ${cert.expires}. Book now to stay compliant.`,
      canvas: { type: "renewal-timeline", data: { cert: "Gas Safety", lastDone: cert.issuedISO, dueDate: cert.expiresISO, validity: "1 year" } },
    };
  }
  return null;
}

type ChatPill = { label: string; message?: string; canvas?: { type: string; data: Record<string, unknown> }; companionMsg?: string; demoCanvas?: { type: string; data: Record<string, unknown> }; demoMsg?: string };

const CHAT_PILLS: ChatPill[] = [
  {
    label: "My certificates",
    demoCanvas: { type: "portfolio-table", data: { properties: DEMO_PORTFOLIO } },
    demoMsg: `Here are your certificates, ${DEMO_LANDLORD.name}. One needs attention.`,
    message: "Can I see my certificates?",
  },
  {
    label: "Get a quote",
    canvas: { type: "appliance-counter", data: { basePrice: 40, perItem: 10 } },
    companionMsg: "Sure — tell me about your appliances and I’ll give you a fixed price.",
  },
  {
    label: "Check coverage",
    canvas: { type: "coverage-result", data: {} },
    companionMsg: "Enter your postcode and I’ll check straight away.",
  },
  {
    label: "Book now",
    message: "I’d like to book",
  },
  {
    label: "When’s mine due?",
    demoCanvas: { type: "renewal-timeline", data: { cert: "Gas Safety", lastDone: "2025-07-15", dueDate: "2026-07-14", validity: "1 year" } },
    demoMsg: `Your Battersea Gas Safety is due 14 Jul 2026, ${DEMO_LANDLORD.name}.`,
    message: "When is my gas safety certificate due?",
  },
  {
    label: "What’s a C2?",
    message: "What’s a C2 code on an EICR?",
  },
  {
    label: "👤 Speak to a person",
    message: "I’d like to speak to a person",
  },
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
  const [quoteMode, setQuoteMode] = useState<"entry" | "residential" | "commercial">("entry");
  const [commCertType, setCommCertType] = useState("");
  const [commPropType, setCommPropType] = useState("");
  const [commPostcode, setCommPostcode] = useState("");
  
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
  const [demoMode, setDemoMode] = useState(false);
  const isBusinessHours = useMemo(() => {
    const now = new Date();
    const london = new Date(now.toLocaleString("en-US", { timeZone: "Europe/London" }));
    const day = london.getDay();
    const hour = london.getHours();
    return day >= 1 && day <= 5 && hour >= 9 && hour < 17;
  }, []);
  const [oohActive, setOohActive] = useState(false);

  function resetChat() {
    setMessages([{ role: "ai", content: "Hi, I can quote prices, check coverage, or show your certificates.\n\nWhat do you need?" }]);
    setChatInput("");
    setChatLoading(false);
    setHandoffActive(false);
    setOohActive(false);
    setConfirmReset(false);
    setActiveCanvas(null);
  }

  function toggleDemoMode() {
    const next = !demoMode;
    setDemoMode(next);
    setActiveCanvas(null);
    setHandoffActive(false);
    setConfirmReset(false);
    if (next) {
      setMessages([{
        role: "ai",
        content: `Welcome back, ${DEMO_LANDLORD.name}!\n\nYou have 4 certificates across 2 properties. Your Battersea Gas Safety is coming up for renewal in July.\n\nWhat would you like to do?`,
      }]);
    } else {
      setMessages([{ role: "ai", content: "Hi, I can quote prices, check coverage, or show your certificates.\n\nWhat do you need?" }]);
    }
    setChatInput("");
    setChatLoading(false);
  }

  function handlePill(pill: ChatPill) {
    if (pill.canvas) {
      setMessages((m) => [
        ...m,
        { role: "user", content: pill.label },
        { role: "ai", content: pill.companionMsg ?? "Here you go.", canvas: pill.canvas },
      ]);
      openCanvas(pill.canvas);
    } else if (demoMode && pill.demoCanvas) {
      setMessages((m) => [
        ...m,
        { role: "user", content: pill.label },
        { role: "ai", content: pill.demoMsg ?? `Here you go, ${DEMO_LANDLORD.name}.`, canvas: pill.demoCanvas },
      ]);
      openCanvas(pill.demoCanvas);
    } else {
      sendMessage(pill.message ?? pill.label);
    }
  }
  const chatEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  function openCanvas(canvas: { type: string; data: Record<string, unknown> }) {
    if (canvas.type === "booking-redirect") {
      const services = (canvas.data.services as string[] | undefined) ?? [];
      const query = services.join(",");
      navigate({ to: "/book" as "/", search: query ? { s: query } : undefined });
      setChatOpen(false);
    } else {
      setActiveCanvas(canvas);
    }
  }

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

    if (demoMode) {
      const demo = buildDemoCanvas(userMsg);
      if (demo) {
        setMessages((m) => [...m, { role: "ai", content: demo.content, canvas: demo.canvas }]);
        openCanvas(demo.canvas);
        setChatLoading(false);
        return;
      }
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history }),
      });
      const data = await res.json() as { content: string; canvas: { type: string; data: Record<string, unknown> } | null; handoff: boolean | "ooh" };
      if (data.handoff === "ooh") {
        setMessages((m) => [...m, { role: "ai" as const, content: data.content }]);
        setTimeout(() => {
          setOohActive(true);
          setChatLoading(false);
        }, 600);
      } else if (data.handoff) {
        setMessages((m) => [...m, { role: "ai", content: "Connecting you now..." }]);
        setTimeout(() => {
          setHandoffActive(true);
          setMessages((m) => [...m, { role: "agent", content: "Hi, this is Sarah from Landlord Certificates. How can I help you today?" }]);
          setChatLoading(false);
        }, 1500);
      } else {
        setMessages((m) => [...m, { role: "ai" as const, content: data.content, canvas: data.canvas ?? undefined }]);
        if (data.canvas) openCanvas(data.canvas);
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
            <img src={lcLogo} alt="Landlord Certificates" className="h-14 w-auto" />
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
            <button
              onClick={toggleDemoMode}
              className="hidden md:inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition-all"
              style={{
                borderColor: demoMode ? "color-mix(in oklab, var(--emerald) 40%, white)" : "var(--line)",
                background: demoMode ? "color-mix(in oklab, var(--emerald) 10%, white)" : "transparent",
                color: demoMode ? "var(--emerald-deep)" : "var(--ink)",
              }}
            >
              <LogIn className="h-3.5 w-3.5" />
              {demoMode ? "J. Williams ✓" : "Sign in"}
            </button>
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

          {/* ── Entry: property type question ── */}
          {quoteMode === "entry" && (
            <>
              {/* Header strip */}
              <div className="-mx-6 -mt-6 mb-5 px-5 py-3.5 border-b" style={{ borderColor: "var(--line)" }}>
                <div className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 mb-2" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                  <span className="h-[5px] w-[5px] rounded-full" style={{ background: "var(--emerald-deep)", display: "inline-block" }} />
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#166534" }}>Instant quote</span>
                </div>
                <div className="text-[16px] font-bold" style={{ color: "var(--navy-deep)" }}>What type of property?</div>
              </div>
              {/* Stacked tiles */}
              <div className="flex flex-col gap-2 px-1">
                <button
                  onClick={() => setQuoteMode("residential")}
                  className="flex items-center gap-3.5 w-full rounded-xl border px-4 py-3.5 text-left transition-all hover:border-[var(--emerald-deep)]"
                  style={{ borderColor: "var(--line)", background: "white" }}
                >
                  <div className="h-[38px] w-[38px] rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ background: "#f0fdf4" }}>
                    <Home className="h-[18px] w-[18px]" style={{ color: "var(--emerald-deep)" }} />
                  </div>
                  <div className="flex-1">
                    <div className="text-[13.5px] font-bold" style={{ color: "var(--navy-deep)" }}>Residential</div>
                    <div className="text-[11.5px] mt-0.5" style={{ color: "var(--ink-soft)" }}>Flats, houses &amp; buy-to-let</div>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#cbd5e1" }} />
                </button>
                <button
                  onClick={() => setQuoteMode("commercial")}
                  className="flex items-center gap-3.5 w-full rounded-xl border px-4 py-3.5 text-left transition-all hover:border-[var(--navy)]"
                  style={{ borderColor: "var(--line)", background: "white" }}
                >
                  <div className="h-[38px] w-[38px] rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ background: "#eff3fc" }}>
                    <Building2 className="h-[18px] w-[18px]" style={{ color: "var(--navy)" }} />
                  </div>
                  <div className="flex-1">
                    <div className="text-[13.5px] font-bold" style={{ color: "var(--navy-deep)" }}>Commercial &amp; HMO</div>
                    <div className="text-[11.5px] mt-0.5" style={{ color: "var(--ink-soft)" }}>Offices, HMOs &amp; managed properties</div>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#cbd5e1" }} />
                </button>
              </div>
              {/* Footer strip */}
              <div className="-mx-6 -mb-6 mt-5 px-5 py-3 border-t text-center text-[11.5px]" style={{ borderColor: "var(--line)", color: "var(--ink-soft)" }}>
                Fixed prices · All 32 London boroughs · Takes 60 seconds
              </div>
            </>
          )}

          {/* ── Path A: Residential calculator ── */}
          {quoteMode === "residential" && (
            <>
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setQuoteMode("entry")} className="flex items-center gap-1 text-[12px] font-medium hover:opacity-70 transition-opacity" style={{ color: "var(--ink-soft)", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" }}>
                  <ChevronLeft className="h-3.5 w-3.5" /> Change
                </button>
                <div className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: "var(--emerald-deep)" }}>
                  <Home className="h-3.5 w-3.5" /> Residential
                </div>
              </div>
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
                <Link to="/book" search={{ s: selected.join(",") }} className="rounded-lg px-5 py-3 text-sm font-semibold text-white" style={{ background: "var(--navy)" }}>
                  Book engineer →
                </Link>
              </div>
            </>
          )}

          {/* ── Path B: Commercial quote form ── */}
          {quoteMode === "commercial" && (
            <>
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setQuoteMode("entry")} className="flex items-center gap-1 text-[12px] font-medium hover:opacity-70 transition-opacity" style={{ color: "var(--ink-soft)", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" }}>
                  <ChevronLeft className="h-3.5 w-3.5" /> Change
                </button>
                <div className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: "var(--navy)" }}>
                  <Building2 className="h-3.5 w-3.5" /> Commercial &amp; HMO
                </div>
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--ink-soft)" }}>Get a fixed quote</div>
              <div className="mt-1 text-lg font-semibold">Tell us what you need</div>
              <p className="mt-1 text-[13px]" style={{ color: "var(--ink-soft)" }}>
                Prices depend on size and spec. Tell us what you need and we'll call with a fixed price within 2 hours.
              </p>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="text-xs font-medium" style={{ color: "var(--ink-soft)" }}>Certificate type</label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {["Emergency Lighting", "Fire Alarm Testing", "Commercial EICR", "Not sure / multiple"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setCommCertType(t)}
                        className="rounded-lg border p-2.5 text-left text-[12px] font-medium transition-all"
                        style={{
                          borderColor: commCertType === t ? "var(--navy)" : "var(--line)",
                          background: commCertType === t ? "color-mix(in oklab, var(--navy) 6%, white)" : "white",
                          color: commCertType === t ? "var(--navy-deep)" : "var(--ink)",
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium" style={{ color: "var(--ink-soft)" }}>Property type</label>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {[
                      { label: "HMO", sub: "up to 6 beds" },
                      { label: "Commercial", sub: "office / retail" },
                      { label: "Large site", sub: "multi-unit" },
                    ].map(({ label, sub }) => (
                      <button
                        key={label}
                        onClick={() => setCommPropType(label)}
                        className="rounded-lg border p-2.5 text-center transition-all"
                        style={{
                          borderColor: commPropType === label ? "var(--navy)" : "var(--line)",
                          background: commPropType === label ? "color-mix(in oklab, var(--navy) 6%, white)" : "white",
                        }}
                      >
                        <div className="text-[12px] font-semibold" style={{ color: commPropType === label ? "var(--navy-deep)" : "var(--ink)" }}>{label}</div>
                        <div className="text-[10px] mt-0.5" style={{ color: "var(--ink-soft)" }}>{sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium" style={{ color: "var(--ink-soft)" }}>Property postcode</label>
                  <input
                    value={commPostcode}
                    onChange={(e) => setCommPostcode(e.target.value.toUpperCase())}
                    placeholder="e.g. EC1A 1BB"
                    className="mt-1.5 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-[var(--navy)]"
                    style={{ borderColor: "var(--line)" }}
                  />
                </div>
              </div>

              <div className="mt-5 border-t pt-4" style={{ borderColor: "var(--line)" }}>
                <a
                  href="tel:02037725959"
                  className="block w-full rounded-lg py-3 text-center text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: "var(--navy)" }}
                >
                  Request a quote →
                </a>
                <p className="mt-2 text-center text-[11px]" style={{ color: "var(--ink-soft)" }}>
                  We'll call you within 2 hours · Mon–Fri 9am–5pm
                </p>
              </div>
            </>
          )}
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
              <AccredBadge logo={trustmarkLogo} name="TrustMark" sub="Gov. Endorsed" imgClass="h-16 w-16" />
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
                    <Link to="/book" search={{ s: s.code }} className="text-sm font-semibold" style={{ color: "var(--navy)" }}>Book online →</Link>
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
                    <Link
                      to="/book"
                      search={{ s: d.codes ?? "" }}
                      className="mt-6 inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
                      style={{ background: "linear-gradient(135deg, #d4a017, #b8860b)", boxShadow: "0 4px 20px rgba(212,160,23,0.35)" }}
                    >
                      Book this bundle <ArrowRight className="h-4 w-4" />
                    </Link>
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
              { n: "01", t: "Choose & quote", d: "Pick the certificates you need for an instant price. Select your date and time slot — booked in under 60 seconds with instant on-screen confirmation.", icon: ClipboardCheck },
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
                      Instant replies · 24/7
                      <span style={{ color: "var(--line)", margin: "0 2px" }}>|</span>
                      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: isBusinessHours ? "var(--emerald)" : "#94a3b8" }} />
                      <span style={{ color: isBusinessHours ? "var(--emerald-deep)" : "#94a3b8" }}>
                        {isBusinessHours ? "Agents online" : "Agents back 9am"}
                      </span>
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
                            className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold hover:opacity-75 transition-opacity"
                            style={{ color: "var(--navy)", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" }}
                          >
                            View result <ChevronRight className="h-3 w-3" />
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
                  {CHAT_PILLS.map((pill) => (
                    <button
                      key={pill.label}
                      onClick={() => handlePill(pill)}
                      className="rounded-full px-3 py-1.5 text-[12px] font-medium transition-all hover:scale-[1.02]"
                      style={{ background: "color-mix(in oklab, var(--emerald) 8%, white)", border: "1px solid color-mix(in oklab, var(--emerald) 20%, white)", color: "var(--emerald-deep)" }}
                    >
                      {pill.label}
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

            {/* OOH callback form */}
            {oohActive && (
              <div className="mx-4 mb-3 rounded-2xl border p-4" style={{ borderColor: "var(--line)", background: "var(--cream)" }}>
                <div className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--ink-soft)" }}>Request a callback</div>
                <input placeholder="Your name" className="mb-2 w-full rounded-xl border px-3 py-2 text-[13px] outline-none" style={{ borderColor: "var(--line)", background: "white" }} />
                <input placeholder="Phone number" className="mb-3 w-full rounded-xl border px-3 py-2 text-[13px] outline-none" style={{ borderColor: "var(--line)", background: "white" }} />
                <button className="w-full rounded-xl py-2.5 text-[13px] font-bold text-white" style={{ background: "var(--navy-deep)" }}>
                  Request callback →
                </button>
                <div className="mt-2 text-center text-[11px]" style={{ color: "var(--ink-soft)" }}>
                  Or email <a href="mailto:info@landlord-certificates.co.uk" style={{ color: "var(--navy)", fontWeight: 700 }}>info@landlord-certificates.co.uk</a>
                </div>
              </div>
            )}

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
              {!handoffActive && !oohActive && (
                <div className="text-center mt-2">
                  <button
                    onClick={() => sendMessage("I'd like to speak to a person")}
                    className="text-[11px] hover:opacity-80"
                    style={{ color: "var(--ink-soft)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0 }}
                  >
                    Prefer to speak with someone?{" "}
                    <span style={{ color: "var(--navy)", fontWeight: 700, textDecoration: "underline" }}>Connect me →</span>
                  </button>
                </div>
              )}
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

function AccredBadge({ logo, name, sub, imgClass = "h-14 w-14" }: { logo: string; name: string; sub: string; imgClass?: string }) {
  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <img src={logo} alt={name} className={`${imgClass} rounded object-contain`} />
      <div>
        <div className="text-[12px] font-semibold leading-tight" style={{ color: "var(--ink)" }}>{name}</div>
        <div className="text-[11px] leading-tight" style={{ color: "var(--ink-soft)" }}>{sub}</div>
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

// ── Shared primitives ──────────────────────────────────────────────────────

const divider: React.CSSProperties = {
  height: 1,
  background: "var(--line)",
  margin: "10px 0 0",
};

const label: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "var(--ink-soft)",
  textTransform: "uppercase" as const,
  letterSpacing: ".08em",
  marginBottom: 3,
};

function CTA({
  children,
  onClick,
  ghost,
  color,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  ghost?: boolean;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "block",
        width: "100%",
        marginTop: 12,
        background: ghost ? "white" : color ?? "var(--emerald-deep)",
        color: ghost ? "var(--navy-deep)" : "white",
        border: ghost ? "1.5px solid var(--line)" : "none",
        borderRadius: 11,
        padding: "12px 16px",
        fontSize: 13,
        fontWeight: 700,
        cursor: "pointer",
        textAlign: "center",
        fontFamily: "inherit",
        letterSpacing: ".01em",
      }}
    >
      {children}
    </button>
  );
}

function FieldRow({ label: lbl, value, mono, warn }: { label: string; value: string; mono?: boolean; warn?: boolean }) {
  return (
    <div>
      <div style={label}>{lbl}</div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: warn ? "oklch(0.52 0.17 27)" : "var(--ink)",
          fontFamily: mono ? "'JetBrains Mono', ui-monospace, monospace" : "inherit",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Chip({ status }: { status: "valid" | "due" | "expired" }) {
  const styles: Record<string, React.CSSProperties> = {
    valid: {
      background: "oklch(0.93 0.05 130)",
      color: "var(--emerald-deep)",
    },
    due: {
      background: "oklch(0.96 0.05 60)",
      color: "oklch(0.50 0.17 55)",
      border: "1px solid oklch(0.87 0.11 60)",
    },
    expired: {
      background: "oklch(0.96 0.04 27)",
      color: "oklch(0.46 0.20 28)",
      border: "1px solid oklch(0.87 0.12 27)",
    },
  };
  const labels = { valid: "Valid", due: "Due soon", expired: "Expired" };
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: ".06em",
        textTransform: "uppercase",
        padding: "3px 9px",
        borderRadius: 99,
        whiteSpace: "nowrap",
        flexShrink: 0,
        ...styles[status],
      }}
    >
      {labels[status]}
    </span>
  );
}

// ── Postcode lookup (unchanged from original) ──────────────────────────────

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

// ── Sub-components ─────────────────────────────────────────────────────────

function CoverageCanvas({ data, onSend }: { data: Record<string, unknown>; onSend: (msg?: string) => void }) {
  const navigate = useNavigate();
  const initial = data.postcode as string | undefined;
  const [input, setInput] = useState(initial ?? "");
  const [result, setResult] = useState<{ borough: string; zone: "same-day" | "next-day"; covered: boolean } | null>(() => {
    if (data.borough) return { borough: data.borough as string, zone: (data.zone as "same-day" | "next-day") ?? "next-day", covered: data.covered as boolean };
    if (initial) return lookupPostcode(initial);
    return null;
  });

  function check() {
    const found = lookupPostcode(input);
    setResult(found ?? { borough: "", zone: "next-day", covered: false });
  }

  return (
    <div style={{ marginTop: 10 }}>
      {result && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 10, borderBottom: "1px solid var(--line)" }}>
          <div
            style={{
              width: 22, height: 22,
              background: result.covered ? "var(--emerald-deep)" : "#dc2626",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {result.covered
              ? <CheckCircle2 style={{ width: 12, height: 12, color: "white" }} />
              : <X style={{ width: 12, height: 12, color: "white" }} />}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", flex: 1 }}>
            {result.covered ? `${result.borough}` : "Outside our zone"}
          </div>
          {result.covered && (
            <span
              style={{
                fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em",
                background: result.zone === "same-day" ? "oklch(0.93 0.05 130)" : "var(--navy-faint)",
                color: result.zone === "same-day" ? "var(--emerald-deep)" : "var(--navy)",
                padding: "3px 9px", borderRadius: 99,
              }}
            >
              {result.zone === "same-day" ? "Same-day" : "Next-day"}
            </span>
          )}
        </div>
      )}

      {/* Postcode input */}
      <div style={{ paddingTop: 10 }}>
        {!result && <div style={{ fontSize: 11, color: "var(--ink-soft)", marginBottom: 7 }}>Check your postcode</div>}
        {result && <div style={{ fontSize: 11, color: "var(--ink-soft)", marginBottom: 7 }}>Check another postcode</div>}
        <div style={{ display: "flex", gap: 6 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && check()}
            placeholder="e.g. SW11 2AB"
            style={{
              flex: 1, background: "oklch(0.97 0.006 256)",
              border: "1.5px solid var(--line)", borderRadius: 9,
              padding: "9px 12px", fontSize: 13, color: "var(--ink)",
              outline: "none", fontFamily: "inherit",
            }}
          />
          <button
            onClick={check}
            disabled={!input.trim()}
            style={{
              background: "var(--navy)", color: "white", border: "none",
              borderRadius: 9, padding: "9px 14px", fontSize: 12,
              fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Check
          </button>
        </div>
      </div>

      {result?.covered && (
        <CTA onClick={() => navigate({ to: "/book" as "/" })}>
          Book in {result.borough} →
        </CTA>
      )}
    </div>
  );
}

function ApplianceCounter({ basePrice, perItem, onConfirm }: { basePrice: number; perItem: number; onConfirm: (count: number, total: number) => void }) {
  const [counts, setCounts] = useState<Record<string, number>>({ Boiler: 1, "Hob / cooker": 0, "Gas fire": 0 });
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const price = basePrice + Math.max(0, total - 1) * perItem;

  const subtitles: Record<string, string> = {
    Boiler: "Combi / system / regular",
    "Hob / cooker": "Gas hob, range or cooker",
    "Gas fire": "Fireplace or gas fire",
  };

  return (
    <div style={{ marginTop: 10 }}>
      <div style={divider} />
      {Object.keys(counts).map((k, i, arr) => (
        <div
          key={k}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 0",
            borderBottom: i < arr.length - 1 ? "1px solid var(--line)" : "none",
          }}
        >
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{k}</div>
            <div style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 1 }}>{subtitles[k]}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              onClick={() => setCounts((c) => ({ ...c, [k]: Math.max(0, c[k] - 1) }))}
              style={{
                width: 28, height: 28, border: "1.5px solid var(--line)",
                background: "white", borderRadius: 8,
                fontSize: 16, fontWeight: 700, color: "var(--ink)",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "inherit",
              }}
            >
              −
            </button>
            <div style={{ width: 30, textAlign: "center", fontSize: 14, fontWeight: 800, color: "var(--ink)" }}>
              {counts[k]}
            </div>
            <button
              onClick={() => setCounts((c) => ({ ...c, [k]: c[k] + 1 }))}
              style={{
                width: 28, height: 28,
                background: "var(--emerald-deep)", border: "1.5px solid var(--emerald-deep)",
                borderRadius: 8, fontSize: 16, fontWeight: 700, color: "white",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "inherit",
              }}
            >
              +
            </button>
          </div>
        </div>
      ))}

      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "10px 0 0", borderTop: "1px solid var(--line)", marginTop: 4 }}>
        <div style={{ fontSize: 12, color: "var(--ink-soft)", fontWeight: 600 }}>{total} appliance{total === 1 ? "" : "s"}</div>
        <div style={{ fontSize: 26, fontWeight: 900, color: "var(--emerald-deep)", letterSpacing: "-.02em" }}>£{price}</div>
      </div>

      <CTA onClick={() => onConfirm(total, price)}>Book Gas Safety at £{price} →</CTA>
    </div>
  );
}

function BookingSlots({ service, onConfirm }: { service: string; onConfirm: (slot: string) => void }) {
  const days = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      key: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric" }),
    };
  });
  const windows = ["8:00 – 11:00 am", "11:00 am – 2:00 pm", "2:00 – 5:00 pm"];
  const [pickedDay, setPickedDay] = useState(days[0].key);
  const [pickedTime, setPickedTime] = useState(windows[0]);

  return (
    <div style={{ marginTop: 10 }}>
      <div style={divider} />

      {/* Day strip */}
      <div style={{ display: "flex", gap: 5, padding: "8px 0 10px", borderBottom: "1px solid var(--line)", overflowX: "auto" }}>
        {days.map((d) => (
          <button
            key={d.key}
            onClick={() => setPickedDay(d.key)}
            style={{
              padding: "7px 13px", borderRadius: 9,
              fontSize: 12, fontWeight: 700,
              background: pickedDay === d.key ? "var(--navy-deep)" : "white",
              color: pickedDay === d.key ? "white" : "var(--ink)",
              border: pickedDay === d.key ? "1.5px solid var(--navy-deep)" : "1.5px solid var(--line)",
              cursor: "pointer", flexShrink: 0, fontFamily: "inherit",
            }}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Time slots */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "10px 0 2px" }}>
        {windows.map((w) => {
          const active = pickedTime === w;
          return (
            <button
              key={w}
              onClick={() => setPickedTime(w)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 12px", borderRadius: 10,
                border: active ? "1.5px solid var(--navy-deep)" : "1.5px solid var(--line)",
                background: active ? "oklch(0.97 0.012 255)" : "white",
                cursor: "pointer", fontFamily: "inherit", textAlign: "left",
              }}
            >
              <span style={{ fontSize: 13, fontWeight: active ? 700 : 600, color: active ? "var(--navy-deep)" : "var(--ink)" }}>
                {w}
              </span>
              <div
                style={{
                  width: 16, height: 16, borderRadius: "50%",
                  border: active ? "none" : "2px solid var(--line)",
                  background: active ? "var(--navy-deep)" : "transparent",
                  boxShadow: active ? "inset 0 0 0 3px white" : "none",
                  flexShrink: 0,
                }}
              />
            </button>
          );
        })}
      </div>

      <CTA onClick={() => onConfirm(`${days.find((d) => d.key === pickedDay)?.label}, ${pickedTime}`)}>
        Confirm {days.find((d) => d.key === pickedDay)?.label}, {pickedTime} →
      </CTA>
    </div>
  );
}

// ── ChatCanvas ─────────────────────────────────────────────────────────────

type CanvasProps = { canvas: { type: string; data: Record<string, unknown> }; onSend: (msg?: string) => void };

function ChatCanvas({ canvas, onSend }: CanvasProps) {
  const navigate = useNavigate();

  // ── price-calculator ────────────────────────────────────────────────────
  if (canvas.type === "price-calculator") {
    const services = (canvas.data.services as Array<{ name: string; price: string }>) ?? [];
    const total = services.reduce((a, s) => a + (parseInt(String(s.price).replace(/\D/g, ""), 10) || 0), 0);
    return (
      <div style={{ marginTop: 2 }}>
        <div style={divider} />
        {services.map((s, i) => (
          <div
            key={s.name}
            style={{
              display: "flex", justifyContent: "space-between", alignItems: "baseline",
              padding: "9px 0",
              borderBottom: i < services.length - 1 ? "1px solid var(--line)" : "none",
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{s.name}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>{s.price}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "10px 0 0", borderTop: "1px solid var(--line)", marginTop: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", color: "var(--ink-soft)" }}>Total</span>
          <span style={{ fontSize: 26, fontWeight: 900, color: "var(--emerald-deep)", letterSpacing: "-.02em" }}>£{total}</span>
        </div>
        <CTA onClick={() => navigate({ to: "/book" as "/" })}>Book at this price →</CTA>
      </div>
    );
  }

  // ── appliance-counter ───────────────────────────────────────────────────
  if (canvas.type === "appliance-counter") {
    return (
      <ApplianceCounter
        basePrice={(canvas.data.basePrice as number) ?? 40}
        perItem={(canvas.data.perItem as number) ?? 10}
        onConfirm={(count, price) => onSend(`Book Gas Safety, ${count} appliance${count === 1 ? "" : "s"}, total £${price}`)}
      />
    );
  }

  // ── booking-slots ───────────────────────────────────────────────────────
  if (canvas.type === "booking-slots") {
    const service = (canvas.data.service as string) ?? "";
    const code =
      service.toLowerCase().includes("gas") ? "CP12"
      : service.toLowerCase().includes("eicr") || service.toLowerCase().includes("electric") ? "EICR"
      : service.toLowerCase().includes("epc") ? "EPC"
      : service.toLowerCase().includes("pat") ? "PAT"
      : "";
    return (
      <BookingSlots
        service={service}
        onConfirm={(slot) => navigate({ to: (code ? `/book?s=${code}` : "/book") as "/" })}
      />
    );
  }

  // ── coverage-result ─────────────────────────────────────────────────────
  if (canvas.type === "coverage-result") {
    return <CoverageCanvas data={canvas.data} onSend={onSend} />;
  }

  // ── certificate-preview ─────────────────────────────────────────────────
  if (canvas.type === "certificate-preview") {
    const c = canvas.data as { type: string; address: string; engineer: string; gasSafeNo: string; issued: string; expires: string; status: string };
    const pass = c.status?.toLowerCase().includes("pass");
    return (
      <div style={{ marginTop: 2 }}>
        <div style={divider} />
        {/* Address + status */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, padding: "6px 0 10px" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>{c.address}</div>
            <div style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 2 }}>{c.type}</div>
          </div>
          <span
            style={{
              fontSize: 10, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase",
              padding: "3px 9px", borderRadius: 99, marginTop: 2, flexShrink: 0,
              background: pass ? "oklch(0.93 0.05 130)" : "oklch(0.96 0.04 27)",
              color: pass ? "var(--emerald-deep)" : "oklch(0.46 0.20 28)",
            }}
          >
            {pass ? "✓ Pass" : "✗ Fail"}
          </span>
        </div>
        {/* Field grid */}
        <div style={{ borderTop: "1px solid var(--line)", paddingTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 16px", paddingBottom: 10 }}>
          <FieldRow label="Engineer" value={c.engineer} />
          <FieldRow label="Gas Safe №" value={c.gasSafeNo} mono />
          <FieldRow label="Issued" value={c.issued} />
          <FieldRow label="Expires" value={c.expires} warn />
        </div>
        <CTA ghost>↓ Download PDF</CTA>
      </div>
    );
  }

  // ── renewal-timeline ────────────────────────────────────────────────────
  if (canvas.type === "renewal-timeline") {
    const { cert, lastDone, dueDate, validity } = canvas.data as { cert: string; lastDone: string; dueDate: string; validity: string };
    const issued = new Date(lastDone);
    const due = new Date(dueDate);
    const today = new Date();
    const totalMs = due.getTime() - issued.getTime();
    const elapsedMs = today.getTime() - issued.getTime();
    const pct = Math.min(100, Math.max(0, (elapsedMs / totalMs) * 100));
    const daysLeft = Math.round((due.getTime() - today.getTime()) / 86400000);
    const overdue = daysLeft < 0;
    const urgent = !overdue && daysLeft <= 30;
    const accent = overdue ? "oklch(0.46 0.20 28)" : urgent ? "oklch(0.52 0.17 27)" : "var(--emerald-deep)";
    const code = cert.includes("Gas") ? "CP12" : cert.includes("EPC") ? "EPC" : cert.includes("PAT") ? "PAT" : "EICR";

    return (
      <div style={{ marginTop: 2 }}>
        <div style={divider} />
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "6px 0 12px" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{cert} · {validity}</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: accent }}>
            {overdue ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days left`}
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ position: "relative", height: 5, background: "var(--line)", borderRadius: 99, marginBottom: 8 }}>
          <div style={{ position: "absolute", left: 0, top: 0, height: 5, width: `${pct}%`, background: `linear-gradient(to right, var(--emerald-deep), ${accent})`, borderRadius: 99 }} />
          {pct > 2 && pct < 100 && (
            <div style={{ position: "absolute", top: "50%", left: `${pct}%`, transform: "translate(-50%,-50%)", width: 11, height: 11, background: accent, border: "2px solid white", borderRadius: "50%", boxShadow: "0 1px 4px rgba(0,0,0,.18)" }} />
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: "var(--ink-soft)" }}>Issued {lastDone}</div>
          <div style={{ fontSize: 11, color: accent, fontWeight: 600 }}>Due {dueDate}</div>
        </div>
        <CTA color={accent} onClick={() => navigate({ to: `/book?s=${code}` as "/" })}>
          Book renewal →
        </CTA>
      </div>
    );
  }

  // ── eicr-codes ──────────────────────────────────────────────────────────
  if (canvas.type === "eicr-codes") {
    const code = ((canvas.data.code as string) ?? "C2").toUpperCase();
    const map: Record<string, { color: string; bg: string; border: string; label: string; desc: string }> = {
      C1: { color: "oklch(0.46 0.20 28)", bg: "oklch(0.96 0.06 28)", border: "oklch(0.87 0.14 28)", label: "Danger present", desc: "Immediate risk to people. Engineer makes safe on the spot." },
      C2: { color: "oklch(0.52 0.17 27)", bg: "oklch(0.96 0.05 27)", border: "oklch(0.87 0.11 27)", label: "Potentially dangerous", desc: "Urgent remedial work required. Certificate is unsatisfactory until fixed." },
      C3: { color: "var(--emerald-deep)", bg: "oklch(0.96 0.04 130)", border: "oklch(0.88 0.10 130)", label: "Improvement recommended", desc: "Not a fail. The installation is safe; improvement is optional." },
      FI: { color: "var(--navy)", bg: "var(--navy-faint)", border: "oklch(0.88 0.02 255)", label: "Further investigation", desc: "Engineer needs more access or testing before a decision can be made." },
    };
    const c = map[code] ?? map.C2;
    const allCodes = ["C1", "C2", "C3", "FI"];

    return (
      <div style={{ marginTop: 2 }}>
        <div style={divider} />
        {/* Code hero */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0 12px" }}>
          <div
            style={{
              width: 48, height: 48, background: c.bg, borderRadius: 12,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, border: `1.5px solid ${c.border}`,
            }}
          >
            <span style={{ fontSize: 20, fontWeight: 900, color: c.color, fontFamily: "ui-monospace, 'JetBrains Mono', monospace" }}>{code}</span>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "var(--ink)" }}>{c.label}</div>
            <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 3, lineHeight: 1.5 }}>{c.desc}</div>
          </div>
        </div>
        {/* Severity scale */}
        <div style={{ borderTop: "1px solid var(--line)", paddingTop: 10, paddingBottom: 4 }}>
          <div style={{ display: "flex", gap: 3 }}>
            {allCodes.map((k) => {
              const m = map[k];
              const active = k === code;
              return (
                <div key={k} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ height: 4, background: active ? m.color : "var(--line)", borderRadius: 4, marginBottom: 5 }} />
                  <div style={{ fontSize: 10, fontWeight: 800, color: active ? m.color : "var(--ink-soft)", fontFamily: "ui-monospace, monospace" }}>{k}</div>
                  <div style={{ fontSize: 9, color: "var(--ink-soft)", lineHeight: 1.3, marginTop: 1 }}>
                    {k === "C1" ? "Danger" : k === "C2" ? "Urgent" : k === "C3" ? "Advisory" : "Investigate"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {code !== "C3" && (
          <CTA color={c.color} onClick={() => onSend("Get a remedial quote")}>Get remedial quote →</CTA>
        )}
      </div>
    );
  }

  // ── portfolio-table ─────────────────────────────────────────────────────
  if (canvas.type === "portfolio-table") {
    const props = (canvas.data.properties as Array<{ address: string; cert: string; status: string; expires: string }>) ?? [];
    const actionCount = props.filter((p) => p.status === "due" || p.status === "expired").length;

    return (
      <div style={{ marginTop: 2 }}>
        <div style={divider} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          {props.map((p, i) => (
            <div
              key={i}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 0",
                borderBottom: i < props.length - 1 ? "1px solid var(--line)" : "none",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {p.address}
                </div>
                <div style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 1 }}>
                  {p.cert} · {p.expires}
                </div>
              </div>
              <Chip status={p.status as "valid" | "due" | "expired"} />
            </div>
          ))}
        </div>
        {actionCount > 0 && (
          <CTA onClick={() => onSend(`Book all ${actionCount} due certificates`)}>
            Book all {actionCount} due →
          </CTA>
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
