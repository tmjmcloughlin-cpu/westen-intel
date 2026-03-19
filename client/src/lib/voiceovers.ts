// Westen Intel — Voiceover data types and helpers
// Miami Vice Palette: Navy bg, Coral accent, Teal secondary

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

// User's custom images
export const THEME_IMAGES: Record<string, string> = {
  "Surveillance & Tradecraft": "https://d2xsxph8kpxj0f.cloudfront.net/106735271/NYgra9JPT7Zam4QAikb4pZ/westen-miami-night_3d87565a.png",
  "Improvised Weapons & Gear": "https://d2xsxph8kpxj0f.cloudfront.net/106735271/NYgra9JPT7Zam4QAikb4pZ/westen-watch_02109c9a.png",
  "Reading People": "https://d2xsxph8kpxj0f.cloudfront.net/106735271/NYgra9JPT7Zam4QAikb4pZ/westen-miami-sunset_2a19fdc0.png",
  "Cover Identities": "https://d2xsxph8kpxj0f.cloudfront.net/106735271/NYgra9JPT7Zam4QAikb4pZ/westen-london_af80924a.png",
  "Staying Alive": "https://d2xsxph8kpxj0f.cloudfront.net/106735271/NYgra9JPT7Zam4QAikb4pZ/westen-miami-night_3d87565a.png",
  "The Long Con": "https://d2xsxph8kpxj0f.cloudfront.net/106735271/NYgra9JPT7Zam4QAikb4pZ/westen-watch_02109c9a.png",
  "General Spycraft": "https://d2xsxph8kpxj0f.cloudfront.net/106735271/NYgra9JPT7Zam4QAikb4pZ/westen-miami-sunset_2a19fdc0.png",
};

// Miami Vice colour scheme per theme
export const THEME_COLOR_MAP: Record<string, { accent: string; badge: string; border: string }> = {
  "Surveillance & Tradecraft": {
    accent: "text-teal-400",
    badge: "bg-teal-900/30 text-teal-300 border-teal-600/40",
    border: "border-teal-700/25"
  },
  "Improvised Weapons & Gear": {
    accent: "text-orange-400",
    badge: "bg-orange-900/30 text-orange-300 border-orange-600/40",
    border: "border-orange-700/25"
  },
  "Reading People": {
    accent: "text-coral-400",
    badge: "bg-rose-900/30 text-rose-300 border-rose-600/40",
    border: "border-rose-700/25"
  },
  "Cover Identities": {
    accent: "text-amber-400",
    badge: "bg-amber-900/30 text-amber-300 border-amber-600/40",
    border: "border-amber-700/25"
  },
  "Staying Alive": {
    accent: "text-red-400",
    badge: "bg-red-900/30 text-red-300 border-red-600/40",
    border: "border-red-700/25"
  },
  "The Long Con": {
    accent: "text-cyan-400",
    badge: "bg-cyan-900/30 text-cyan-300 border-cyan-600/40",
    border: "border-cyan-700/25"
  },
  "General Spycraft": {
    accent: "text-slate-300",
    badge: "bg-slate-800/50 text-slate-300 border-slate-600/40",
    border: "border-slate-600/25"
  },
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
