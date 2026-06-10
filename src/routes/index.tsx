import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  TrendingUp,
  MapPin,
  Code2,
  BarChart3,
  Search,
  Database,
  Brain,
  ArrowRight,
  ChevronRight,
  Zap,
  Globe,
  Shield,
  Briefcase,
  DollarSign,
  Users,
  Clock,
  Layers,
  GitBranch,
  Server,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import heroImg from "@/assets/hero-dashboard.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JobPulse | Job Market Analysis & Salary Tracker" },
      { name: "description", content: "Track salary trends, in-demand skills, and job market dynamics with data-driven insights for entry-level job seekers." },
      { property: "og:title", content: "JobPulse | Job Market Analysis & Salary Tracker" },
      { property: "og:description", content: "Track salary trends, in-demand skills, and job market dynamics with data-driven insights." },
    ],
  }),
  component: Index,
});

/* ─── Nav ─── */
function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Problem", href: "#problem" },
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#phases" },
    { label: "Demo", href: "#demo" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Zap size={18} strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              JobPulse
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
            <Link
              to="/analyze"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
            >
              Analyzer <ArrowRight size={14} />
            </Link>
          </div>

          <button
            className="md:hidden text-foreground"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-border pb-4 pt-2">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#demo"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Try Demo <ArrowRight size={14} />
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}

/* ─── Hero ─── */
function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-[400px] left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-[200px] -left-[200px] h-[500px] w-[500px] rounded-full bg-accent/8 blur-3xl" />
        <div className="absolute top-[100px] -right-[200px] h-[600px] w-[600px] rounded-full bg-chart-4/8 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground mb-8">
            <Sparkles size={14} className="text-primary" />
            Now tracking 50,000+ job postings across 120 cities
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Decode the Job Market.{" "}
            <span className="text-gradient">Master Your Career.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            A Python-powered web scraper that collects job postings from public
            job boards, analyzes the data, and generates actionable insights
            about salaries, skills, and hiring trends.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/20"
            >
              Analyze My Salary <ArrowRight size={18} />
            </Link>
            <a
              href="#phases"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-3.5 text-base font-semibold text-foreground transition-all hover:bg-secondary hover:border-glow"
            >
              How It Works <ChevronRight size={18} />
            </a>
          </div>
        </div>

        {/* Dashboard preview */}
        <div className="mt-16 md:mt-20 mx-auto max-w-5xl">
          <div className="relative rounded-2xl border border-border bg-card/50 p-2 backdrop-blur-sm">
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-primary/20 to-transparent opacity-40" />
            <div className="relative overflow-hidden rounded-xl">
              <img
                src={heroImg}
                alt="JobPulse analytics dashboard preview"
                className="w-full object-cover"
                width={1280}
                height={720}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Problem ─── */
