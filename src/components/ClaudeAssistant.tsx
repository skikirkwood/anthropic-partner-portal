"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Source = {
  label: string;
  system: "salesforce" | "contentful" | "anthropic" | "analytics";
};

type BotMessage = {
  from: "bot";
  html: string;
  sources?: Source[];
  actions?: { label: string; href?: string; onClick?: string }[];
};

type UserMessage = { from: "user"; text: string };
type Message = BotMessage | UserMessage;

/* ------------------------------------------------------------------ */
/*  Scripted knowledge base — demo answers keyed by trigger words      */
/* ------------------------------------------------------------------ */

const KNOWLEDGE: {
  triggers: string[];
  answer: string;
  sources: Source[];
  actions?: { label: string; href?: string }[];
}[] = [
  {
    triggers: ["referral", "referrals", "submit referral", "refer"],
    answer:
      "To submit a new referral, navigate to the <strong>Referrals</strong> section in the Partner Portal. You'll need the prospect company name, primary contact, estimated deal size, and use case. Referrals are reviewed within 2 business days and you'll receive email confirmation once approved.",
    sources: [
      { label: "Referral Management", system: "salesforce" },
      { label: "Partner Program Guide", system: "contentful" },
    ],
    actions: [{ label: "Open Referrals", href: "/partners" }],
  },
  {
    triggers: ["tier", "upgrade", "platinum", "gold", "silver", "level"],
    answer:
      "Partner tiers are determined by a combination of certified practitioners, annual revenue contribution, and customer satisfaction scores. <strong>Silver</strong> requires 2+ certifications, <strong>Gold</strong> requires 5+ with $500K+ revenue, and <strong>Platinum</strong> requires 10+ with $2M+ revenue and a dedicated practice lead.",
    sources: [
      { label: "Tier Requirements", system: "salesforce" },
      { label: "Partner Program Overview", system: "contentful" },
    ],
  },
  {
    triggers: ["certification", "certified", "exam", "training"],
    answer:
      "Anthropic offers three certification tracks: <strong>Claude Foundations</strong> (required for all tiers), <strong>Claude Developer</strong> (technical implementation), and <strong>Claude Solutions Architect</strong> (enterprise design). Exams are available through the Partner Portal and certifications are valid for 12 months.",
    sources: [
      { label: "Certification Tracking", system: "salesforce" },
      { label: "Training Resources", system: "contentful" },
      { label: "Certification Exam Portal", system: "anthropic" },
    ],
    actions: [{ label: "View Resources", href: "/resources" }],
  },
  {
    triggers: ["mdf", "funding", "market development", "co-marketing"],
    answer:
      "Your current MDF balance is <strong>$45,000</strong> for Q4 2026. To request funds, submit a Marketing Activity Request with your campaign plan, target audience, expected ROI, and timeline. Requests under $10K are auto-approved; larger amounts require channel manager review within 5 business days.",
    sources: [
      { label: "MDF Fund Allocation", system: "salesforce" },
      { label: "Co-Marketing Playbook", system: "contentful" },
      { label: "Campaign Performance", system: "analytics" },
    ],
  },
  {
    triggers: ["api", "integration", "technical", "documentation", "docs"],
    answer:
      "The Claude API documentation covers all current models including Claude 4 Opus, Sonnet, and Haiku. For partner integrations, we recommend starting with the <strong>Partner Integration Guide</strong> which includes authentication patterns, rate limits for partner-tier accounts, and pre-built SDKs for Python, TypeScript, and Java.",
    sources: [
      { label: "API Documentation", system: "anthropic" },
      { label: "Partner Integration Guide", system: "contentful" },
    ],
    actions: [{ label: "View Resources", href: "/resources" }],
  },
  {
    triggers: ["deal", "opportunity", "pipeline", "revenue", "sales"],
    answer:
      "Your partner pipeline currently shows <strong>12 active opportunities</strong> totaling $3.2M in estimated value. 3 deals are in Proposal stage and 2 are in Negotiation. Your channel manager Sarah Chen has flagged 2 opportunities that may need technical support — would you like me to surface those?",
    sources: [
      { label: "Opportunity Pipeline", system: "salesforce" },
      { label: "Deal Registration", system: "salesforce" },
      { label: "Revenue Dashboard", system: "analytics" },
    ],
  },
  {
    triggers: ["support", "help", "issue", "problem", "ticket"],
    answer:
      "You can reach partner support through several channels: the <strong>Partner Support Portal</strong> for ticket tracking (avg. response time: 4 hours), direct Slack access in #anthropic-partner-support for Gold+ tiers, or email at partners@anthropic.com. For urgent technical issues, Platinum partners have a dedicated hotline.",
    sources: [
      { label: "Support Case Management", system: "salesforce" },
      { label: "Partner Support Guide", system: "contentful" },
    ],
  },
  {
    triggers: ["announcement", "news", "update", "latest", "new"],
    answer:
      "Here are the latest partner announcements: <strong>Claude 4 Opus Launch</strong> — partner early access begins next week. <strong>Q1 Incentive Accelerator</strong> — 2x MDF match for deals closed by March 31. <strong>Partner Summit 2027</strong> — registration opens December 15 in San Francisco.",
    sources: [
      { label: "Partner Communications", system: "salesforce" },
      { label: "Announcements", system: "contentful" },
    ],
    actions: [{ label: "View Announcements", href: "/announcements" }],
  },
  {
    triggers: ["pricing", "cost", "discount", "margin"],
    answer:
      "Partner pricing follows a tiered discount structure: <strong>Silver</strong> partners receive 15% off list, <strong>Gold</strong> receives 25%, and <strong>Platinum</strong> receives 35%. Volume commitments above $1M annually unlock an additional 5% back-end rebate. All discounts are reflected in your partner price book within the Portal.",
    sources: [
      { label: "Partner Price Book", system: "salesforce" },
      { label: "Pricing & Packaging Guide", system: "contentful" },
    ],
  },
  {
    triggers: ["contact", "manager", "channel manager", "who"],
    answer:
      "Your assigned channel manager is <strong>Sarah Chen</strong> (sarah.chen@anthropic.com). She covers the North America consulting partners segment. For technical pre-sales support, your solutions engineer is <strong>Marcus Rivera</strong> (marcus.r@anthropic.com). Both are available on the partner Slack workspace.",
    sources: [
      { label: "Partner Account Team", system: "salesforce" },
    ],
  },
];

