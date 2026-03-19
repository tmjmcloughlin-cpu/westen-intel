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

// Dossier background images — Burn Notice show locations & characters
export const THEME_IMAGES: Record<string, string> = {
  "Surveillance & Tradecraft": "https://d2xsxph8kpxj0f.cloudfront.net/106735271/NYgra9JPT7Zam4QAikb4pZ/dossier-surveillance-LB6Cq9YHZY9a7nkF7nMMfM.webp",
  "Improvised Weapons & Gear": "https://d2xsxph8kpxj0f.cloudfront.net/106735271/NYgra9JPT7Zam4QAikb4pZ/dossier-weapons-a7N2vVapaiD59kAgGSc4TA.webp",
  "Reading People": "https://d2xsxph8kpxj0f.cloudfront.net/106735271/NYgra9JPT7Zam4QAikb4pZ/dossier-reading-people-MGLAwEmbPjzzyFxKeGgwmD.webp",
  "Cover Identities": "https://d2xsxph8kpxj0f.cloudfront.net/106735271/NYgra9JPT7Zam4QAikb4pZ/dossier-cover-cPFpFj2vx3VXwHe7hFFo7n.webp",
  "Staying Alive": "https://d2xsxph8kpxj0f.cloudfront.net/106735271/NYgra9JPT7Zam4QAikb4pZ/dossier-staying-alive-W6hsN5BDA2VT7bfe3xUNAT.webp",
  "The Long Con": "https://d2xsxph8kpxj0f.cloudfront.net/106735271/NYgra9JPT7Zam4QAikb4pZ/dossier-long-con-DopseE7kVujrcekd7JW6hK.webp",
  "General Spycraft": "https://d2xsxph8kpxj0f.cloudfront.net/106735271/NYgra9JPT7Zam4QAikb4pZ/dossier-spycraft-kwkuKdzyWhXEx8UNDHHETQ.webp",
};

// Miami Blue colour scheme per theme
export const THEME_COLOR_MAP: Record<string, { accent: string; badge: string; border: string }> = {
  "Surveillance & Tradecraft": {
    accent: "text-sky-400",
    badge: "bg-sky-900/30 text-sky-300 border-sky-600/40",
    border: "border-sky-700/25"
  },
  "Improvised Weapons & Gear": {
    accent: "text-orange-400",
    badge: "bg-orange-900/30 text-orange-300 border-orange-600/40",
    border: "border-orange-700/25"
  },
  "Reading People": {
    accent: "text-sky-300",
    badge: "bg-sky-900/25 text-sky-200 border-sky-600/35",
    border: "border-sky-700/20"
  },
  "Cover Identities": {
    accent: "text-cyan-400",
    badge: "bg-cyan-900/30 text-cyan-300 border-cyan-600/40",
    border: "border-cyan-700/25"
  },
  "Staying Alive": {
    accent: "text-red-400",
    badge: "bg-red-900/30 text-red-300 border-red-600/40",
    border: "border-red-700/25"
  },
  "The Long Con": {
    accent: "text-blue-400",
    badge: "bg-blue-900/30 text-blue-300 border-blue-600/40",
    border: "border-blue-700/25"
  },
  "General Spycraft": {
    accent: "text-sky-400",
    badge: "bg-sky-900/30 text-sky-300 border-sky-600/40",
    border: "border-sky-700/25"
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
