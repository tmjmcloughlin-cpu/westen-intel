// Westen Intel — Home Page
// Design: Cold War Noir / Classified Intelligence File
// Dark charcoal bg, burnt amber accents, Special Elite typewriter font

import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { Search, Eye, Wrench, Brain, UserCheck, Shield, Target, FileText, ChevronRight, RefreshCw } from "lucide-react";
import { themes, allVoiceovers, getRandomVoiceover, themeSlug, THEME_IMAGES, THEME_COLOR_MAP } from "@/lib/voiceovers";
import type { Voiceover } from "@/lib/voiceovers";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/106735271/NYgra9JPT7Zam4QAikb4pZ/hero-bg-eC5WyKbW5uXHJfmLskUH4g.webp";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Eye, Wrench, Brain, UserCheck, Shield, Target, FileText
};

const OPENING_QUOTE = "My name is Michael Westen. I used to be a spy. Until... we got a burn notice on you. You're blacklisted. When you're burned, you've got nothing — no cash, no credit, no job history. You're stuck in whatever city they decide to dump you in.";

function useTypewriter(text: string, speed = 28) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayed, done };
}

function TypewriterHero() {
  const { displayed, done } = useTypewriter(OPENING_QUOTE, 22);
  return (
    <p
      className="text-lg md:text-xl leading-relaxed text-amber-100/90"
      style={{ fontFamily: "'Special Elite', serif" }}
    >
      {displayed}
      {!done && <span className="typewriter-cursor" />}
    </p>
  );
}

function RandomQuoteCard() {
  const [quote, setQuote] = useState<Voiceover>(() => getRandomVoiceover());
  const colors = THEME_COLOR_MAP[quote.theme] || THEME_COLOR_MAP["General Spycraft"];

  const refresh = useCallback(() => {
    setQuote(getRandomVoiceover());
  }, []);

  return (
    <div className="border border-white/10 bg-white/[0.03] p-6 relative group">
      <div className="flex items-start justify-between mb-4">
        <span className="text-xs font-mono text-white/30 uppercase tracking-widest">
          Random Transmission
        </span>
        <button
          onClick={refresh}
          className="text-white/30 hover:text-amber-400 transition-colors p-1"
          title="New quote"
        >
          <RefreshCw size={14} />
        </button>
      </div>
      <blockquote
        className="text-white/80 text-sm leading-relaxed mb-4"
        style={{ fontFamily: "'Special Elite', serif" }}
      >
        "{quote.quote}"
      </blockquote>
      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-0.5 border ${colors.badge}`} style={{ fontFamily: "'Oswald', sans-serif" }}>
          {quote.topic}
        </span>
        <span className="text-xs text-white/25 font-mono">
          S{quote.season} · Ep {quote.episodeNum} · {quote.episodeTitle}
        </span>
      </div>
    </div>
  );
}

function ThemeCard({ theme }: { theme: typeof themes[0] }) {
  const Icon = ICON_MAP[theme.icon] || FileText;
  const img = THEME_IMAGES[theme.name];
  const colors = THEME_COLOR_MAP[theme.name] || THEME_COLOR_MAP["General Spycraft"];
  const slug = themeSlug(theme.name);

  return (
    <Link href={`/theme/${slug}`}>
      <div className="group relative overflow-hidden border border-white/8 bg-white/[0.02] hover:border-white/20 transition-all duration-300 cursor-pointer h-full">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-500"
          style={{ backgroundImage: `url(${img})` }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />

        <div className="relative p-5 flex flex-col h-full min-h-[220px]">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2 bg-black/40 border ${colors.border}`}>
              <Icon className={`${colors.accent} w-4 h-4`} />
            </div>
            <span className="text-xs font-mono text-white/25">{theme.count} entries</span>
          </div>

          {/* Title */}
          <h3
            className="text-white font-bold text-lg mb-2 leading-tight"
            style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: '0.05em' }}
          >
            {theme.name.toUpperCase()}
          </h3>

          {/* Intro excerpt */}
          <p className="text-white/50 text-xs leading-relaxed flex-1 line-clamp-3 font-mono">
            {theme.intro}
          </p>

          {/* Footer */}
          <div className={`mt-4 pt-3 border-t ${colors.border} flex items-center justify-between`}>
            <span className={`text-xs uppercase tracking-widest ${colors.accent}`} style={{ fontFamily: "'Oswald', sans-serif" }}>
              Open Dossier
            </span>
            <ChevronRight className={`${colors.accent} w-3 h-3 group-hover:translate-x-1 transition-transform`} />
          </div>
        </div>
      </div>
    </Link>
  );
}

