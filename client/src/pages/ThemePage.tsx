// Westen Intel — Theme/Dossier Page
// Design: Miami Sunset Noir
// Deep navy bg, coral accent, teal secondary
// Headlines: Bebas Neue | Quotes: DM Sans (full, no truncation) | Labels: JetBrains Mono

import { useState, useMemo, useEffect } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft, Search, Filter, X, ChevronLeft, ChevronRight, Eye, Wrench, Brain, UserCheck, Shield, Target, FileText } from "lucide-react";
import {
  getVoiceoversByTheme, getTheme, getUniqueTopics, getUniqueSeasons,
  themeFromSlug, themeSlug, THEME_IMAGES, THEME_COLOR_MAP, themes
} from "@/lib/voiceovers";
import type { Voiceover } from "@/lib/voiceovers";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Eye, Wrench, Brain, UserCheck, Shield, Target, FileText
};

const PAGE_SIZE = 24;

function VoiceoverCard({ v, colors }: { v: Voiceover; colors: ReturnType<typeof getColors> }) {
  return (
    <div className={`border ${colors.border} bg-white/[0.03] hover:bg-white/[0.055] transition-all duration-200 p-5 flex flex-col gap-4`}>
      {/* Quote — full text, no truncation, high readability */}
      <blockquote
        className="text-white/90 leading-[1.85] flex-1"
        style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: '0.9375rem' }}
      >
        "{v.quote}"
      </blockquote>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 flex-wrap pt-2 border-t border-white/5">
        <span
          className={`text-xs px-2 py-0.5 border ${colors.badge} shrink-0`}
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {v.topic}
        </span>
        <span className="text-xs text-white/25 text-right" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          S{v.season} · Ep {v.episodeNum} · {v.episodeTitle}
        </span>
      </div>
    </div>
  );
}

function getColors(themeName: string) {
  return THEME_COLOR_MAP[themeName] || THEME_COLOR_MAP["General Spycraft"];
}

function Pagination({ page, total, pageSize, onChange }: {
  page: number; total: number; pageSize: number; onChange: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-10">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="p-2 text-white/30 hover:text-white/70 disabled:opacity-20 transition-colors"
      >
        <ChevronLeft size={16} />
      </button>
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-white/20 text-sm" style={{ fontFamily: "'JetBrains Mono', monospace" }}>…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p as number)}
            className="w-8 h-8 text-xs transition-colors"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              backgroundColor: p === page ? 'oklch(0.62 0.22 220)' : 'transparent',
              color: p === page ? '#0a0f1e' : 'rgba(255,255,255,0.4)',
              fontWeight: p === page ? 700 : 400,
            }}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="p-2 text-white/30 hover:text-white/70 disabled:opacity-20 transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

