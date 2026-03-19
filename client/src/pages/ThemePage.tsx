// Westen Intel — Theme/Dossier Page
// Design: Cold War Noir — classified dossier with voiceover cards
// Each theme has a cinematic intro, filter bar, and paginated voiceover grid

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
  const [expanded, setExpanded] = useState(false);
  const isLong = v.quote.length > 200;

  return (
    <div className={`group border ${colors.border} bg-white/[0.025] hover:bg-white/[0.04] transition-all duration-200 p-4 flex flex-col gap-3`}>
      {/* Quote */}
      <blockquote
        className="text-white/80 text-sm leading-relaxed flex-1"
        style={{ fontFamily: "'Special Elite', serif" }}
      >
        {isLong && !expanded
          ? `"${v.quote.slice(0, 200)}..."`
          : `"${v.quote}"`
        }
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className={`ml-2 text-xs ${colors.accent} hover:opacity-80 transition-opacity font-mono`}
          >
            {expanded ? "less" : "more"}
          </button>
        )}
      </blockquote>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span
          className={`text-xs px-2 py-0.5 border ${colors.badge} shrink-0`}
          style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: '0.08em' }}
        >
          {v.topic}
        </span>
        <span className="text-xs text-white/20 font-mono text-right">
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
          <span key={`ellipsis-${i}`} className="px-2 text-white/20 font-mono text-sm">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p as number)}
            className={`w-8 h-8 text-xs font-mono transition-colors ${
              p === page
                ? 'bg-amber-600 text-black font-bold'
                : 'text-white/40 hover:text-white/70 hover:bg-white/5'
            }`}
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

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [search, selectedTopic, selectedSeason]);

  // Scroll to top on page change
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [page]);

  const clearFilters = () => {
    setSearch("");
    setSelectedTopic("");
    setSelectedSeason("");
  };

  const hasFilters = search || selectedTopic || selectedSeason;

  if (!theme) {
    return (
      <div className="min-h-screen bg-[#0a0b0c] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/30 font-mono mb-4">Dossier not found.</p>
          <Link href="/">
            <span className="text-amber-400 font-mono text-sm hover:underline">← Return to base</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0b0c]">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0b0c]/90 backdrop-blur-sm border-b border-white/8">
        <div className="container flex items-center justify-between h-14">
          <Link href="/">
            <div className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors">
              <ArrowLeft size={14} />
              <span className="text-xs font-mono uppercase tracking-widest">All Dossiers</span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-amber-500" />
            <span
              className="text-white font-bold tracking-widest text-sm uppercase"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              Westen Intel
            </span>
          </div>
        </div>
      </nav>

      {/* DOSSIER HERO */}
      <section className="relative pt-14 min-h-[50vh] flex items-end">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${img})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0c] via-[#0a0b0c]/70 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0b0c]/80 to-transparent" />

        <div className="container relative z-10 py-12">
          {/* Dossier label */}
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2.5 bg-black/60 border ${colors.border}`}>
              <Icon className={`${colors.accent} w-5 h-5`} />
            </div>
            <span
              className={`text-xs uppercase tracking-widest ${colors.accent}`}
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              Intelligence Dossier
            </span>
            <span
              className="stamp border-red-600/60 text-red-500/70 text-xs"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              Classified
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-4xl md:text-6xl font-bold text-white mb-4 leading-none"
            style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: '0.05em' }}
          >
            {themeName.toUpperCase()}
          </h1>

          {/* Intro quote */}
          <div className="max-w-2xl pl-4 border-l-2 border-amber-600/40 mb-6">
            <p
              className="text-amber-100/70 text-sm leading-relaxed"
              style={{ fontFamily: "'Special Elite', serif" }}
            >
              "{theme.intro}"
            </p>
          </div>

          {/* Count */}
          <div className="flex items-center gap-6">
            <div>
              <span
                className={`text-2xl font-bold ${colors.accent}`}
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                {voiceovers.length}
              </span>
              <span className="text-white/30 text-xs font-mono ml-2">transmissions</span>
            </div>
            <div>
              <span
                className={`text-2xl font-bold ${colors.accent}`}
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                {topics.length}
              </span>
              <span className="text-white/30 text-xs font-mono ml-2">sub-topics</span>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER BAR */}
      <section className="sticky top-14 z-40 bg-[#0d0e0f]/95 backdrop-blur-sm border-b border-white/8 py-3">
        <div className="container flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 w-3.5 h-3.5" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search this dossier..."
              className="w-full bg-white/[0.04] border border-white/8 focus:border-amber-500/40 text-white/70 placeholder-white/20 pl-9 pr-3 py-2 text-xs font-mono outline-none transition-colors"
            />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 border text-xs font-mono transition-colors ${
              showFilters || hasFilters
                ? `border-amber-500/50 text-amber-400`
                : 'border-white/10 text-white/40 hover:text-white/60'
            }`}
          >
            <Filter size={12} />
            Filter
            {hasFilters && <span className="ml-1 bg-amber-600 text-black text-xs w-4 h-4 flex items-center justify-center font-bold">!</span>}
          </button>

          {/* Result count */}
          <span className="text-xs font-mono text-white/25 ml-auto">
            {filtered.length} of {voiceovers.length}
          </span>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="container pt-3 pb-1 flex flex-wrap gap-3">
            {/* Topic filter */}
            <select
              value={selectedTopic}
              onChange={e => setSelectedTopic(e.target.value)}
              className="bg-white/[0.04] border border-white/10 text-white/60 text-xs font-mono px-3 py-1.5 outline-none focus:border-amber-500/40 transition-colors"
            >
              <option value="">All Topics</option>
              {topics.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            {/* Season filter */}
            <select
              value={selectedSeason}
              onChange={e => setSelectedSeason(e.target.value)}
              className="bg-white/[0.04] border border-white/10 text-white/60 text-xs font-mono px-3 py-1.5 outline-none focus:border-amber-500/40 transition-colors"
            >
              <option value="">All Seasons</option>
              {seasons.map(s => (
                <option key={s} value={s}>Season {s}</option>
              ))}
            </select>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs font-mono text-white/30 hover:text-white/60 transition-colors"
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
              <p className="text-white/20 font-mono text-sm">No transmissions match your query.</p>
              <button onClick={clearFilters} className="mt-4 text-amber-400 text-xs font-mono hover:underline">
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

          <Pagination
            page={page}
            total={filtered.length}
            pageSize={PAGE_SIZE}
            onChange={setPage}
          />
        </div>
      </section>

      {/* OTHER DOSSIERS */}
      <section className="py-12 border-t border-white/8 bg-[#080909]">
        <div className="container">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-6 h-px bg-amber-500/50" />
            <span className="text-xs font-mono text-white/25 uppercase tracking-widest">Other Dossiers</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {themes
              .filter(t => t.name !== themeName)
              .map(t => (
                <Link key={t.name} href={`/theme/${themeSlug(t.name)}`}>
                  <div className={`px-4 py-2 border ${THEME_COLOR_MAP[t.name]?.border || 'border-white/10'} hover:bg-white/5 transition-colors`}>
                    <span
                      className={`text-xs uppercase tracking-wider ${THEME_COLOR_MAP[t.name]?.accent || 'text-white/50'}`}
                      style={{ fontFamily: "'Oswald', sans-serif" }}
                    >
                      {t.name}
                    </span>
                    <span className="text-white/20 text-xs font-mono ml-2">{t.count}</span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/8 py-6 bg-[#080909]">
        <div className="container flex items-center justify-between">
          <Link href="/">
            <span className="text-white/20 text-xs font-mono hover:text-white/40 transition-colors">
              ← Westen Intel
            </span>
          </Link>
          <p className="text-white/10 text-xs font-mono">
            Unofficial fan archive. Burn Notice © USA Network.
          </p>
        </div>
      </footer>
    </div>
  );
}
