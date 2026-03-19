// Westen Intel — Voiceover data types and helpers
// Cold War Noir design: data access layer for all 1200+ voiceovers

import rawData from '../data/voiceovers.json';

export interface Voiceover {
  id: number;
  quote: string;
  topic: string;
  episodeCode: string;
  episodeNum: number;
  episodeTitle: string;
  season: string;
  theme: string;
}

export interface ThemeMeta {
  name: string;
  intro: string;
  icon: string;
  color: string;
  count: number;
}

export const THEME_IMAGES: Record<string, string> = {
  "Surveillance & Tradecraft": "https://d2xsxph8kpxj0f.cloudfront.net/106735271/NYgra9JPT7Zam4QAikb4pZ/theme-surveillance-6TtjL69sQQJFRcBfbgC2MB.webp",
  "Improvised Weapons & Gear": "https://d2xsxph8kpxj0f.cloudfront.net/106735271/NYgra9JPT7Zam4QAikb4pZ/theme-weapons-bUzpwyVhjaBFZDvkPGfEu4.webp",
  "Reading People": "https://d2xsxph8kpxj0f.cloudfront.net/106735271/NYgra9JPT7Zam4QAikb4pZ/theme-reading-people-4dHLMnbB4wZbcPHaqeVgLM.webp",
  "Cover Identities": "https://d2xsxph8kpxj0f.cloudfront.net/106735271/NYgra9JPT7Zam4QAikb4pZ/theme-cover-fuwDUHySDCadxJdbthkWYT.webp",
  "Staying Alive": "https://d2xsxph8kpxj0f.cloudfront.net/106735271/NYgra9JPT7Zam4QAikb4pZ/theme-reading-people-4dHLMnbB4wZbcPHaqeVgLM.webp",
  "The Long Con": "https://d2xsxph8kpxj0f.cloudfront.net/106735271/NYgra9JPT7Zam4QAikb4pZ/theme-surveillance-6TtjL69sQQJFRcBfbgC2MB.webp",
  "General Spycraft": "https://d2xsxph8kpxj0f.cloudfront.net/106735271/NYgra9JPT7Zam4QAikb4pZ/theme-weapons-bUzpwyVhjaBFZDvkPGfEu4.webp",
};

export const THEME_COLOR_MAP: Record<string, { accent: string; badge: string; border: string }> = {
  "Surveillance & Tradecraft": { accent: "text-emerald-400", badge: "bg-emerald-900/40 text-emerald-300 border-emerald-700/40", border: "border-emerald-700/30" },
  "Improvised Weapons & Gear": { accent: "text-orange-400", badge: "bg-orange-900/40 text-orange-300 border-orange-700/40", border: "border-orange-700/30" },
  "Reading People": { accent: "text-violet-400", badge: "bg-violet-900/40 text-violet-300 border-violet-700/40", border: "border-violet-700/30" },
  "Cover Identities": { accent: "text-amber-400", badge: "bg-amber-900/40 text-amber-300 border-amber-700/40", border: "border-amber-700/30" },
  "Staying Alive": { accent: "text-red-400", badge: "bg-red-900/40 text-red-300 border-red-700/40", border: "border-red-700/30" },
  "The Long Con": { accent: "text-blue-400", badge: "bg-blue-900/40 text-blue-300 border-blue-700/40", border: "border-blue-700/30" },
  "General Spycraft": { accent: "text-slate-400", badge: "bg-slate-800/60 text-slate-300 border-slate-600/40", border: "border-slate-600/30" },
};

export const themes: ThemeMeta[] = rawData.themes as ThemeMeta[];
export const allVoiceovers: Voiceover[] = rawData.voiceovers as Voiceover[];

export function getVoiceoversByTheme(themeName: string): Voiceover[] {
  return allVoiceovers.filter(v => v.theme === themeName);
}

export function getTheme(themeName: string): ThemeMeta | undefined {
  return themes.find(t => t.name === themeName);
}

export function searchVoiceovers(query: string, themeName?: string): Voiceover[] {
  const q = query.toLowerCase().trim();
  if (!q) return themeName ? getVoiceoversByTheme(themeName) : allVoiceovers;
  const pool = themeName ? getVoiceoversByTheme(themeName) : allVoiceovers;
  return pool.filter(v =>
    v.quote.toLowerCase().includes(q) ||
    v.topic.toLowerCase().includes(q) ||
    v.episodeTitle.toLowerCase().includes(q)
  );
}

export function getRandomVoiceover(themeName?: string): Voiceover {
  const pool = themeName ? getVoiceoversByTheme(themeName) : allVoiceovers;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getUniqueTopics(themeName: string): string[] {
  const vos = getVoiceoversByTheme(themeName);
  return Array.from(new Set(vos.map(v => v.topic))).sort();
}

export function getUniqueSeasons(themeName?: string): string[] {
  const pool = themeName ? getVoiceoversByTheme(themeName) : allVoiceovers;
  const order = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven'];
  const found = Array.from(new Set(pool.map(v => v.season)));
  return found.sort((a, b) => order.indexOf(a) - order.indexOf(b));
}

export function themeSlug(name: string): string {
  return encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-').replace(/[&]/g, 'and'));
}

export function themeFromSlug(slug: string): string {
  const decoded = decodeURIComponent(slug).replace(/-/g, ' ').replace('and', '&');
  return themes.find(t => t.name.toLowerCase() === decoded.toLowerCase())?.name || decoded;
}