export default function ThemePage() {
  const params = useParams<{ themeName: string }>();
  const themeName = themeFromSlug(params.themeName || "");
  const theme = getTheme(themeName);
  const voiceovers = getVoiceoversByTheme(themeName);
  const colors = getColors(themeName);
  const Icon = ICON_MAP[theme?.icon || "FileText"] || FileText;
  const img = THEME_IMAGES[themeName];

  const [search, setSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [selectedSeason, setSelectedSeason] = useState<string>("");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const topics = useMemo(() => getUniqueTopics(themeName), [themeName]);
  const seasons = useMemo(() => getUniqueSeasons(themeName), [themeName]);

  const filtered = useMemo(() => {
    let result = voiceovers;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(v =>
        v.quote.toLowerCase().includes(q) ||
        v.topic.toLowerCase().includes(q) ||
        v.episodeTitle.toLowerCase().includes(q)
      );
    }
    if (selectedTopic) result = result.filter(v => v.topic === selectedTopic);
    if (selectedSeason) result = result.filter(v => v.season === selectedSeason);
    return result;
  }, [voiceovers, search, selectedTopic, selectedSeason]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  useEffect(() => { setPage(1); }, [search, selectedTopic, selectedSeason]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [page]);

  const clearFilters = () => {
    setSearch("");
    setSelectedTopic("");
    setSelectedSeason("");
  };

  const hasFilters = search || selectedTopic || selectedSeason;

  if (!theme) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0f1e' }}>
        <div className="text-center">
          <p className="text-white/30 mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>Dossier not found.</p>
          <Link href="/">
            <span className="text-xs hover:underline" style={{ fontFamily: "'JetBrains Mono', monospace", color: 'oklch(0.62 0.22 220)' }}>
              ← Return to base
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0f1e' }}>
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b border-white/8" style={{ backgroundColor: 'rgba(10,15,30,0.92)' }}>
        <div className="container flex items-center justify-between h-14">
          <Link href="/">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/106735271/NYgra9JPT7Zam4QAikb4pZ/westen-intel-logo-UzKebTKpPCddRHm4kfyi9V.webp"
              alt="Westen Intel"
              className="h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity"
            />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/">
              <span className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/40 hover:text-white/70 transition-colors" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                <ArrowLeft size={12} /> All Dossiers
              </span>
            </Link>
            <Link href="/contact">
              <span className="text-xs uppercase tracking-widest hover:opacity-80 transition-opacity" style={{ fontFamily: "'JetBrains Mono', monospace", color: 'oklch(0.62 0.22 220)' }}>
                Contact
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* DOSSIER HERO */}
      <section className="relative pt-14 min-h-[52vh] flex items-end">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${img})` }}
        />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top, #0a0f1e 0%, rgba(10,15,30,0.75) 50%, rgba(10,15,30,0.4) 100%)'
        }} />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to right, rgba(10,15,30,0.85) 0%, transparent 60%)'
        }} />

        <div className="container relative z-10 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2.5 bg-black/50 border ${colors.border}`}>
              <Icon className={`${colors.accent} w-5 h-5`} />
            </div>
            <span className={`text-xs uppercase tracking-widest ${colors.accent}`} style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.12em' }}>
              Intelligence Dossier
            </span>
            <span className="stamp border-red-500/50 text-red-400/70 text-xs" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Classified
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em' }}>
            {themeName.toUpperCase()}
          </h1>

          <div className="max-w-2xl pl-4 border-l-2 mb-6" style={{ borderColor: 'oklch(0.65 0.22 38 / 40%)' }}>
            <p className="text-white/70 text-base leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
              "{theme.intro}"
            </p>
          </div>

          <div className="flex items-center gap-8">
            <div>
              <span className={`text-2xl font-bold ${colors.accent}`} style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                {voiceovers.length}
              </span>
              <span className="text-white/30 text-xs ml-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>transmissions</span>
            </div>
            <div>
              <span className={`text-2xl font-bold ${colors.accent}`} style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                {topics.length}
              </span>
              <span className="text-white/30 text-xs ml-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>sub-topics</span>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER BAR */}
      <section className="sticky top-14 z-40 border-b border-white/8 py-3 backdrop-blur-sm" style={{ backgroundColor: 'rgba(13,18,37,0.97)' }}>
        <div className="container flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 w-3.5 h-3.5" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search this dossier..."
              className="w-full bg-white/[0.04] border border-white/8 text-white/75 placeholder-white/20 pl-9 pr-3 py-2 text-sm outline-none transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 px-3 py-2 border text-xs transition-colors"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              borderColor: showFilters || hasFilters ? 'oklch(0.65 0.22 38 / 60%)' : 'rgba(255,255,255,0.1)',
              color: showFilters || hasFilters ? 'oklch(0.62 0.22 220)' : 'rgba(255,255,255,0.4)',
            }}
          >
            <Filter size={12} />
            Filter
            {hasFilters && (
              <span className="ml-1 text-xs w-4 h-4 flex items-center justify-center font-bold" style={{ backgroundColor: 'oklch(0.62 0.22 220)', color: '#0a0f1e' }}>
                !
              </span>
            )}
          </button>

          <span className="text-xs text-white/25 ml-auto" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {filtered.length} of {voiceovers.length}
          </span>
        </div>

        {showFilters && (
          <div className="container pt-3 pb-1 flex flex-wrap gap-3">
            <select
              value={selectedTopic}
              onChange={e => setSelectedTopic(e.target.value)}
              className="bg-white/[0.04] border border-white/10 text-white/60 text-xs px-3 py-1.5 outline-none transition-colors"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              <option value="">All Topics</option>
              {topics.map(t => <option key={t} value={t}>{t}</option>)}
            </select>

            <select
              value={selectedSeason}
              onChange={e => setSelectedSeason(e.target.value)}
              className="bg-white/[0.04] border border-white/10 text-white/60 text-xs px-3 py-1.5 outline-none transition-colors"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              <option value="">All Seasons</option>
              {seasons.map(s => <option key={s} value={s}>Season {s}</option>)}
            </select>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-colors"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>
        )}
      </section>

      {/* VOICEOVER GRID */}
      <section className="py-10">
        <div className="container">
          {paginated.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/20 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                No transmissions match your query.
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 text-xs hover:underline"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: 'oklch(0.62 0.22 220)' }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {paginated.map(v => (
                <VoiceoverCard key={v.id} v={v} colors={colors} />
              ))}
            </div>
          )}

          <Pagination page={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
        </div>
      </section>

      {/* OTHER DOSSIERS */}
      <section className="py-12 border-t border-white/8" style={{ backgroundColor: '#080d1a' }}>
        <div className="container">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-6 h-px" style={{ backgroundColor: 'oklch(0.65 0.22 38 / 50%)' }} />
            <span className="text-xs text-white/25 uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Other Dossiers
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {themes
              .filter(t => t.name !== themeName)
              .map(t => {
                const tc = THEME_COLOR_MAP[t.name] || THEME_COLOR_MAP["General Spycraft"];
                return (
                  <Link key={t.name} href={`/theme/${themeSlug(t.name)}`}>
                    <div className={`px-4 py-2 border ${tc.border} hover:bg-white/5 transition-colors`}>
                      <span className={`text-xs uppercase tracking-wider ${tc.accent}`} style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em' }}>
                        {t.name}
                      </span>
                      <span className="text-white/20 text-xs ml-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        {t.count}
                      </span>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/8 py-6" style={{ backgroundColor: '#080d1a' }}>
        <div className="container flex items-center justify-between">
          <Link href="/">
            <span className="text-white/20 text-xs hover:text-white/40 transition-colors" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              ← Westen Intel
            </span>
          </Link>
          <p className="text-white/10 text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Unofficial fan archive. Burn Notice © USA Network.
          </p>
        </div>
      </footer>
    </div>
  );
}
