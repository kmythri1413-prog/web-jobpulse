import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Zap,
  ArrowLeft,
  Search,
  TrendingUp,
  TrendingDown,
  MapPin,
  Briefcase,
  DollarSign,
  Activity,
  Award,
} from "lucide-react";
import jobMarket from "@/data/jobMarket.json";

export const Route = createFileRoute("/analyze")({
  head: () => ({
    meta: [
      { title: "Salary Analyzer | JobPulse" },
      {
        name: "description",
        content:
          "Enter your job role, location and average package to get a live salary analysis: market comparison, salary range, demand and top skills.",
      },
      { property: "og:title", content: "Salary Analyzer | JobPulse" },
      {
        property: "og:description",
        content:
          "Live salary analysis based on your job role, location and package.",
      },
    ],
  }),
  component: Analyze,
});

type RoleData = (typeof jobMarket.roles)[number];

function formatLPA(v: number) {
  return `₹${v.toFixed(1)} LPA`;
}

function Analyze() {
  const [role, setRole] = useState(jobMarket.roles[0].role);
  const [location, setLocation] = useState(jobMarket.locations[0]);
  const [pkg, setPkg] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const roleData = useMemo<RoleData>(
    () => jobMarket.roles.find((r) => r.role === role) ?? jobMarket.roles[0],
    [role],
  );

  const result = useMemo(() => {
    if (!submitted) return null;
    const marketMedian =
      roleData.salaryByLocation[
        location as keyof typeof roleData.salaryByLocation
      ] ?? roleData.baseMedian;
    const userPkg = parseFloat(pkg);
    const hasPkg = !Number.isNaN(userPkg) && userPkg > 0;
    const diffPct = hasPkg ? ((userPkg - marketMedian) / marketMedian) * 100 : 0;
    const low = +(marketMedian * 0.78).toFixed(1);
    const high = +(marketMedian * 1.45).toFixed(1);
    // position of user package within range (0-100)
    const pos = hasPkg
      ? Math.max(0, Math.min(100, ((userPkg - low) / (high - low)) * 100))
      : 50;
    return { marketMedian, userPkg, hasPkg, diffPct, low, high, pos };
  }, [submitted, roleData, location, pkg]);

  const maxTrend = Math.max(...roleData.trend.values);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Zap size={18} strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold tracking-tight">JobPulse</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={16} /> Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Salary Analyzer
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
            Enter your role, location and average package to see how you compare
            against live market data ({jobMarket.roles.length} roles ·{" "}
            {jobMarket.locations.length} cities).
          </p>
        </div>

        {/* Input form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-4 sm:items-end"
        >
          <div className="sm:col-span-1">
            <label className="mb-1.5 block text-sm font-medium">Job role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              {jobMarket.roles.map((r) => (
                <option key={r.role} value={r.role}>
                  {r.role}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-1">
            <label className="mb-1.5 block text-sm font-medium">Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              {jobMarket.locations.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-1">
            <label className="mb-1.5 block text-sm font-medium">
              Avg package (LPA)
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={pkg}
              onChange={(e) => setPkg(e.target.value)}
              placeholder="e.g. 12.5"
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <button
            type="submit"
            className="flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Search size={16} /> Analyze
          </button>
        </form>

        {/* Results */}
        {result && (
          <section className="mt-8 space-y-6">
            {/* Comparison banner */}
            {result.hasPkg && (
              <div
                className={`flex items-start gap-3 rounded-2xl border p-5 ${
                  result.diffPct >= 0
                    ? "border-chart-5/40 bg-chart-5/10"
                    : "border-destructive/40 bg-destructive/10"
                }`}
              >
                {result.diffPct >= 0 ? (
                  <TrendingUp className="mt-0.5 shrink-0 text-chart-5" size={22} />
                ) : (
                  <TrendingDown
                    className="mt-0.5 shrink-0 text-destructive"
                    size={22}
                  />
                )}
                <div>
                  <p className="font-semibold">
                    Your package is {Math.abs(result.diffPct).toFixed(0)}%{" "}
                    {result.diffPct >= 0 ? "above" : "below"} the market median
                  </p>
                  <p className="text-sm text-muted-foreground">
                    You entered {formatLPA(result.userPkg)} for a {role} in{" "}
                    {location}. The market median is{" "}
                    {formatLPA(result.marketMedian)}.
                  </p>
                </div>
              </div>
            )}

            {/* Stat cards */}
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                icon={<DollarSign size={18} />}
                label="Market median"
                value={formatLPA(result.marketMedian)}
                sub={`${role} · ${location}`}
              />
              <StatCard
                icon={<Activity size={18} />}
                label="Hiring demand"
                value={roleData.demand}
                sub={`${roleData.openings.toLocaleString()} open roles`}
              />
              <StatCard
                icon={<Briefcase size={18} />}
                label="Typical range"
                value={`${result.low}–${result.high}`}
                sub="LPA (10th–90th pct)"
              />
            </div>

            {/* Salary range bar */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-4 flex items-center gap-2 font-semibold">
                <MapPin size={18} className="text-primary" /> Salary range in{" "}
                {location}
              </h3>
              <div className="relative h-3 rounded-full bg-secondary">
                <div className="absolute inset-y-0 left-[15%] right-[15%] rounded-full bg-gradient-to-r from-primary/40 via-primary to-accent" />
                {result.hasPkg && (
                  <div
                    className="absolute -top-1 h-5 w-5 -translate-x-1/2 rounded-full border-2 border-background bg-foreground shadow-lg"
                    style={{ left: `${result.pos}%` }}
                    title={`You: ${formatLPA(result.userPkg)}`}
                  />
                )}
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>{formatLPA(result.low)}</span>
                <span>Median {formatLPA(result.marketMedian)}</span>
                <span>{formatLPA(result.high)}</span>
              </div>
            </div>

            {/* Two column: trend + skills */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Trend */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="mb-4 flex items-center gap-2 font-semibold">
                  <TrendingUp size={18} className="text-primary" /> 6-month
                  hiring trend
                </h3>
                <div className="flex h-40 items-end gap-2">
                  {roleData.trend.values.map((v, i) => (
                    <div
                      key={i}
                      className="flex flex-1 flex-col items-center gap-1.5"
                    >
                      <div
                        className="w-full rounded-t bg-gradient-to-t from-primary/30 to-primary transition-all"
                        style={{ height: `${(v / maxTrend) * 100}%` }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {roleData.trend.months[i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="mb-4 flex items-center gap-2 font-semibold">
                  <Award size={18} className="text-primary" /> In-demand skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {roleData.topSkills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-border bg-secondary px-3 py-1.5 text-sm"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <h4 className="mb-2 mt-5 text-sm font-medium text-muted-foreground">
                  Pay by experience
                </h4>
                <div className="space-y-1.5">
                  {Object.entries(roleData.salaryByExperience).map(
                    ([lvl, val]) => (
                      <div
                        key={lvl}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-muted-foreground">{lvl}</span>
                        <span className="font-medium">{formatLPA(val)}</span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              Data generated by JobPulse · {jobMarket.currency} · updated{" "}
              {jobMarket.updatedAt}
            </p>
          </section>
        )}
      </main>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
        <span className="text-primary">{icon}</span>
        <span className="text-sm">{label}</span>
      </div>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}
