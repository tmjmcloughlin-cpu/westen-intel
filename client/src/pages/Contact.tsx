/* Contact.tsx — Westen Intel
 * Design: Miami Sunset Noir
 * Bg: Deep Navy, Accent: Miami Blue, Secondary: Coral
 * Headlines: Bebas Neue | Body: DM Sans | Mono: JetBrains Mono
 * Page: Contact / About — Westen-style voice, praise for Matt Nix & cast/crew
 */

import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Send, Target, Star, Users, Pen } from "lucide-react";
import { toast } from "sonner";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/106735271/NYgra9JPT7Zam4QAikb4pZ/westen-intel-logo-UzKebTKpPCddRHm4kfyi9V.webp";
const TOM_PHOTO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/106735271/NYgra9JPT7Zam4QAikb4pZ/tom-photo_8740342b.png";

const navyCard = { backgroundColor: 'oklch(0.16 0.04 265)' };
const navyBorder = { borderColor: 'oklch(1 0 0 / 10%)' };
const miamiBlueFull = 'oklch(0.62 0.22 220)';
const miamiBlueDim = 'oklch(0.62 0.22 220 / 20%)';

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Fill in all fields. A good operative never leaves a job half-done.");
      return;
    }
    setSending(true);
    try {
      // Use mailto as a fallback for static sites — opens default email client
      const subject = encodeURIComponent(`Westen Intel — Message from ${form.name}`);
      const body = encodeURIComponent(
        `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
      );
      window.location.href = `mailto:joi.myassistant@gmail.com?subject=${subject}&body=${body}`;
      toast.success("Transmission prepared. Your email client will handle the rest.");
      setForm({ name: "", email: "", message: "" });
    } catch {
      toast.error("Transmission failed. Try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'oklch(0.12 0.04 265)', color: 'oklch(0.95 0.005 265)' }}>
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b"
        style={{ backgroundColor: 'oklch(0.10 0.04 265 / 95%)', backdropFilter: 'blur(12px)', borderColor: 'oklch(1 0 0 / 8%)' }}>
        <Link href="/">
          <img src={LOGO_URL} alt="Westen Intel" className="h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity" />
        </Link>
        <Link href="/">
          <span className="flex items-center gap-2 text-xs uppercase tracking-widest hover:opacity-70 transition-opacity"
            style={{ fontFamily: "'JetBrains Mono', monospace", color: miamiBlueFull }}>
            <ArrowLeft size={14} /> Back to Archive
          </span>
        </Link>
      </nav>

      {/* Hero */}
      <div className="pt-32 pb-16 px-6 max-w-5xl mx-auto">
        <div className="mb-3 flex items-center gap-3">
          <div className="w-8 h-px" style={{ backgroundColor: miamiBlueFull }} />
          <span className="text-xs uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace", color: miamiBlueFull }}>
            Operative File
          </span>
        </div>
        <h1 className="text-6xl md:text-8xl font-bold mb-4 leading-none"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}>
          ABOUT THIS
          <span className="block" style={{ color: miamiBlueFull }}>OPERATION</span>
        </h1>
        <p className="text-lg max-w-2xl leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif", color: 'oklch(0.75 0.01 265)' }}>
          When you're a spy, you learn that the best work is done by people who care about what they're doing.
          This archive exists because of one show, one writer, and a cast that made Miami feel like home.
        </p>
      </div>

      {/* About Tom */}
      <section className="px-6 pb-20 max-w-5xl mx-auto">
        <div className="rounded-sm border p-8 flex flex-col md:flex-row gap-8 items-start"
          style={{ ...navyCard, ...navyBorder }}>
          <div className="flex-shrink-0">
            <div className="w-36 h-36 rounded-sm overflow-hidden border-2" style={{ borderColor: miamiBlueFull }}>
              <img src={TOM_PHOTO_URL} alt="Tom" className="w-full h-full object-cover object-top" />
            </div>
            <div className="mt-3 text-center">
              <p className="text-xs uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace", color: miamiBlueFull }}>Tom</p>
              <p className="text-xs mt-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: 'oklch(0.55 0.01 265)' }}>SEO Manager · Fan · Builder</p>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.06em' }}>
              THE OPERATIVE BEHIND THE ARCHIVE
            </h2>
            <div className="space-y-4 text-base leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif", color: 'oklch(0.80 0.01 265)' }}>
              <p>
                When you're a spy — or in this case, an SEO manager with too much free time and a deep appreciation for
                good television — you learn to play to your strengths. Mine happen to be finding patterns in data,
                building things on the internet, and knowing every single Michael Westen voiceover by heart.
              </p>
              <p>
                This site is a passion project. No budget, no brief, no client. Just a fan who wanted a better way
                to explore the intelligence that Westen dropped every episode for seven seasons.
                Consider it a tribute — filed, classified, and archived for anyone who ever paused an episode
                to write down what Michael just said.
              </p>
              <p style={{ color: miamiBlueFull, fontStyle: 'italic' }}>
                "The best operations are the ones nobody asked you to run."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Praise — Matt Nix */}
      <section className="px-6 pb-16 max-w-5xl mx-auto">
        <div className="mb-8 flex items-center gap-3">
          <Pen size={18} style={{ color: miamiBlueFull }} />
          <h2 className="text-3xl font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.06em' }}>
            THE MAN WHO WROTE THE PLAYBOOK
          </h2>
        </div>
        <div className="rounded-sm border p-8" style={{ ...navyCard, ...navyBorder }}>
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-sm flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: miamiBlueDim, border: `1px solid ${miamiBlueFull}` }}>
              <Star size={20} style={{ color: miamiBlueFull }} />
            </div>
            <div>
              <h3 className="text-2xl font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.06em' }}>
                Matt Nix — Creator & Showrunner
              </h3>
              <p className="text-xs uppercase tracking-widest mt-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: 'oklch(0.55 0.01 265)' }}>
                Burn Notice · USA Network · 2007–2013
              </p>
            </div>
          </div>
          <div className="space-y-4 text-base leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif", color: 'oklch(0.80 0.01 265)' }}>
            <p>
              In the intelligence business, you learn to recognise genuine talent fast. Matt Nix didn't just write a TV show —
              he built a world. A world where the protagonist explains exactly what he's doing and why, and somehow that
              makes it <em>more</em> tense, not less. That's a rare trick.
            </p>
            <p>
              The voiceovers are the heart of Burn Notice. They're funny, they're sharp, they're instructional in the most
              absurd way possible. Every episode, Westen would break the fourth wall and teach you something — about
              surveillance, about psychology, about duct tape and yogurt containers. Matt Nix wrote those lines.
              Every single one of them. And they hold up.
            </p>
            <p>
              Seven seasons. One hundred and eleven episodes. Over twelve hundred voiceovers. That's not a show —
              that's a curriculum. And it started with one writer who had a very specific, very strange, very brilliant idea
              about what a spy show could be.
            </p>
            <blockquote className="border-l-2 pl-6 py-2 my-6 italic text-lg"
              style={{ borderColor: miamiBlueFull, color: 'oklch(0.88 0.01 265)', fontFamily: "'DM Sans', sans-serif" }}>
              "Thank you, Matt. You gave us Michael Westen. Miami hasn't been the same since."
            </blockquote>
          </div>
        </div>
      </section>

      {/* Praise — Cast & Crew */}
      <section className="px-6 pb-20 max-w-5xl mx-auto">
        <div className="mb-8 flex items-center gap-3">
          <Users size={18} style={{ color: miamiBlueFull }} />
          <h2 className="text-3xl font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.06em' }}>
            THE TEAM IN THE FIELD
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              name: "Jeffrey Donovan",
              role: "Michael Westen",
              note: "The voice behind every transmission on this site. Donovan made Westen's calm, precise delivery feel effortless — which, if you know anything about acting, means it was anything but. He carried seven seasons on his shoulders and made it look like a walk down Ocean Drive."
            },
            {
              name: "Gabrielle Anwar",
              role: "Fiona Glenanne",
              note: "Fiona didn't need a voiceover. She communicated entirely through the threat of imminent explosion. Anwar brought a ferocity and warmth to the role that balanced Westen's cool calculation perfectly. Every great operative needs someone willing to blow the door when diplomacy fails."
            },
            {
              name: "Bruce Campbell",
              role: "Sam Axe",
              note: "Sam Axe is what happens when a Navy SEAL discovers mojitos and never looks back. Campbell brought a charm and comic timing that made Sam the soul of the show. No mission was complete without him, and no scene was wasted when he was in it."
            },
            {
              name: "Sharon Gless",
              role: "Madeline Westen",
              note: "The most dangerous person in Miami wasn't a cartel boss or a rogue CIA operative. It was Madeline Westen with a cigarette and a look of quiet disappointment. Gless gave the show its emotional core — the reminder that behind every spy is a family that has no idea what's really going on."
            },
            {
              name: "Coby Bell",
              role: "Jesse Porter",
              note: "Jesse arrived in Season 4 and immediately earned his place. Bell brought energy and a moral compass that kept the team honest. A burned spy who didn't know he was burned — and who handled the truth better than most operatives would."
            },
            {
              name: "The Writers' Room",
              role: "Seasons 1–7",
              note: "The voiceovers didn't write themselves. Behind every 'when you're a spy' line was a room full of writers who understood that the best exposition is the kind that makes you feel smarter for hearing it. This archive is as much a tribute to them as to anyone."
            }
          ].map((person) => (
            <div key={person.name} className="rounded-sm border p-6" style={{ ...navyCard, ...navyBorder }}>
              <div className="flex items-center gap-3 mb-3">
                <Target size={14} style={{ color: miamiBlueFull }} />
                <div>
                  <h3 className="font-bold text-base" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.06em', fontSize: '1.1rem' }}>
                    {person.name}
                  </h3>
                  <p className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: miamiBlueFull }}>
                    {person.role}
                  </p>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif", color: 'oklch(0.75 0.01 265)' }}>
                {person.note}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section className="px-6 pb-24 max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="w-8 h-px" style={{ backgroundColor: miamiBlueFull }} />
            <span className="text-xs uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace", color: miamiBlueFull }}>
              Open Channel
            </span>
          </div>
          <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}>
            GOT A PASSION PROJECT?
            <span className="block" style={{ color: miamiBlueFull }}>LET'S TALK.</span>
          </h2>
          <p className="text-base leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif", color: 'oklch(0.72 0.01 265)' }}>
            When you're a spy, you learn that the best assets aren't the ones you recruit — they're the ones who
            come to you. If you've got an idea for a passion project and you're looking for someone who builds
            things on the internet for the love of it, not the invoice — drop a transmission below.
            No cover identity required.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-sm border p-8 space-y-6" style={{ ...navyCard, ...navyBorder }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: miamiBlueFull }}>
                Operative Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-sm text-sm outline-none focus:ring-1 transition-all"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  backgroundColor: 'oklch(0.20 0.04 265)',
                  border: '1px solid oklch(1 0 0 / 12%)',
                  color: 'oklch(0.95 0.005 265)',
                  // @ts-ignore
                  '--tw-ring-color': miamiBlueFull
                }}
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: miamiBlueFull }}>
                Secure Channel (Email)
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-sm text-sm outline-none focus:ring-1 transition-all"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  backgroundColor: 'oklch(0.20 0.04 265)',
                  border: '1px solid oklch(1 0 0 / 12%)',
                  color: 'oklch(0.95 0.005 265)',
                }}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2"
              style={{ fontFamily: "'JetBrains Mono', monospace", color: miamiBlueFull }}>
              Transmission
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              placeholder="Tell me about your project. What are you building? What do you need? A good operative always leads with the objective..."
              className="w-full px-4 py-3 rounded-sm text-sm outline-none focus:ring-1 transition-all resize-none"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                backgroundColor: 'oklch(0.20 0.04 265)',
                border: '1px solid oklch(1 0 0 / 12%)',
                color: 'oklch(0.95 0.005 265)',
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: 'oklch(0.45 0.01 265)' }}>
              Transmits to: joi.myassistant@gmail.com
            </p>
            <button
              type="submit"
              disabled={sending}
              className="flex items-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-widest transition-all hover:opacity-90 disabled:opacity-50"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                letterSpacing: '0.15em',
                backgroundColor: miamiBlueFull,
                color: '#fff',
              }}
            >
              <Send size={14} />
              {sending ? "Transmitting..." : "Send Transmission"}
            </button>
          </div>
        </form>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-8 text-center" style={{ borderColor: 'oklch(1 0 0 / 8%)' }}>
        <p className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: 'oklch(0.40 0.01 265)' }}>
          WESTEN INTEL · A FAN ARCHIVE · NOT AFFILIATED WITH USA NETWORK OR MATT NIX PRODUCTIONS
        </p>
        <p className="text-xs mt-2" style={{ fontFamily: "'JetBrains Mono', monospace", color: 'oklch(0.35 0.01 265)' }}>
          Built with respect for everyone who made Burn Notice what it was.
        </p>
      </footer>
    </div>
  );
}
