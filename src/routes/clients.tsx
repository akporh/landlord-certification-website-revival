import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Building2,
  Users,
  FileText,
  CreditCard,
  Clock,
  HeartHandshake,
  ArrowRight,
  Phone,
  Mail,
  CheckCircle2,
} from "lucide-react";
import lcLogo from "@/assets/lc-logo.png";

export const Route = createFileRoute("/clients")({
  head: () => ({
    meta: [
      { title: "For Letting Agents & Property Managers · Landlord Certificates" },
      {
        name: "description",
        content:
          "A dedicated compliance partner for London letting agents, property managers and developers. Account manager, portfolio dashboard, monthly invoicing.",
      },
    ],
  }),
  component: ClientsPage,
});

const VALUE_PROPS = [
  {
    icon: Users,
    title: "Dedicated account manager",
    body: "One point of contact who knows your portfolio, your tenants and your renewal dates. No call centre, no script.",
  },
  {
    icon: FileText,
    title: "Portfolio dashboard",
    body: "Every certificate for every property in one place. Filter by branch, status or expiry. Export to CSV for landlord packs.",
  },
  {
    icon: Clock,
    title: "Renewal reminders, automated",
    body: "We track every CP12, EICR and EPC across your stock and book the renewal before it lapses. You stay compliant by default.",
  },
  {
    icon: CreditCard,
    title: "Monthly invoicing",
    body: "Consolidated billing on 30-day terms. No card-on-file for every booking. Approved by your finance team in one upload.",
  },
  {
    icon: Building2,
    title: "Multi-branch friendly",
    body: "Branch-level permissions, branded landlord reports and tenant-facing access codes. Built for agencies of 10 to 10,000 units.",
  },
  {
    icon: HeartHandshake,
    title: "Volume pricing",
    body: "Transparent tiered rates based on monthly volume. The more you book, the less every certificate costs. No retainer required.",
  },
];

function ClientsPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div
      style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "var(--cream)", color: "var(--ink)" }}
      className="min-h-screen"
    >
      {/* NAV */}
      <header className="sticky top-0 z-40 border-b" style={{ background: "rgba(253,252,248,0.85)", backdropFilter: "blur(12px)", borderColor: "var(--line)" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img src={lcLogo} alt="Landlord Certificates" className="h-9 w-auto" />
          </Link>
          <nav className="hidden gap-7 text-sm md:flex" style={{ color: "var(--ink-soft)" }}>
            <Link to="/" className="hover:text-[var(--navy)]">Home</Link>
            <Link to="/" hash="services" className="hover:text-[var(--navy)]">Certificates</Link>
            <Link to="/" hash="coverage" className="hover:text-[var(--navy)]">Coverage</Link>
            <a href="#contact" className="font-semibold" style={{ color: "var(--navy)" }}>Open an account</a>
          </nav>
          <a
            href="tel:02037725959"
            className="hidden md:inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
            style={{ background: "var(--navy)", color: "white" }}
          >
            <Phone className="h-4 w-4" /> 0203 772 5959
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: "var(--navy-deep)" }}>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-40 -right-20 h-[500px] w-[500px] rounded-full" style={{ background: "radial-gradient(circle, var(--emerald) 0%, transparent 70%)", filter: "blur(80px)" }} />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ background: "rgba(255,255,255,0.06)", color: "var(--emerald)", border: "1px solid rgba(255,255,255,0.08)" }}>
              For Letting Agents & Property Managers
            </span>
            <h1 className="mt-6 text-[44px] md:text-[60px] font-bold leading-[1.02] tracking-tight text-white" style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>
              Compliance, handled.<br />
              <span style={{ color: "var(--emerald)" }}>So you can focus on lettings.</span>
            </h1>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
              We work with hundreds of London letting agencies and property managers. One account manager, one dashboard, one monthly invoice covering every certificate across your entire portfolio.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
                style={{ background: "var(--emerald)", color: "var(--navy-deep)" }}
              >
                Open an account <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="tel:02037725959"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                <Phone className="h-4 w-4" /> Talk to the agency team
              </a>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-[13px]" style={{ color: "rgba(255,255,255,0.5)" }}>
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" style={{ color: "var(--emerald)" }} /> 30-day invoice terms</span>
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" style={{ color: "var(--emerald)" }} /> Volume pricing from 20 units</span>
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" style={{ color: "var(--emerald)" }} /> All 32 boroughs</span>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="border-b" style={{ borderColor: "var(--line)", background: "white" }}>
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--navy)" }}>Why agencies switch to us</div>
            <h2 className="mt-2 text-[36px] font-bold tracking-tight leading-tight">Built for portfolios, not one-off bookings.</h2>
            <p className="mt-4 text-[16px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
              Everything you need to run a compliant portfolio without the admin overhead.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {VALUE_PROPS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border p-7" style={{ borderColor: "var(--line)", background: "var(--cream)" }}>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "color-mix(in oklab, var(--emerald) 14%, white)" }}>
                  <Icon className="h-5 w-5" style={{ color: "var(--emerald-deep)" }} />
                </div>
                <div className="mt-5 text-[16px] font-bold" style={{ color: "var(--navy-deep)" }}>{title}</div>
                <p className="mt-2 text-[14px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF STRIP */}
      <section className="border-b" style={{ borderColor: "var(--line)", background: "var(--cream)" }}>
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-10 md:grid-cols-3 text-center">
            <div>
              <div className="text-[44px] font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "var(--navy-deep)" }}>180+</div>
              <div className="mt-2 text-[12px] font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--ink-soft)" }}>London agencies onboarded</div>
            </div>
            <div>
              <div className="text-[44px] font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "var(--navy-deep)" }}>12,000+</div>
              <div className="mt-2 text-[12px] font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--ink-soft)" }}>Certificates issued each year</div>
            </div>
            <div>
              <div className="text-[44px] font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "var(--navy-deep)" }}>4.9★</div>
              <div className="mt-2 text-[12px] font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--ink-soft)" }}>Trustpilot rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section id="contact" className="border-b" style={{ borderColor: "var(--line)", background: "white" }}>
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] items-start">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--navy)" }}>Open an account</div>
              <h2 className="mt-2 text-[36px] font-bold tracking-tight leading-tight">Let's get your portfolio set up.</h2>
              <p className="mt-4 text-[15px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                Tell us about your agency. We'll come back within one working hour with pricing and an onboarding date.
              </p>
              <div className="mt-10 space-y-5">
                <a href="tel:02037725959" className="flex items-center gap-4 group">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "color-mix(in oklab, var(--navy) 8%, white)" }}>
                    <Phone className="h-5 w-5" style={{ color: "var(--navy)" }} />
                  </div>
                  <div>
                    <div className="text-[12px] font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--ink-soft)" }}>Agency team</div>
                    <div className="text-[16px] font-bold" style={{ color: "var(--navy-deep)" }}>0203 772 5959</div>
                  </div>
                </a>
                <a href="mailto:agents@landlord-certificates.co.uk" className="flex items-center gap-4 group">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "color-mix(in oklab, var(--navy) 8%, white)" }}>
                    <Mail className="h-5 w-5" style={{ color: "var(--navy)" }} />
                  </div>
                  <div>
                    <div className="text-[12px] font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--ink-soft)" }}>Email</div>
                    <div className="text-[16px] font-bold" style={{ color: "var(--navy-deep)" }}>agents@landlord-certificates.co.uk</div>
                  </div>
                </a>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="rounded-3xl border p-8 md:p-10"
              style={{ borderColor: "var(--line)", background: "var(--cream)", boxShadow: "var(--shadow-sm)" }}
            >
              {submitted ? (
                <div className="flex flex-col items-center text-center py-10">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "color-mix(in oklab, var(--emerald) 18%, white)" }}>
                    <CheckCircle2 className="h-7 w-7" style={{ color: "var(--emerald-deep)" }} />
                  </div>
                  <div className="mt-5 text-[22px] font-bold" style={{ color: "var(--navy-deep)" }}>Thanks, we've got it.</div>
                  <p className="mt-2 text-[14px] max-w-sm" style={{ color: "var(--ink-soft)" }}>
                    A member of our agency team will be in touch within one working hour with pricing and next steps.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Your name" placeholder="Jane Smith" />
                    <Field label="Agency name" placeholder="Smith & Co Lettings" />
                    <Field label="Work email" type="email" placeholder="jane@smithco.co.uk" />
                    <Field label="Phone" type="tel" placeholder="07700 900000" />
                    <Field label="Number of managed units" type="number" placeholder="e.g. 120" />
                    <Field label="Primary London area" placeholder="e.g. East London" />
                  </div>
                  <div className="mt-5">
                    <label className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--ink-soft)" }}>What do you need most?</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. CP12 + EICR across 80 units, monthly billing, dashboard access for 4 branch managers."
                      className="mt-2 w-full rounded-xl border px-4 py-3 text-[14px] outline-none focus:ring-2"
                      style={{ borderColor: "var(--line)", background: "white" }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold"
                    style={{ background: "var(--navy)", color: "white" }}
                  >
                    Request agency pricing <ArrowRight className="h-4 w-4" />
                  </button>
                  <p className="mt-3 text-center text-[12px]" style={{ color: "var(--ink-soft)" }}>
                    No commitment. We'll come back within one working hour.
                  </p>
                </>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10" style={{ background: "var(--navy-deep)", color: "rgba(255,255,255,0.6)" }}>
        <div className="mx-auto max-w-6xl px-6 flex flex-wrap items-center justify-between gap-4 text-[13px]">
          <div>© Landlord Certificates Ltd · London</div>
          <Link to="/" className="hover:text-white">← Back to main site</Link>
        </div>
      </footer>
    </div>
  );
}

function Field({ label, type = "text", placeholder }: { label: string; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--ink-soft)" }}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border px-4 py-3 text-[14px] outline-none focus:ring-2"
        style={{ borderColor: "var(--line)", background: "white" }}
      />
    </div>
  );
}
