import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Flame, Zap, Leaf, Plug, Wrench, ChevronLeft, Check, ArrowRight, Phone } from "lucide-react";
import lcLogo from "@/assets/lc-logo.png";

// Maps homepage service codes to booking IDs
const CODE_TO_ID: Record<string, string> = {
  CP12: "cp12", EICR: "eicr", EPC: "epc", PAT: "pat", BSV: "boiler",
};

export const Route = createFileRoute("/book")({
  validateSearch: (search: Record<string, unknown>) => ({
    s: typeof search.s === "string" ? search.s : "",
  }),
  head: () => ({
    meta: [
      { title: "Book a Certificate · Landlord Certificates Ltd" },
      { name: "description", content: "Book your Gas Safety, EICR, EPC or PAT certificate online. Fixed prices, London-wide coverage, confirmed within 15 minutes." },
    ],
  }),
  component: BookPage,
});

// ── Data ─────────────────────────────────────────────────────────────────────

const SERVICES = [
  { id: "cp12",   code: "CP12", name: "Gas Safety (CP12)",        price: 40,  desc: "Annual landlord gas safety record",          icon: Flame,   skills: ["cp12"] },
  { id: "eicr",   code: "EICR", name: "Electrical Report (EICR)", price: 70,  desc: "Fixed wiring inspection · valid 5 yrs",      icon: Zap,     skills: ["eicr"] },
  { id: "epc",    code: "EPC",  name: "Energy Performance (EPC)", price: 65,  desc: "EPC rating · valid 10 yrs",                  icon: Leaf,    skills: ["epc"] },
  { id: "pat",    code: "PAT",  name: "PAT Testing",              price: 55,  desc: "Portable appliance testing",                 icon: Plug,    skills: ["pat"] },
  { id: "boiler", code: "BSV",  name: "Boiler Service",           price: 75,  desc: "Manufacturer-standard annual service",       icon: Wrench,  skills: ["boiler"] },
] as const;

type ServiceId = (typeof SERVICES)[number]["id"];

const ENGINEERS = [
  { id: "marcus",  name: "Marcus Bennett",   init: "MB", color: "#1f54e0", trade: "Gas Safe Registered",    skills: ["cp12", "boiler"] },
  { id: "aisha",   name: "Aisha Rahman",     init: "AR", color: "#13a89e", trade: "Electrical · DEA",       skills: ["eicr", "pat", "epc"] },
  { id: "dariusz", name: "Dariusz Kowalski", init: "DK", color: "#7a5cf0", trade: "Gas + Electrical",       skills: ["cp12", "boiler", "eicr", "pat"] },
];

const TIME_WINDOWS = ["08:00 – 10:00", "10:00 – 12:00", "13:00 – 15:00", "15:00 – 17:00"];

// Days with some slots taken so it looks realistic
const TAKEN: Record<number, number[]> = { 1: [0, 2], 2: [1], 4: [0, 1, 3], 5: [2], 8: [0, 1, 2, 3], 9: [3], 11: [1, 2], 12: [0, 3] };

function buildDays() {
  const DOWS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const base = new Date();
  base.setDate(base.getDate() + 1); // start tomorrow
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const wd = d.getDay();
    const weekend = wd === 0 || wd === 6;
    const slots = TIME_WINDOWS.map((label, idx) => ({ label, taken: (TAKEN[i] ?? []).includes(idx) }));
    const avail = slots.filter((s) => !s.taken).length;
    const full = weekend || avail === 0;
    return { key: `d${i}`, dow: DOWS[wd], day: d.getDate(), month: MONTHS[d.getMonth()], full, avail, slots };
  });
}