function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Voiceover[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    const q = query.toLowerCase();
    const found = allVoiceovers
      .filter(v =>
        v.quote.toLowerCase().includes(q) ||
        v.topic.toLowerCase().includes(q) ||
        v.episodeTitle.toLowerCase().includes(q)
      )
      .slice(0, 12);
    setResults(found);
  }, [query]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search voiceovers, topics, episodes..."
          className="w-full bg-white/[0.04] border border-white/10 focus:border-amber-500/50 text-white/80 placeholder-white/25 pl-11 pr-4 py-3 text-sm font-mono outline-none transition-colors"
        />
      </div>

      {searching && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 bg-[#0d0e0f] border border-white/10 border-t-0 max-h-96 overflow-y-auto">
          {results.map(v => {
            const colors = THEME_COLOR_MAP[v.theme] || THEME_COLOR_MAP["General Spycraft"];
            return (
              <Link key={v.id} href={`/theme/${themeSlug(v.theme)}`}>
                <div
                  className="px-4 py-3 border-b border-white/5 hover:bg-white/[0.04] transition-colors cursor-pointer"
                  onClick={() => setQuery("")}
                >
                  <p className="text-white/75 text-xs leading-relaxed mb-1.5 line-clamp-2" style={{ fontFamily: "'Special Elite', serif" }}>
                    "{v.quote.slice(0, 120)}{v.quote.length > 120 ? '...' : ''}"
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-1.5 py-0.5 border ${colors.badge}`} style={{ fontFamily: "'Oswald', sans-serif" }}>
                      {v.topic}
                    </span>
                    <span className="text-xs text-white/25 font-mono">
                      S{v.season} · {v.episodeTitle}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {searching && results.length === 0 && query.trim() && (
        <div className="absolute top-full left-0 right-0 z-50 bg-[#0d0e0f] border border-white/10 border-t-0 px-4 py-3">
          <p className="text-white/30 text-xs font-mono">No transmissions found for "{query}"</p>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0b0c]">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0b0c]/90 backdrop-blur-sm border-b border-white/8">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-amber-500" />
            <span
              className="text-white font-bold tracking-widest text-sm uppercase"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              Westen Intel
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-white/40">
            <span>{allVoiceovers.length} transmissions</span>
            <span className="text-amber-500/60">·</span>
            <span>7 seasons</span>
            <span className="text-amber-500/60">·</span>
            <span>{themes.length} dossiers</span>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-14">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${HERO_BG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0c] via-transparent to-transparent" />

        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }} />

        <div className="container relative z-10 py-24">
          <div className="max-w-3xl">
            {/* Classification stamp */}
            <div className="mb-8 flex items-center gap-4">
              <span
                className="stamp border-red-600/70 text-red-500/80 text-xs"
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                DECLASSIFIED
              </span>
              <span className="text-white/20 text-xs font-mono tracking-widest uppercase">
                Burn Notice Archive · All 7 Seasons
              </span>
            </div>

            {/* Main title */}
            <h1
              className="text-5xl md:text-7xl font-bold text-white mb-2 leading-none tracking-tight"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              WESTEN
            </h1>
            <h1
              className="text-5xl md:text-7xl font-bold mb-8 leading-none tracking-tight"
              style={{
                fontFamily: "'Oswald', sans-serif",
                color: 'oklch(0.58 0.18 42)',
              }}
            >
              INTEL
            </h1>

            {/* Typewriter quote */}
            <div className="max-w-xl mb-10 pl-4 border-l-2 border-amber-600/50">
              <TypewriterHero />
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6 mb-10">
              {[
                { label: "Voiceovers", value: "1,200+" },
                { label: "Themes", value: "7" },
                { label: "Seasons", value: "7" },
                { label: "Episodes", value: "111" },
              ].map(stat => (
                <div key={stat.label}>
                  <div
                    className="text-2xl font-bold text-amber-400"
                    style={{ fontFamily: "'Oswald', sans-serif" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs text-white/30 font-mono uppercase tracking-widest">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href="#dossiers"
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-black font-bold px-6 py-3 text-sm uppercase tracking-widest transition-colors"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              Access Dossiers
              <ChevronRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <section className="py-12 border-b border-white/8 bg-[#0d0e0f]">
        <div className="container">
          <div className="text-center mb-6">
            <p className="text-xs font-mono text-white/30 uppercase tracking-widest">
              Search all transmissions
            </p>
          </div>
          <GlobalSearch />
        </div>
      </section>

      {/* RANDOM QUOTE */}
      <section className="py-12 bg-[#0a0b0c]">
        <div className="container max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-white/8" />
            <span className="text-xs font-mono text-white/25 uppercase tracking-widest">
              Field Transmission
            </span>
            <div className="h-px flex-1 bg-white/8" />
          </div>
          <RandomQuoteCard />
        </div>
      </section>

      {/* THEME DOSSIERS GRID */}
      <section id="dossiers" className="py-16 bg-[#0a0b0c]">
        <div className="container">
          {/* Section header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-8 h-px bg-amber-500" />
              <span
                className="text-xs text-amber-500/70 uppercase tracking-widest"
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                Intelligence Dossiers
              </span>
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold text-white"
              style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: '0.05em' }}
            >
              BROWSE BY THEME
            </h2>
            <p className="text-white/40 text-sm font-mono mt-2 max-w-lg">
              Every voiceover Michael Westen ever delivered, organised into classified dossiers by subject matter.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {themes.map(theme => (
              <ThemeCard key={theme.name} theme={theme} />
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/8 py-8 bg-[#080909]">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-1 h-4 bg-amber-500/50" />
            <span className="text-white/30 text-xs font-mono">
              Westen Intel — Unofficial Burn Notice Archive
            </span>
          </div>
          <p className="text-white/15 text-xs font-mono">
            All voiceovers © USA Network / Burn Notice. Fan site only.
          </p>
        </div>
      </footer>
    </div>
  );
}