function ProblemSection() {
  return (
    <section id="problem" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            The Problem
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Entry-level job seekers face a data desert
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: <DollarSign size={28} className="text-primary" />,
              title: "Salary Opacity",
              desc: "Job postings rarely list compensation. Candidates walk into interviews blind, under-asking or pricing themselves out.",
            },
            {
              icon: <Code2 size={28} className="text-accent" />,
              title: "Skill Confusion",
              desc: "With 500+ tech frameworks and buzzwords, beginners can't tell which skills actually get them hired vs. which are noise.",
            },
            {
              icon: <MapPin size={28} className="text-chart-3" />,
              title: "Regional Blindness",
              desc: "A junior dev in Austin and one in New York live in completely different job markets — but no one shows the delta.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-glow hover:bg-card/80"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {item.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Features ─── */
function Features() {
  const features = [
    {
      icon: <Briefcase size={22} className="text-primary" />,
      title: "Job Titles for Beginners",
      desc: "Discover the most common entry-level roles and titles that actually appear in listings — not just what blogs claim.",
    },
    {
      icon: <MapPin size={22} className="text-accent" />,
      title: "Salaries by Location",
      desc: "Compare average compensation across cities and regions. See where your skills are worth the most.",
    },
    {
      icon: <Code2 size={22} className="text-chart-3" />,
      title: "Top Requested Skills",
      desc: "Ranked list of the most in-demand skills extracted from real job descriptions, updated continuously.",
    },
    {
      icon: <TrendingUp size={22} className="text-chart-5" />,
      title: "Posting Trends Over Time",
      desc: "Track hiring velocity, seasonal patterns, and market shifts with time-series analysis.",
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground mb-4">
            <Sparkles size={14} className="text-primary" />
            What You Will Build
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Four Insights. One Scraper.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Extract, analyze, and visualize the data that matters most to
            junior developers.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="group relative rounded-2xl border border-border bg-card p-7 transition-all hover:border-glow hover:-translate-y-1"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Phases ─── */
function Phases() {
  const phases = [
    {
      num: "01",
      title: "Setup & Basic Scraping",
      desc: "Wire up requests + BeautifulSoup, fetch the first job board page, and parse title, company, location, and salary from the HTML.",
      icon: <Search size={20} />,
    },
    {
      num: "02",
      title: "Pagination & Storage",
      desc: "Loop through paginated results, deduplicate postings, and persist structured data into SQLite or a simple JSON store.",
      icon: <Layers size={20} />,
    },
    {
      num: "03",
      title: "Analysis Engine",
      desc: "Clean salary strings (e.g. '$80k–$110k'), normalize job titles, extract skills via regex/keyword matching, and aggregate by location.",
      icon: <Brain size={20} />,
    },
    {
      num: "04",
      title: "Dashboard & Export",
      desc: "Serve the data through a lightweight web UI, render charts, enable CSV/JSON export, and optionally schedule daily re-scrapes.",
      icon: <BarChart3 size={20} />,
    },
  ];

  return (
    <section id="phases" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-14">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Four phases from zero to a working job market intelligence tool.
          </p>
        </div>

        <div className="relative">
          {/* vertical line on desktop */}
          <div className="absolute left-[27px] top-0 bottom-0 w-px bg-border hidden md:block" />

          <div className="space-y-8 md:space-y-12">
            {phases.map((phase, i) => (
              <div
                key={i}
                className="relative flex flex-col md:flex-row gap-6 md:gap-10"
              >
                {/* number bubble */}
                <div className="flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-card text-sm font-bold text-foreground z-10">
                  {phase.num}
                </div>

                <div className="flex-1 rounded-2xl border border-border bg-card p-7 transition-all hover:border-glow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-primary">
                      {phase.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {phase.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {phase.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Demo Dashboard ─── */
function DemoDashboard() {
  const salaryData = [
    { city: "San Francisco", value: 142, salary: "$142k" },
    { city: "New York", value: 128, salary: "$128k" },
    { city: "Seattle", value: 118, salary: "$118k" },
    { city: "Austin", value: 105, salary: "$105k" },
    { city: "Denver", value: 98, salary: "$98k" },
    { city: "Remote", value: 112, salary: "$112k" },
  ];

  const skillsData = [
    { skill: "Python", pct: 94 },
    { skill: "SQL", pct: 87 },
    { skill: "React", pct: 78 },
    { skill: "AWS", pct: 71 },
    { skill: "Docker", pct: 62 },
    { skill: "TypeScript", pct: 58 },
    { skill: "Node.js", pct: 54 },
    { skill: "Git", pct: 49 },
    { skill: "Pandas", pct: 44 },
    { skill: "FastAPI", pct: 38 },
  ];

  const trendData = [
    { month: "Jan", jobs: 320 },
    { month: "Feb", jobs: 410 },
    { month: "Mar", jobs: 380 },
    { month: "Apr", jobs: 520 },
    { month: "May", jobs: 610 },
    { month: "Jun", jobs: 580 },
  ];

  const maxJobs = Math.max(...trendData.map((d) => d.jobs));

  return (
    <section id="demo" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground mb-4">
            <BarChart3 size={14} className="text-primary" />
            Live Demo
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Sample Dashboard
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A preview of the insights your scraper will generate using demo data.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {[
            { label: "Postings Tracked", value: "12,847", icon: <Briefcase size={18} />, change: "+12%" },
            { label: "Avg Salary", value: "$108,400", icon: <DollarSign size={18} />, change: "+5.3%" },
            { label: "Cities Covered", value: "120", icon: <Globe size={18} />, change: "+8" },
            { label: "Skills Indexed", value: "342", icon: <Code2 size={18} />, change: "+24" },
          ].map((stat, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary">
                  {stat.icon}
                </div>
                <span className="text-xs font-medium text-chart-5">{stat.change}</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Salary by location */}
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <MapPin size={18} className="text-primary" />
              <h3 className="text-lg font-semibold text-foreground">
                Avg. Salary by City
              </h3>
            </div>
            <div className="space-y-4">
              {salaryData.map((d) => (
                <div key={d.city}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-foreground font-medium">{d.city}</span>
                    <span className="text-sm font-semibold text-primary">{d.salary}</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-1000"
                      style={{ width: `${(d.value / 150) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top skills */}
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <Code2 size={18} className="text-accent" />
              <h3 className="text-lg font-semibold text-foreground">
                Top 10 Most Requested Skills
              </h3>
            </div>
            <div className="space-y-3">
              {skillsData.map((s) => (
                <div key={s.skill} className="flex items-center gap-3">
                  <span className="w-20 text-sm text-muted-foreground truncate">{s.skill}</span>
                  <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-accent to-primary transition-all duration-1000"
                      style={{ width: `${s.pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-xs font-medium text-foreground">{s.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trend chart */}
        <div className="mt-6 rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp size={18} className="text-chart-5" />
            <h3 className="text-lg font-semibold text-foreground">
              Job Posting Trends Over Time
            </h3>
          </div>
          <div className="flex items-end gap-3 md:gap-6 h-48 md:h-56">
            {trendData.map((d) => (
              <div key={d.month} className="flex flex-1 flex-col items-center gap-2">
                <div className="relative w-full flex items-end justify-center">
                  <div
                    className="w-full max-w-[48px] rounded-t-lg bg-gradient-to-t from-primary/40 to-primary/80 transition-all duration-700 hover:from-primary/60 hover:to-primary"
                    style={{ height: `${(d.jobs / maxJobs) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{d.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Tech Stack ─── */
function TechStack() {
  const stack = [
    { icon: <Code2 size={20} />, name: "Python 3", desc: "Core language" },
    { icon: <Search size={20} />, name: "BeautifulSoup", desc: "HTML parsing" },
    { icon: <Server size={20} />, name: "SQLite", desc: "Local data store" },
    { icon: <GitBranch size={20} />, name: "Pandas", desc: "Data analysis" },
    { icon: <BarChart3 size={20} />, name: "Matplotlib", desc: "Visualization" },
    { icon: <Globe size={20} />, name: "Flask/FastAPI", desc: "Web server" },
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-14">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Tech Stack
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Beginner-friendly tools with zero-cost infrastructure.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stack.map((t, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-glow"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                {t.icon}
              </div>
              <div>
                <div className="font-semibold text-foreground">{t.name}</div>
                <div className="text-sm text-muted-foreground">{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─── */
function CTA() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 md:p-16 text-center">
          {/* glow */}
          <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-[600px] -translate-x-1/2 bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-1/2 h-40 w-[600px] -translate-x-1/2 bg-accent/15 blur-3xl" />

          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Ready to Build Your Own Job Market Tracker?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Start with a simple scraper and grow it into a full intelligence
              platform. Every line of code teaches you something real.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#demo"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/25"
              >
                Launch Demo <ArrowRight size={18} />
              </a>
              <a
                href="#phases"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-8 py-4 text-base font-semibold text-foreground transition-all hover:bg-secondary"
              >
                View Roadmap <GitBranch size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Zap size={14} strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold text-foreground">JobPulse</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built for beginner developers who want real-world data skills.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#problem" className="hover:text-foreground transition-colors">Problem</a>
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#phases" className="hover:text-foreground transition-colors">Roadmap</a>
            <a href="#demo" className="hover:text-foreground transition-colors">Demo</a>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-muted-foreground/60">
          JobPulse is a demo project for educational purposes. Data shown is synthetic.
        </div>
      </div>
    </footer>
  );
}

/* ─── Intersection animation hook ─── */
function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

/* ─── Animated Section wrapper ─── */
function AnimatedSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ─── Main Page ─── */
function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <Hero />
        <AnimatedSection>
          <ProblemSection />
        </AnimatedSection>
        <AnimatedSection>
          <Features />
        </AnimatedSection>
        <AnimatedSection>
          <Phases />
        </AnimatedSection>
        <AnimatedSection>
          <DemoDashboard />
        </AnimatedSection>
        <AnimatedSection>
          <TechStack />
        </AnimatedSection>
        <AnimatedSection>
          <CTA />
        </AnimatedSection>
      </main>
      <Footer />
    </div>
  );
}
