import { INPUT_LIMITS } from "./input-limits";
import type { AvatarHue } from "./ipc-agent-identity";
import { isAvatarHue, isAvatarSeed } from "./ipc-agent-identity";

export const TEAM_SIZE = { min: 2, max: 6 } as const;

export interface TeamMember {
  name: string;
  title: string;
  job: string;
  avatarSeed: string;
  avatarHue: AvatarHue;
}

export interface TeamTemplate {
  id: string;
  name: string;
  summary: string;
  /** The first member is the head. It routes work and is the default first agent. */
  members: readonly TeamMember[];
}

export interface TeamMemberProfile {
  name: string;
  title: string;
  description: string;
  avatarSeed: string;
  avatarHue: AvatarHue;
}

/** Rules every member of every team reads. Written once, applied to each member. */
export const TEAM_SHARED_RULES: readonly string[] = [
  "Restate the task in your own words before you start, and say what will show it is done.",
  "Attach proof when you finish: a screenshot, a link, or before and after numbers.",
  "When corrected, write down the general rule, not the incident.",
  "Anything that leaves the team is a draft. The user sends it.",
  "Ask first before spending money, deleting data, changing logins, or deploying to production.",
  "If a routine finds nothing, say nothing.",
];

const CHIEF: TeamMember = {
  name: "Chief",
  title: "Chief of staff",
  job: "Routes each request to the right teammate, keeps the plan, and reports back in one place.",
  avatarSeed: "chief",
  avatarHue: 245,
};

export const STARTER_TEAMS: readonly TeamTemplate[] = [
  {
    id: "dev-crew",
    name: "Dev crew",
    summary: "Ship code with a planner, a builder, a tester and a release checker.",
    members: [
      CHIEF,
      {
        name: "Builder",
        title: "Software engineer",
        job: "Writes and fixes code in small steps, runs the project checks, and shows the diff.",
        avatarSeed: "builder",
        avatarHue: 55,
      },
      {
        name: "Tester",
        title: "Test writer",
        job: "Writes tests first, reproduces bugs, and says exactly what passed and what did not.",
        avatarSeed: "tester",
        avatarHue: 150,
      },
      {
        name: "Release",
        title: "Release checker",
        job: "Checks versions, changelog and build status before anything ships.",
        avatarSeed: "release",
        avatarHue: 320,
      },
    ],
  },
  {
    id: "research-crew",
    name: "Research crew",
    summary: "Answer hard questions with sources: a finder, a reader and a writer.",
    members: [
      CHIEF,
      {
        name: "Scout",
        title: "Source finder",
        job: "Finds reliable, current sources and lists the links with what each one supports.",
        avatarSeed: "scout",
        avatarHue: 185,
      },
      {
        name: "Reader",
        title: "Fact checker",
        job: "Reads the sources, compares them, and flags anything that disagrees or is out of date.",
        avatarSeed: "reader",
        avatarHue: 215,
      },
      {
        name: "Writer",
        title: "Brief writer",
        job: "Turns checked facts into a short brief with the sources and open questions.",
        avatarSeed: "writer",
        avatarHue: 280,
      },
    ],
  },
  {
    id: "life-admin-crew",
    name: "Life admin crew",
    summary: "Handle everyday admin: a planner, an inbox helper and a money watcher.",
    members: [
      CHIEF,
      {
        name: "Planner",
        title: "Calendar and tasks",
        job: "Keeps the calendar and to-do list tidy and flags clashes early.",
        avatarSeed: "planner",
        avatarHue: 100,
      },
      {
        name: "Inbox",
        title: "Message helper",
        job: "Sorts messages and drafts replies. Never sends without approval.",
        avatarSeed: "inbox",
        avatarHue: 30,
      },
      {
        name: "Ledger",
        title: "Money watcher",
        job: "Tracks bills and subscriptions and warns before charges. Never pays.",
        avatarSeed: "ledger",
        avatarHue: 0,
      },
    ],
  },
];

export type TeamProblem =
  | { kind: "id" }
  | { kind: "name" }
  | { kind: "size"; count: number }
  | { kind: "member"; index: number }
  | { kind: "duplicateName"; name: string }
  | { kind: "head" };

export function teamTemplateProblem(team: TeamTemplate): TeamProblem | null {
  if (!/^[a-z0-9][a-z0-9-]{0,63}$/u.test(team.id)) return { kind: "id" };
  if (!team.name.trim() || team.name.length > INPUT_LIMITS.agentName) return { kind: "name" };
  const count = team.members.length;
  if (count < TEAM_SIZE.min || count > TEAM_SIZE.max) return { kind: "size", count };
  const seen = new Set<string>();
  for (const [index, member] of team.members.entries()) {
    if (
      !member.name.trim() ||
      member.name.length > INPUT_LIMITS.agentName ||
      member.title.length > INPUT_LIMITS.agentTitle ||
      !member.job.trim() ||
      !isAvatarSeed(member.avatarSeed) ||
      !isAvatarHue(member.avatarHue)
    )
      return { kind: "member", index };
    const key = member.name.trim().toLowerCase();
    if (seen.has(key)) return { kind: "duplicateName", name: member.name };
    seen.add(key);
  }
  if (team.members[0]?.avatarSeed !== "chief") return { kind: "head" };
  return null;
}

/** Instructions for one member: its job, who routes, then the shared rules. */
export function teamMemberDescription(team: TeamTemplate, member: TeamMember): string {
  const head = team.members[0];
  const roster = team.members.map((item) => `${item.name} (${item.title})`).join(", ");
  const lines = [
    member.job,
    "",
    `You are part of the ${team.name}: ${roster}.`,
    head && head.name !== member.name
      ? `${head.name} routes work. Hand back to ${head.name} when you finish.`
      : "You route work to the right teammate by name and report the result in one place.",
    "",
    "Rules every teammate follows:",
    ...TEAM_SHARED_RULES.map((rule) => `- ${rule}`),
  ];
  return lines.join("\n");
}

/** The agents to create for a team, head first. */
export function teamInstallPlan(team: TeamTemplate): TeamMemberProfile[] {
  return team.members.map((member) => ({
    name: member.name,
    title: member.title,
    description: teamMemberDescription(team, member),
    avatarSeed: member.avatarSeed,
    avatarHue: member.avatarHue,
  }));
}
