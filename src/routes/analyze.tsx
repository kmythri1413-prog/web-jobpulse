import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
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
  FileText,
  Download,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { getJobMarket, type JobRole } from "@/lib/jobMarket.functions";

const jobMarketQuery = queryOptions({
  queryKey: ["job-market"],
  queryFn: () => getJobMarket(),
  staleTime: 5 * 60_000,
});

export const Route = createFileRoute("/analyze")({
  head: () => ({
    meta: [
      { title: "Salary Analyzer | JobPulse" },
      {
        name: "description",
        content:
          "Enter your job role, location and average package to get a live salary analysis: market comparison, salary range, demand and top skills. Export PDF & CSV reports.",
      },
      { property: "og:title", content: "Salary Analyzer | JobPulse" },
      {
        property: "og:description",
        content:
          "Live salary analysis with interactive charts and exportable PDF/CSV reports.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(jobMarketQuery),
  component: Analyze,
  errorComponent: ({ error }) => {
    const router = useRouter();
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
        <h1 className="text-xl font-semibold text-foreground">
          Couldn't load market data
        </h1>
        <p className="max-w-sm text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => router.invalidate()}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Try again
        </button>
      </div>
    );
  },
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-muted-foreground">No market data found.</p>
    </div>
  ),
});

function formatLPA(v: number) {
  return `₹${v.toFixed(1)} LPA`;
}

type Analysis = {
  marketMedian: number;
  userPkg: number;
  hasPkg: boolean;
  diffPct: number;
  low: number;
  high: number;
  pos: number;
};

function Analyze() {
  const { data: jobMarket } = useSuspenseQuery(jobMarketQuery);

  const [role, setRole] = useState(jobMarket.roles[0]?.role ?? "");
  const [location, setLocation] = useState(jobMarket.locations[0] ?? "");
  const [pkg, setPkg] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const roleData = useMemo<JobRole>(
    () => jobMarket.roles.find((r) => r.role === role) ?? jobMarket.roles[0],
    [jobMarket.roles, role],
  );

  const result = useMemo<Analysis | null>(() => {
    if (!submitted || !roleData) return null;
    const marketMedian =
      roleData.salaryByLocation[location] ?? roleData.baseMedian;
    const userPkg = parseFloat(pkg);
    const hasPkg = !Number.isNaN(userPkg) && userPkg > 0;
    const diffPct = hasPkg ? ((userPkg - marketMedian) / marketMedian) * 100 : 0;
    const low = +(marketMedian * 0.78).toFixed(1);
    const high = +(marketMedian * 1.45).toFixed(1);
    const pos = hasPkg
      ? Math.max(0, Math.min(100, ((userPkg - low) / (high - low)) * 100))
      : 50;
    return { marketMedian, userPkg, hasPkg, diffPct, low, high, pos };
  }, [submitted, roleData, location, pkg]);

  // ---- Chart data ----
  const comparisonData = useMemo(() => {
    if (!result) return [];
    const rows: { label: string; value: number; key: string }[] = [
      { label: "Range low", value: result.low, key: "low" },
      { label: "Median", value: result.marketMedian, key: "median" },
      { label: "Range high", value: result.high, key: "high" },
    ];
    if (result.hasPkg)
      rows.splice(2, 0, {
        label: "You",
        value: +result.userPkg.toFixed(1),
        key: "you",
      });
    return rows;
  }, [result]);

  const locationData = useMemo(
    () =>
      roleData
        ? Object.entries(roleData.salaryByLocation).map(([loc, val]) => ({
            location: loc,
            value: Number(val),
            current: loc === location,
          }))
        : [],
    [roleData, location],
  );

  const trendData = useMemo(
    () =>
      roleData
        ? roleData.trend.months.map((m, i) => ({
            month: m,
            openings: roleData.trend.values[i],
          }))
        : [],
    [roleData],
  );

  const expData = useMemo(
    () =>
      roleData
        ? Object.entries(roleData.salaryByExperience).map(([lvl, val]) => ({
            level: lvl,
            value: Number(val),
          }))
        : [],
    [roleData],
  );

  const compConfig: ChartConfig = {
    value: { label: "LPA", color: "var(--primary)" },
  };
  const locConfig: ChartConfig = {
    value: { label: "Median LPA", color: "var(--primary)" },
  };
  const trendConfig: ChartConfig = {
    openings: { label: "Open roles", color: "var(--primary)" },
  };
  const expConfig: ChartConfig = {
    value: { label: "LPA", color: "var(--accent)" },
  };

  const exportCSV = () => {
    if (!result || !roleData) return;
    const rows: (string | number)[][] = [
      ["JobPulse Salary Report"],
      ["Generated", new Date().toLocaleString()],
      [],
      ["Search"],
      ["Role", role],
      ["Location", location],
      ["Your package (LPA)", result.hasPkg ? result.userPkg : "—"],
      [],
      ["Summary"],
      ["Market median (LPA)", result.marketMedian],
      ["Range low (LPA)", result.low],
      ["Range high (LPA)", result.high],
      [
        "Difference vs median (%)",
        result.hasPkg ? result.diffPct.toFixed(1) : "—",
      ],
      ["Hiring demand", roleData.demand],
      ["Open roles", roleData.openings],
      [],
      ["Median salary by location (LPA)"],
      ...locationData.map((d) => [d.location, d.value]),
      [],
      ["Pay by experience (LPA)"],
      ...expData.map((d) => [d.level, d.value]),
      [],
      ["6-month hiring trend (open roles)"],
      ...trendData.map((d) => [d.month, d.openings]),
      [],
      ["Top skills"],
      ...roleData.topSkills.map((s) => [s]),
    ];
    const csv = rows
      .map((r) =>
        r
          .map((c) => {
            const s = String(c);
            return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
          })
          .join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `jobpulse-${role}-${location}.csv`.replace(/\s+/g, "-");
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = async () => {
    if (!result || !roleData) return;
    const { default: jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;
    const doc = new jsPDF();
    const rupee = (v: number) => `Rs ${v.toFixed(1)} LPA`;

    doc.setFontSize(18);
    doc.text("JobPulse Salary Report", 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(`Generated ${new Date().toLocaleString()}`, 14, 27);
    doc.setTextColor(0);

    autoTable(doc, {
      startY: 34,
      head: [["Search", "Value"]],
      body: [
        ["Role", role],
        ["Location", location],
        ["Your package", result.hasPkg ? rupee(result.userPkg) : "—"],
      ],
      theme: "striped",
    });

    autoTable(doc, {
      head: [["Summary", "Value"]],
      body: [
        ["Market median", rupee(result.marketMedian)],
        ["Typical range", `${rupee(result.low)} – ${rupee(result.high)}`],
        [
          "Difference vs median",
          result.hasPkg
            ? `${result.diffPct >= 0 ? "+" : ""}${result.diffPct.toFixed(1)}%`
            : "—",
        ],
        ["Hiring demand", roleData.demand],
        ["Open roles", String(roleData.openings)],
      ],
      theme: "striped",
    });

    autoTable(doc, {
      head: [["Location", "Median (LPA)"]],
      body: locationData.map((d) => [d.location, d.value.toFixed(1)]),
    });

    autoTable(doc, {
      head: [["Experience", "Pay (LPA)"]],
      body: expData.map((d) => [d.level, d.value.toFixed(1)]),
    });

    autoTable(doc, {
      head: [["Month", "Open roles"]],
      body: trendData.map((d) => [d.month, String(d.openings)]),
    });

    autoTable(doc, {
      head: [["Top skills"]],
      body: roleData.topSkills.map((s) => [s]),
    });

    doc.save(`jobpulse-${role}-${location}.pdf`.replace(/\s+/g, "-"));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
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

        {result && roleData && (
          <section className="mt-8 space-y-6">
            <div className="flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={exportCSV}
                className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium transition-colors hover:bg-secondary"
              >
                <Download size={15} /> Export CSV
              </button>
              <button
                onClick={exportPDF}
                className="flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <FileText size={15} /> Export PDF
              </button>
            </div>

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

            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-1 flex items-center gap-2 font-semibold">
                <DollarSign size={18} className="text-primary" /> You vs the
                market
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Your package compared with the {location} range for {role}.
              </p>
              <ChartContainer config={compConfig} className="h-[240px] w-full">
                <BarChart data={comparisonData} margin={{ top: 8 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    width={36}
                    tickFormatter={(v) => `₹${v}`}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(v) => formatLPA(Number(v))}
                      />
                    }
                  />
                  <ReferenceLine
                    y={result.marketMedian}
                    stroke="var(--muted-foreground)"
                    strokeDasharray="4 4"
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {comparisonData.map((d) => (
                      <Cell
                        key={d.key}
                        fill={
                          d.key === "you"
                            ? "var(--accent)"
                            : d.key === "median"
                              ? "var(--primary)"
                              : "color-mix(in oklch, var(--muted-foreground) 45%, transparent)"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-1 flex items-center gap-2 font-semibold">
                <MapPin size={18} className="text-primary" /> Median pay by city
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                {location} is highlighted. Hover any bar for the exact figure.
              </p>
              <ChartContainer config={locConfig} className="h-[260px] w-full">
                <BarChart data={locationData} margin={{ top: 8 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="location"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    angle={-30}
                    textAnchor="end"
                    height={60}
                    interval={0}
                    fontSize={11}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    width={36}
                    tickFormatter={(v) => `₹${v}`}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(v) => formatLPA(Number(v))}
                      />
                    }
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {locationData.map((d) => (
                      <Cell
                        key={d.location}
                        fill={
                          d.current
                            ? "var(--accent)"
                            : "color-mix(in oklch, var(--primary) 55%, transparent)"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="mb-4 flex items-center gap-2 font-semibold">
                  <TrendingUp size={18} className="text-primary" /> 6-month
                  hiring trend
                </h3>
                <ChartContainer
                  config={trendConfig}
                  className="h-[220px] w-full"
                >
                  <AreaChart data={trendData} margin={{ top: 8 }}>
                    <defs>
                      <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="var(--primary)"
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--primary)"
                          stopOpacity={0.02}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      width={40}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="openings"
                      stroke="var(--primary)"
                      strokeWidth={2}
                      fill="url(#trendFill)"
                    />
                  </AreaChart>
                </ChartContainer>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="mb-4 flex items-center gap-2 font-semibold">
                  <Award size={18} className="text-primary" /> Pay by experience
                </h3>
                <ChartContainer config={expConfig} className="h-[220px] w-full">
                  <BarChart
                    data={expData}
                    layout="vertical"
                    margin={{ left: 8 }}
                  >
                    <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                    <XAxis
                      type="number"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `₹${v}`}
                    />
                    <YAxis
                      type="category"
                      dataKey="level"
                      tickLine={false}
                      axisLine={false}
                      width={90}
                      fontSize={11}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(v) => formatLPA(Number(v))}
                        />
                      }
                    />
                    <Bar
                      dataKey="value"
                      fill="var(--accent)"
                      radius={[0, 6, 6, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </div>
            </div>

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
            </div>

            <p className="text-center text-xs text-muted-foreground">
              Live data from JobPulse Cloud · {jobMarket.currency}
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