function allocateEngineers(selected: ServiceId[]) {
  if (selected.length === 0) return [];
  const single = ENGINEERS.find((e) => selected.every((s) => e.skills.includes(s)));
  if (single) return [{ engineer: single, services: selected.slice() as string[] }];
  const rem: string[] = [...selected];
  const visits: { engineer: (typeof ENGINEERS)[number]; services: string[] }[] = [];
  while (rem.length) {
    let best = ENGINEERS[0];
    let cov: string[] = [];
    for (const e of ENGINEERS) {
      const c = rem.filter((s) => e.skills.includes(s));
      if (c.length > cov.length) { best = e; cov = c; }
    }
    if (cov.length === 0) { cov = [rem[0]]; best = ENGINEERS[0]; }
    visits.push({ engineer: best, services: cov });
    cov.forEach((s) => { const i = rem.indexOf(s); if (i >= 0) rem.splice(i, 1); });
  }
  return visits;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function BookPage() {
  const { s } = Route.useSearch();
  const preSelected = useMemo<ServiceId[]>(() => {
    if (!s) return [];
    const validIds = new Set(SERVICES.map((sv) => sv.id));
    return s.split(",")
      .map((code) => CODE_TO_ID[code.trim().toUpperCase()] ?? code.trim().toLowerCase())
      .filter((id): id is ServiceId => validIds.has(id as ServiceId));
  }, [s]);

  const [step, setStep] = useState<1 | 2 | 3>(() => preSelected.length > 0 ? 2 : 1);
  const [selected, setSelected] = useState<ServiceId[]>(() => preSelected);
  const [selDay, setSelDay] = useState<string | null>(null);
  const [slotByGroup, setSlotByGroup] = useState<Record<string, string>>({});

  const days = useMemo(() => buildDays(), []);
  const svcById = Object.fromEntries(SERVICES.map((s) => [s.id, s]));
  const total = selected.reduce((sum, id) => sum + svcById[id].price, 0);
  const visits = useMemo(() => allocateEngineers(selected), [selected]);
  const groups = useMemo(() => {
    if (visits.length === 0) return [];
    const single = ENGINEERS.find((e) => selected.every((s) => e.skills.includes(s)));
    if (single) return [{ id: "all", engineer: single, services: selected.slice() }];
    return visits.map((v, i) => ({ id: `g${i}`, engineer: v.engineer, services: v.services }));
  }, [visits, selected]);
  const curDay = days.find((d) => d.key === selDay) ?? null;
  const canProceedStep1 = selected.length > 0;
  const canProceedStep2 = !!selDay && groups.every((g) => slotByGroup[g.id]);

  function toggleService(id: string) {
    const sid = id as ServiceId;
    setSelected((prev) => prev.includes(sid) ? prev.filter((s) => s !== sid) : [...prev, sid]);
    setSlotByGroup({});
  }

  function pickDay(key: string) {
    setSelDay(key);
    setSlotByGroup({});
  }

  function pickSlot(gid: string, label: string) {
    setSlotByGroup((prev) => ({ ...prev, [gid]: label }));
  }

  function goNext() {
    if (step === 1 && !canProceedStep1) return;
    if (step === 2 && !canProceedStep2) return;
    setStep((s) => Math.min(3, s + 1) as 1 | 2 | 3);
  }

  function goPrev() {
    setStep((s) => Math.max(1, s - 1) as 1 | 2 | 3);
  }

  function reset() {
    setStep(1); setSelected([]); setSelDay(null); setSlotByGroup({}); window.history.replaceState({}, "", "/book");
  }

  const bookingRef = "LC-2026-04812";

  // Plan description
  let planIcon = "○", planTitle = "Select services to see the scheduling plan", planSub = "We'll assign the right engineer automatically.", planColor = "var(--ink-soft)";
  if (selected.length > 0) {
    const singleEng = ENGINEERS.find((e) => selected.every((s) => e.skills.includes(s)));
    if (singleEng) {
      planIcon = "✓"; planTitle = `${singleEng.name} covers all ${selected.length} service${selected.length > 1 ? "s" : ""}`;
      planSub = "One engineer, one combined visit. Pick a single time window."; planColor = "#18a957";
    } else {
      planIcon = "⇆"; planTitle = `${visits.length} specialists required`;
      planSub = "Different engineers handle different jobs. Each needs its own time slot."; planColor = "#2f6bff";
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Nav */}
      <header style={{ background: "white", borderBottom: "1px solid var(--line)", position: "sticky", top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <img src={lcLogo} alt="Landlord Certificates" style={{ height: 56, width: "auto" }} />
          </Link>
          <a href="tel:02037725959" style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--ink-soft)", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
            <Phone size={14} />
            0203 772 5959
          </a>
        </div>
      </header>

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px 80px" }}>
        {/* Title */}
        <div style={{ marginBottom: 28 }}>
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--ink-soft)", fontSize: 13, fontWeight: 500, textDecoration: "none", marginBottom: 12 }}>
            <ChevronLeft size={14} /> Back to home
          </Link>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--navy-deep)", margin: 0 }}>Smart Booking</h1>
          <p style={{ color: "var(--ink-soft)", fontSize: 14, marginTop: 4 }}>Book a compliance visit in under 60 seconds. Fixed prices, no hidden fees.</p>
        </div>

        {/* Step indicator */}
        <div style={{ background: "white", border: "1px solid var(--line)", borderRadius: 14, padding: "16px 24px", marginBottom: 28, display: "flex", alignItems: "center", gap: 0 }}>
          {[{ n: 1, label: "Select services" }, { n: 2, label: "Choose a slot" }, { n: 3, label: "Confirmed" }].map((s, idx) => {
            const active = step === s.n;
            const done = step > s.n;
            return (
              <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 10, flex: idx < 2 ? "0 1 auto" : "none" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: done ? "#18a957" : active ? "var(--navy)" : "white", border: `2px solid ${done ? "#18a957" : active ? "var(--navy)" : "var(--line)"}`, color: (done || active) ? "white" : "var(--ink-soft)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                  {done ? <Check size={14} /> : s.n}
                </div>
                <span style={{ fontWeight: active ? 700 : 500, fontSize: 13.5, color: (done || active) ? "var(--navy-deep)" : "var(--ink-soft)", whiteSpace: "nowrap" }}>{s.label}</span>
                {idx < 2 && <div style={{ flex: 1, height: 2, borderRadius: 2, background: done ? "#18a957" : "var(--line)", margin: "0 12px", minWidth: 32 }} />}
              </div>
            );
          })}
        </div>

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--navy-deep)", margin: 0 }}>Select services</h2>
              <span style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>Select one or more</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {SERVICES.map((svc) => {
                const sel = selected.includes(svc.id as ServiceId);
                const Icon = svc.icon;
                return (
                  <button key={svc.id} onClick={() => toggleService(svc.id as ServiceId)}
                    style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 20px", borderRadius: 14, border: `2px solid ${sel ? "var(--navy)" : "var(--line)"}`, background: sel ? "var(--navy-faint)" : "white", cursor: "pointer", textAlign: "left", transition: "border-color 0.15s, background 0.15s", width: "100%" }}>
                    <div style={{ width: 46, height: 46, borderRadius: 12, background: sel ? "var(--navy)" : "#f0f4fa", color: sel ? "white" : "var(--ink-soft)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={20} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 14.5, color: "var(--navy-deep)" }}>{svc.name}</div>
                      <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 2 }}>{svc.desc}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 10, color: "var(--ink-soft)" }}>from</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: "var(--navy-deep)", fontVariantNumeric: "tabular-nums" }}>£{svc.price}</div>
                    </div>
                    <div style={{ width: 22, height: 22, borderRadius: 7, border: `2px solid ${sel ? "var(--navy)" : "var(--line)"}`, background: sel ? "var(--navy)" : "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {sel && <Check size={12} color="white" strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 24 }}>
              <div style={{ fontSize: 13.5, color: "var(--ink-soft)" }}>
                {selected.length} service{selected.length !== 1 ? "s" : ""} selected
                {selected.length > 0 && <span style={{ color: "var(--navy-deep)", fontWeight: 700 }}>, £{total}</span>}
              </div>
              <button onClick={goNext} disabled={!canProceedStep1}
                style={{ height: 46, padding: "0 26px", borderRadius: 11, background: canProceedStep1 ? "var(--navy)" : "#c4d0ea", color: "white", fontWeight: 700, fontSize: 14, border: "none", cursor: canProceedStep1 ? "pointer" : "not-allowed", display: "flex", alignItems: "center", gap: 6 }}>
                Continue <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 22, alignItems: "start" }}>
            {/* Left: summary */}
            <div style={{ background: "white", border: "1px solid var(--line)", borderRadius: 14, padding: 20, position: "sticky", top: 88 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "var(--navy-deep)", marginBottom: 16 }}>Your booking</div>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: "var(--ink-soft)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 8 }}>Services</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {selected.map((id) => {
                  const svc = svcById[id];
                  return (
                    <div key={id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, background: "var(--navy-faint)", border: "1px solid var(--line)", borderRadius: 9, padding: "9px 11px" }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--navy-deep)" }}>{svc.name}</span>
                      <span style={{ fontSize: 12, color: "var(--ink-soft)", flexShrink: 0 }}>£{svc.price}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 11, paddingTop: 11, borderTop: "1px dashed var(--line)" }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--navy-deep)" }}>Total</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: "var(--navy)", fontVariantNumeric: "tabular-nums" }}>£{total}</span>
              </div>

              {/* Scheduling plan */}
              <div style={{ marginTop: 16, padding: "12px 14px", borderRadius: 12, background: "var(--cream)", border: "1px solid var(--line)" }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{planIcon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: planColor }}>{planTitle}</div>
                <div style={{ fontSize: 11.5, color: "var(--ink-soft)", marginTop: 3 }}>{planSub}</div>
              </div>
            </div>

            {/* Right: calendar + slots */}
            <div style={{ background: "white", border: "1px solid var(--line)", borderRadius: 14, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "var(--navy-deep)" }}>Available slots, next 2 weeks</div>
                <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>Select a date</div>
              </div>

              {/* Day grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 7 }}>
                {days.map((d) => {
                  const sel = d.key === selDay;
                  return (
                    <button key={d.key} onClick={() => !d.full && pickDay(d.key)} disabled={d.full}
                      style={{ borderRadius: 10, border: `2px solid ${sel ? "var(--navy)" : "var(--line)"}`, background: sel ? "var(--navy-faint)" : d.full ? "#f7f8fb" : "white", padding: "8px 4px", textAlign: "center", cursor: d.full ? "not-allowed" : "pointer", opacity: d.full ? 0.5 : 1, transition: "all 0.12s" }}>
                      <div style={{ fontSize: 9.5, color: "var(--ink-soft)", fontWeight: 600, textTransform: "uppercase" }}>{d.dow}</div>
                      <div style={{ fontSize: 17, fontWeight: 800, color: sel ? "var(--navy)" : d.full ? "#aab4c8" : "var(--navy-deep)", lineHeight: 1.3, fontVariantNumeric: "tabular-nums" }}>{d.day}</div>
                      <div style={{ fontSize: 9, fontWeight: 700, color: d.full ? "#b0b9cc" : sel ? "var(--navy)" : "#18a957" }}>{d.full ? "Full" : `${d.avail} slots`}</div>
                    </button>
                  );
                })}
              </div>

              {/* Time slots */}
              {curDay && (
                <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 14 }}>
                  {groups.map((g) => {
                    const picked = slotByGroup[g.id];
                    return (
                      <div key={g.id} style={{ border: "1px solid var(--line)", borderRadius: 13, padding: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 11, flexWrap: "wrap", gap: 8 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 30, height: 30, borderRadius: 8, background: g.engineer.color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
                              {g.engineer.init}
                            </div>
                            <div>
                              <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--navy-deep)" }}>{g.engineer.name}</div>
                              <div style={{ fontSize: 10.5, color: "var(--ink-soft)" }}>{g.engineer.trade}</div>
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                            {g.services.map((id) => (
                              <span key={id} style={{ fontSize: 10.5, fontWeight: 700, color: "var(--ink-soft)", background: "#eef2f9", padding: "3px 8px", borderRadius: 6, fontVariantNumeric: "tabular-nums" }}>
                                {svcById[id as ServiceId]?.code ?? id}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                          {curDay.slots.map((sl) => {
                            const isSel = sl.label === picked;
                            return (
                              <button key={sl.label} onClick={() => !sl.taken && pickSlot(g.id, sl.label)} disabled={sl.taken}
                                style={{ height: 42, borderRadius: 10, border: `2px solid ${isSel ? "var(--navy)" : "var(--line)"}`, background: isSel ? "var(--navy-faint)" : sl.taken ? "#f7f8fb" : "white", color: sl.taken ? "#b0b9cc" : isSel ? "var(--navy)" : "var(--navy-deep)", fontWeight: 600, fontSize: 12.5, cursor: sl.taken ? "not-allowed" : "pointer", textDecoration: sl.taken ? "line-through" : "none", fontVariantNumeric: "tabular-nums" }}>
                                {sl.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 22 }}>
                <button onClick={goPrev} style={{ height: 44, padding: "0 20px", borderRadius: 11, border: "1px solid var(--line)", color: "var(--ink-soft)", fontWeight: 700, fontSize: 14, background: "white", cursor: "pointer" }}>
                  ← Back
                </button>
                <button onClick={goNext} disabled={!canProceedStep2}
                  style={{ height: 44, padding: "0 26px", borderRadius: 11, background: canProceedStep2 ? "var(--navy)" : "#c4d0ea", color: "white", fontWeight: 700, fontSize: 14, border: "none", cursor: canProceedStep2 ? "pointer" : "not-allowed", display: "flex", alignItems: "center", gap: 6 }}>
                  Confirm booking <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3 ── */}
        {step === 3 && (
          <div style={{ background: "white", border: "1px solid var(--line)", borderRadius: 18, padding: 40, textAlign: "center", maxWidth: 560, margin: "0 auto", boxShadow: "var(--shadow-md)" }}>
            <div style={{ width: 66, height: 66, borderRadius: "50%", background: "#e7f6ee", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
              <Check size={32} color="#18a957" strokeWidth={2.5} />
            </div>
            <h2 style={{ fontSize: 23, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--navy-deep)", margin: "0 0 6px" }}>Booking confirmed</h2>
            <p style={{ color: "var(--ink-soft)", fontSize: 14, margin: "0 0 12px" }}>A confirmation has been sent to you and your tenant.</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 12.5, color: "var(--ink-soft)", flexWrap: "wrap", marginBottom: 24 }}>
              Booking ref <span style={{ fontWeight: 700, color: "var(--navy)", fontVariantNumeric: "tabular-nums" }}>{bookingRef}</span>
            </div>

            {/* Visit cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 22, textAlign: "left" }}>
              {visits.map((v, i) => {
                const gid = groups.length === 1 ? "all" : `g${i}`;
                const window = slotByGroup[gid] ?? "TBC";
                const dayLabel = curDay ? `${curDay.dow} ${curDay.day} ${curDay.month} 2026` : "TBC";
                return (
                  <div key={i} style={{ background: "var(--navy-faint)", border: "1px solid var(--line)", borderRadius: 14, padding: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 9, background: v.engineer.color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                          {v.engineer.init}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13.5, color: "var(--navy-deep)" }}>{v.engineer.name}</div>
                          <div style={{ fontSize: 11, color: "var(--ink-soft)" }}>{v.engineer.trade}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--navy-deep)", fontVariantNumeric: "tabular-nums" }}>{window}</div>
                        <div style={{ fontSize: 11, color: "var(--ink-soft)" }}>{dayLabel}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 11, paddingTop: 11, borderTop: "1px dashed var(--line)" }}>
                      {v.services.map((id) => {
                        const svc = svcById[id as ServiceId];
                        return (
                          <div key={id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 12.5, color: "var(--navy-deep)" }}>{svc?.name ?? id}</span>
                            <span style={{ fontSize: 12, color: "var(--ink-soft)", fontVariantNumeric: "tabular-nums" }}>£{svc?.price ?? 0}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--navy-deep)", color: "white", borderRadius: 12, padding: "14px 18px", marginBottom: 22 }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>Total</span>
              <span style={{ fontSize: 18, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>£{total}</span>
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <a href={`data:text/calendar;charset=utf-8,`}
                style={{ height: 46, padding: "0 22px", borderRadius: 11, background: "var(--navy)", color: "white", fontWeight: 700, fontSize: 14, display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
                + Add to Calendar
              </a>
              <button onClick={reset}
                style={{ height: 46, padding: "0 22px", borderRadius: 11, border: "1px solid var(--line)", color: "var(--ink-soft)", fontWeight: 700, fontSize: 14, background: "white", cursor: "pointer" }}>
                Book another
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
