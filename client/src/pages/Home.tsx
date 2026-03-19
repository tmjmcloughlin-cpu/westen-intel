// Westen Intel — Home Page
// Design: Miami Sunset Noir
// Deep navy bg (#0a0f1e), coral accent, teal secondary
// Headlines: Bebas Neue | Quotes: DM Sans | Labels: JetBrains Mono

import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { Search, Eye, Wrench, Brain, UserCheck, Shield, Target, FileText, ChevronRight, RefreshCw } from "lucide-react";
import { themes, allVoiceovers, getRandomVoiceover, themeSlug, THEME_IMAGES, THEME_COLOR_MAP } from "@/lib/voiceovers";
import type { Voiceover } from "@/lib/voiceovers";

// Hero: Miami sunset with Westen
const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/106735271/NYgra9JPT7Zam4QAikb4pZ/westen-miami-sunset_2a19fdc0.png";

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
    <p className="text-lg md:text-xl leading-relaxed text-white/90" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
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
    <div className="border border-white/10 bg-white/[0.04] backdrop-blur-sm p-6 relative">
      <div className="flex items-start justify-between mb-4">
        <span className="text-xs text-white/30 uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          Random Transmission
        </span>
        <button
          onClick={refresh}
          className="text-white/30 hover:text-[oklch(0.65_0.22_38)] transition-colors p-1"
          title="New quote"
        >
          <RefreshCw size={14} />
        </button>
      </div>
      <blockquote
        className="text-white/90 text-base leading-[1.8] mb-4"
        style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}
      >
        "{quote.quote}"
      </blockquote>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className={`text-xs px-2 py-0.5 border ${colors.badge}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {quote.topic}
        </span>
        <span className="text-xs text-white/25" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
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
      <div className="group relative overflow-hidden border border-white/8 bg-white/[0.03] hover:border-white/20 transition-all duration-300 cursor-pointer h-full">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15 group-hover:opacity-25 transition-opacity duration-500"
          style={{ backgroundImage: `url(${img})` }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e]/95 via-[#0a0f1e]/70 to-[#0a0f1e]/30" />

        <div className="relative p-5 flex flex-col h-full min-h-[220px]">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2 bg-black/30 border ${colors.border}`}>
              <Icon className={`${colors.accent} w-4 h-4`} />
            </div>
            <span className="text-xs text-white/25" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {theme.count} entries
            </span>
          </div>

          {/* Title */}
          <h3
            className="text-white font-bold text-xl mb-2 leading-tight tracking-wide"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.08em' }}
          >
            {theme.name.toUpperCase()}
          </h3>

          {/* Intro */}
          <p className="text-white/50 text-sm leading-relaxed flex-1 line-clamp-3" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
            {theme.intro}
          </p>

          {/* Footer */}
          <div className={`mt-4 pt-3 border-t ${colors.border} flex items-center justify-between`}>
            <span className={`text-xs uppercase tracking-widest ${colors.accent}`} style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.12em' }}>
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
          className="w-full bg-white/[0.05] border border-white/10 focus:border-[oklch(0.65_0.22_38)]/60 text-white/85 placeholder-white/25 pl-11 pr-4 py-3 text-sm outline-none transition-colors"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        />
      </div>

      {searching && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 bg-[#0d1225] border border-white/10 border-t-0 max-h-96 overflow-y-auto">
          {results.map(v => {
            const colors = THEME_COLOR_MAP[v.theme] || THEME_COLOR_MAP["General Spycraft"];
            return (
              <Link key={v.id} href={`/theme/${themeSlug(v.theme)}`}>
                <div
                  className="px-4 py-3 border-b border-white/5 hover:bg-white/[0.04] transition-colors cursor-pointer"
                  onClick={() => setQuery("")}
                >
                  <p className="text-white/80 text-sm leading-relaxed mb-1.5 line-clamp-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    "{v.quote.slice(0, 120)}{v.quote.length > 120 ? '...' : ''}"
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-1.5 py-0.5 border ${colors.badge}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {v.topic}
                    </span>
                    <span className="text-xs text-white/25" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
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
        <div className="absolute top-full left-0 right-0 z-50 bg-[#0d1225] border border-white/10 border-t-0 px-4 py-3">
          <p className="text-white/30 text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            No transmissions found for "{query}"
          </p>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0f1e' }}>
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b border-white/8" style={{ backgroundColor: 'rgba(10,15,30,0.92)' }}>
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6" style={{ backgroundColor: 'oklch(0.62 0.22 220)' }} />
            <span className="text-white font-bold tracking-widest text-sm uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.15em' }}>
              Westen Intel
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-white/40" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            <span>{allVoiceovers.length} transmissions</span>
            <span style={{ color: 'oklch(0.65 0.22 38 / 60%)' }}>·</span>
            <span>7 seasons</span>
            <span style={{ color: 'oklch(0.65 0.22 38 / 60%)' }}>·</span>
            <span>{themes.length} dossiers</span>
          </div>
        </div>
      </nav>

      {/* HERO — Miami Sunset */}
      <section className="relative min-h-screen flex items-center pt-14">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${HERO_BG})` }}
        />
        {/* Warm sunset gradient — left dark for text, right shows the image */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to right, rgba(10,15,30,0.97) 0%, rgba(10,15,30,0.88) 45%, rgba(10,15,30,0.45) 75%, rgba(10,15,30,0.15) 100%)'
        }} />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top, #0a0f1e 0%, transparent 50%)'
        }} />

        <div className="container relative z-10 py-24">
          <div className="max-w-2xl">
            {/* Classification stamp */}
            <div className="mb-8 flex items-center gap-4">
              <span className="stamp border-red-500/60 text-red-400/80 text-xs" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                Declassified
              </span>
              <span className="text-white/20 text-xs uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                Burn Notice Archive · All 7 Seasons
              </span>
            </div>

            {/* Main title */}
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-1 leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}>
              WESTEN
            </h1>
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.04em', color: 'oklch(0.62 0.22 220)' }}>
              INTEL
            </h1>

            {/* Typewriter quote */}
            <div className="max-w-xl mb-10 pl-4 border-l-2" style={{ borderColor: 'oklch(0.65 0.22 38 / 50%)' }}>
              <TypewriterHero />
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mb-10">
              {[
                { label: "Voiceovers", value: "1,200+" },
                { label: "Themes", value: "7" },
                { label: "Seasons", value: "7" },
                { label: "Episodes", value: "111" },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif", color: 'oklch(0.62 0.22 220)' }}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-white/30 uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href="#dossiers"
              className="inline-flex items-center gap-2 font-bold px-6 py-3 text-sm uppercase tracking-widest transition-all hover:opacity-90"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.15em', backgroundColor: 'oklch(0.62 0.22 220)', color: '#fff' }}
            >
              Access Dossiers
              <ChevronRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <section className="py-12 border-b border-white/8" style={{ backgroundColor: '#0d1225' }}>
        <div className="container">
          <div className="text-center mb-6">
            <p className="text-xs text-white/30 uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Search all transmissions
            </p>
          </div>
          <GlobalSearch />
        </div>
      </section>

      {/* RANDOM QUOTE */}
      <section className="py-12" style={{ backgroundColor: '#0a0f1e' }}>
        <div className="container max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-white/8" />
            <span className="text-xs text-white/25 uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Field Transmission
            </span>
            <div className="h-px flex-1 bg-white/8" />
          </div>
          <RandomQuoteCard />
        </div>
      </section>

      {/* THEME DOSSIERS */}
      <section id="dossiers" className="py-16" style={{ backgroundColor: '#0a0f1e' }}>
        <div className="container">
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-8 h-px" style={{ backgroundColor: 'oklch(0.62 0.22 220)' }} />
              <span className="text-xs uppercase tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif', letterSpacing: '0.12em'", color: 'oklch(0.65 0.22 38 / 80%)' }}>
                Intelligence Dossiers
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.06em' }}>
              BROWSE BY THEME
            </h2>
            <p className="text-white/40 text-sm mt-2 max-w-lg" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
              Every voiceover Michael Westen ever delivered, organised into classified dossiers by subject matter.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {themes.map(theme => (
              <ThemeCard key={theme.name} theme={theme} />
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/8 py-8" style={{ backgroundColor: '#080d1a' }}>
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-1 h-4" style={{ backgroundColor: 'oklch(0.65 0.22 38 / 50%)' }} />
            <span className="text-white/30 text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Westen Intel — Unofficial Burn Notice Archive
            </span>
          </div>
          <p className="text-white/15 text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            All voiceovers © USA Network / Burn Notice. Fan site only.
          </p>
        </div>
      </footer>
    </div>
  );
}
