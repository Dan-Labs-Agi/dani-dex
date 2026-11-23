import { type ContentCollection, publishedFirst } from "./content-collection";
import { NEWS_AUTHOR } from "./news";

export const COMPARE_COLLECTION: ContentCollection<"compare"> = {
  id: "compare",
  indexRoute: "/compare",
  articleRoute: "/compare/$slug",
  name: "Compare",
  indexTitle: "Compare Dani Dex with other AI agent apps",
  indexDescription:
    "How AI agent apps compare: Dani Dex against other apps, coding agents against each other, and where agents run, which models they use and what they cost.",
  indexSocialImage: {
    path: "/social/compare.jpg",
    alt: "Better together. Dani Dex agents around a glass arch",
  },
  feedTitle: "Dani Dex comparisons",
  backLabel: "All comparisons",
  moreTitle: "More comparisons",
  imageEyebrow: "OPENBOT · COMPARE",
  articles: publishedFirst([
    {
      slug: "paperclip",
      title: "Dani Dex vs Paperclip: An App, Not a Server to Set Up",
      description:
        "OpenBot vs Paperclip: a desktop app with iPhone and Android apps and no VPN, or a Node.js server with an org chart and budgets. Setup, phones, price, license.",
      publishedAt: "2026-10-23",
      updatedAt: "2026-10-24",
      author: NEWS_AUTHOR,
    },
    {
      slug: "viktor",
      title: "Dani Dex vs Viktor: A Private, Local Alternative",
      description:
        "Dani Dex is a free, private Viktor alternative: run a team of AI agents on your own computer, with the AI plans you already pay for, no credits, and your data kept there.",
      publishedAt: "2026-10-23",
      updatedAt: "2026-10-24",
      author: NEWS_AUTHOR,
    },
    {
      slug: "instinct",
      title: "Dani Dex vs Instinct: A Private, Local Alternative",
      description:
        "Dani Dex is a free, private Instinct alternative: run a team of AI agents on your own computer, keep your data there, and approve each message before it is sent.",
      publishedAt: "2026-10-15",
      updatedAt: "2026-10-24",
      author: NEWS_AUTHOR,
    },
    {
      slug: "best-ai-agent-apps",
      title: "Best AI Agent Apps in 2026: 13 Apps Compared",
      description:
        "13 AI agent apps compared: Dani Dex, Claude Code, Codex, Cursor, Antigravity, Devin, Manus and more. Where they run, models, price and benchmark scores.",
      publishedAt: "2026-10-03",
      updatedAt: "2026-10-24",
      author: NEWS_AUTHOR,
    },
    {
      slug: "codex-vs-claude-code",
      title: "Codex vs Claude Code: Which Coding Agent to Use",
      description:
        "Codex vs Claude Code: benchmark scores, cost per task, plans, sandboxes and privacy, from official sources. Or run both as one team in Dani Dex.",
      publishedAt: "2026-10-03",
      updatedAt: "2026-10-24",
      author: NEWS_AUTHOR,
    },
    {
      slug: "claude-code-vs-antigravity",
      title: "Claude Code vs Antigravity: Claude or Gemini Agent",
      description:
        "Claude Code vs Google Antigravity: benchmark scores, cost per task, plans, apps and privacy, from official sources. Or run both in Dani Dex.",
      publishedAt: "2026-10-03",
      updatedAt: "2026-10-24",
      author: NEWS_AUTHOR,
    },
    {
      slug: "cursor-vs-claude-code",
      title: "Cursor vs Claude Code: Editor or Terminal Agent",
      description:
        "Cursor vs Claude Code: an editor with many models, or Claude's agent in your terminal. Plans, cloud agents and privacy, from official sources.",
      publishedAt: "2026-10-03",
      updatedAt: "2026-10-24",
      author: NEWS_AUTHOR,
    },
    {
      slug: "chatgpt-dots",
      title: "Dani Dex vs ChatGPT dots: A Local Alternative",
      description:
        "Dani Dex is a free, local ChatGPT dots alternative: run a team of AI agents on your own computer, in any country, with the ChatGPT plan you already pay for.",
      publishedAt: "2026-10-02",
      updatedAt: "2026-10-24",
      author: NEWS_AUTHOR,
    },
    {
      slug: "devin",
      title: "Dani Dex vs Devin: A Local Devin Alternative",
      description:
        "Dani Dex is a free, local Devin alternative: run Codex, Claude Code, Gemini and Grok as a coding agent team on your computer, with plans you already have.",
      publishedAt: "2026-09-27",
      updatedAt: "2026-10-24",
      author: NEWS_AUTHOR,
    },
    {
      slug: "claude-cowork",
      title: "Dani Dex vs Claude Cowork: A Local Alternative",
      description:
        "Dani Dex vs Claude Cowork: run Claude Code, Codex, Gemini and Grok as a team on your own computer, with the AI plans you already pay for. Compare the two.",
      publishedAt: "2026-09-27",
      updatedAt: "2026-10-24",
      author: NEWS_AUTHOR,
    },
    {
      slug: "manus",
      title: "Dani Dex vs Manus: A Local Manus Alternative",
      description:
        "Dani Dex is a free, local Manus alternative: run a team of AI agents on your own computer with the ChatGPT, Claude, Gemini or Grok plan you already pay for.",
      publishedAt: "2026-09-27",
      updatedAt: "2026-10-24",
      author: NEWS_AUTHOR,
    },
    {
      slug: "openclaw",
      title: "Dani Dex vs OpenClaw: An OpenClaw Alternative",
      description:
        "Dani Dex vs OpenClaw (formerly Clawdbot and Moltbot): run Codex, Claude Code, Gemini and Grok as a team on your computer, and reach them from your phone.",
      publishedAt: "2026-09-27",
      updatedAt: "2026-10-24",
      author: NEWS_AUTHOR,
    },
    {
      slug: "hermes-agent",
      title: "Dani Dex vs Hermes Agent: A Hermes Agent Alternative",
      description:
        "Dani Dex vs Hermes Agent: run Codex, Claude Code, Gemini and Grok as a team on your computer, with the AI plans you already pay for. Compare the two.",
      publishedAt: "2026-09-27",
      updatedAt: "2026-10-24",
      author: NEWS_AUTHOR,
    },
    {
      slug: "muse",
      title: "Dani Dex vs Muse: A Local Alternative to Meta's Muse",
      description:
        "Dani Dex is a free, local alternative to Meta's Muse: run Muse Code, Codex, Claude Code and Gemini as a team on your computer, with the plans you have.",
      publishedAt: "2026-09-27",
      updatedAt: "2026-10-24",
      author: NEWS_AUTHOR,
    },
    {
      slug: "grok-bot",
      title: "Dani Dex vs Grok Bot: A Local Grok Bot Alternative",
      description:
        "Dani Dex is a free, local Grok Bot alternative: run AI agents on your computer with the ChatGPT, Claude, Gemini or Grok plan you already pay for.",
      publishedAt: "2026-09-24",
      updatedAt: "2026-10-24",
      author: NEWS_AUTHOR,
    },
  ]),
};