const FALLBACK: BotMessage = {
  from: "bot",
  html: "I couldn't find a specific answer to that in the partner knowledge base. I can search across your Salesforce Partner Portal data, Contentful resources, and Anthropic documentation. Try asking about referrals, certifications, MDF funding, your deal pipeline, or partner tier requirements.",
  sources: [],
  actions: [{ label: "Email partner support", href: "mailto:partners@anthropic.com" }],
};

/* ------------------------------------------------------------------ */
/*  Match logic                                                        */
/* ------------------------------------------------------------------ */

function findAnswer(query: string): BotMessage {
  const q = query.toLowerCase();
  const match = KNOWLEDGE.find((k) =>
    k.triggers.some((t) => q.includes(t))
  );
  if (!match) return FALLBACK;
  return {
    from: "bot",
    html: match.answer,
    sources: match.sources,
    actions: match.actions,
  };
}

/* ------------------------------------------------------------------ */
/*  Source badge colors                                                 */
/* ------------------------------------------------------------------ */

const SOURCE_STYLES: Record<string, { color: string; icon: string }> = {
  salesforce: { color: "text-blue-600 bg-blue-50", icon: "☁" },
  contentful: { color: "text-emerald-700 bg-emerald-50", icon: "◧" },
  anthropic: { color: "text-violet-700 bg-violet-50", icon: "✦" },
  analytics: { color: "text-amber-700 bg-amber-50", icon: "◎" },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ClaudeAssistant() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const msgsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Build (or rebuild) the greeting whenever the session loads
  useEffect(() => {
    const name = session?.user?.name?.split(" ")[0] || session?.user?.email?.split("@")[0] || "there";
    const greeting: BotMessage = {
      from: "bot",
      html: `Hi ${name}, I'm the <strong>Claude Partner Assistant</strong>. I can help you find information across your Salesforce Partner Portal, Contentful resources, and Anthropic documentation. What can I help you with?`,
    };
    setMessages((prev) => {
      // Only replace if still showing the initial greeting (1 message, from bot)
      if (prev.length <= 1) return [greeting];
      return prev;
    });
  }, [session]);

  // Auto-scroll
  useEffect(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
    }
  }, [messages, typing]);

  // Focus input when opened
  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    const q = input.trim();
    if (!q) return;

    const userMsg: UserMessage = { from: "user", text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    // Simulate a brief "thinking" delay
    setTimeout(() => {
      const reply = findAnswer(q);
      setMessages((prev) => [...prev, reply]);
      setTyping(false);
    }, 800 + Math.random() * 600);
  }

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex w-[380px] flex-col overflow-hidden rounded-2xl shadow-2xl border border-cream-200"
             style={{ height: "560px" }}>
          {/* Header */}
          <div className="flex items-center justify-between bg-ink px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-tawny text-white text-xs font-bold">
                C
              </span>
              <span className="text-sm font-semibold text-white">
                Claude Partner Assistant
              </span>
              <span className="rounded-full bg-tawny/20 px-2 py-0.5 text-[10px] font-medium text-tawny-light">
                AI
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-cream-200 hover:text-white transition-colors"
              aria-label="Minimize"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path d="M3 10h14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div
            ref={msgsRef}
            className="flex-1 overflow-y-auto bg-cream-50 p-4 space-y-4"
          >
            {messages.map((m, i) =>
              m.from === "user" ? (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-ink px-4 py-2.5 text-sm text-white">
                    {m.text}
                  </div>
                </div>
              ) : (
                <div key={i} className="flex gap-2.5">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-tawny text-white text-xs font-bold">
                    C
                  </span>
                  <div className="max-w-[85%] space-y-2">
                    <div
                      className="rounded-2xl rounded-tl-sm bg-white px-4 py-2.5 text-sm text-ink-light shadow-sm border border-cream-200"
                      dangerouslySetInnerHTML={{ __html: m.html }}
                    />
                    {/* Source citations */}
                    {m.sources && m.sources.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 px-1">
                        {m.sources.map((s, j) => {
                          const style = SOURCE_STYLES[s.system] || SOURCE_STYLES.anthropic;
                          return (
                            <span
                              key={j}
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${style.color}`}
                            >
                              <span className="text-[9px]">{style.icon}</span>
                              {s.label}
                            </span>
                          );
                        })}
                      </div>
                    )}
                    {/* Action buttons */}
                    {m.actions && m.actions.length > 0 && (
                      <div className="flex flex-wrap gap-2 px-1">
                        {m.actions.map((a, j) =>
                          a.href ? (
                            <a
                              key={j}
                              href={a.href}
                              className="rounded-lg border border-cream-200 bg-white px-3 py-1 text-xs font-medium text-ink hover:bg-cream-100 transition-colors"
                            >
                              {a.label}
                            </a>
                          ) : (
                            <button
                              key={j}
                              className="rounded-lg border border-cream-200 bg-white px-3 py-1 text-xs font-medium text-ink hover:bg-cream-100 transition-colors"
                            >
                              {a.label}
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            )}

            {/* Typing indicator */}
            {typing && (
              <div className="flex gap-2.5">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-tawny text-white text-xs font-bold">
                  C
                </span>
                <div className="rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm border border-cream-200">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-ink-muted animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 rounded-full bg-ink-muted animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 rounded-full bg-ink-muted animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Compose bar */}
          <form
            onSubmit={handleSend}
            className="flex items-center gap-2 border-t border-cream-200 bg-white px-3 py-2.5"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about referrals, certifications, deals..."
              maxLength={500}
              className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-muted outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-tawny text-white transition-colors hover:bg-tawny-hover disabled:opacity-40"
              aria-label="Send"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path d="M3.105 2.29a.75.75 0 0 0-.826.95l1.414 4.925A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086L2.28 16.76a.75.75 0 0 0 .826.95l15-6.5a.75.75 0 0 0 0-1.42l-15-6.5Z" />
              </svg>
            </button>
          </form>

          {/* Footer disclaimer */}
          <div className="bg-cream-50 px-3 py-1.5 text-center text-[10px] text-ink-muted border-t border-cream-200">
            Retrieves from Salesforce Partner Portal, Contentful CMS & Anthropic Docs
          </div>
        </div>
      )}

      {/* Floating launcher */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
        aria-label={open ? "Close Claude Assistant" : "Open Claude Assistant"}
      >
        {open ? (
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
            <path d="M12 3C6.5 3 2 6.9 2 11.6c0 2.6 1.4 5 3.6 6.5L5 21.5l4-2.2c1 .2 2 .4 3 .4 5.5 0 10-3.9 10-8.6S17.5 3 12 3zm-4 9.9a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6zm4 0a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6zm4 0a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6z" />
          </svg>
        )}
      </button>
    </>
  );
}
