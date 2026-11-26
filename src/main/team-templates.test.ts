// @vitest-environment node

import { describe, expect, it } from "vitest";
import { INPUT_LIMITS } from "@openbot/contracts/input-limits";
import { STARTER_TEAMS, TEAM_SHARED_RULES, teamInstallPlan, teamTemplateProblem } from "@openbot/contracts/team-templates";

describe("starter teams", () => {
  it("are all valid with Chief as the head", () => {
    for (const team of STARTER_TEAMS) {
      expect(teamTemplateProblem(team)).toBeNull();
      expect(team.members[0]?.name).toBe("Chief");
    }
  });

  it("install the head first and give every member the shared rules", () => {
    for (const team of STARTER_TEAMS) {
      const plan = teamInstallPlan(team);
      expect(plan).toHaveLength(team.members.length);
      expect(plan[0]?.name).toBe("Chief");
      for (const profile of plan) {
        expect(profile.description.length).toBeLessThanOrEqual(INPUT_LIMITS.agentDescription);
        for (const rule of TEAM_SHARED_RULES) expect(profile.description).toContain(rule);
      }
      expect(plan[1]?.description).toContain("Chief routes work");
    }
  });

  it("rejects a bad size, duplicate name and a missing head", () => {
    const [team] = STARTER_TEAMS;
    if (!team) throw new Error("no team");
    expect(teamTemplateProblem({ ...team, members: team.members.slice(0, 1) })).toEqual({ kind: "size", count: 1 });
    const [head, second] = team.members;
    if (!head || !second) throw new Error("need members");
    expect(teamTemplateProblem({ ...team, members: [head, { ...second, name: "chief" }] })).toEqual({
      kind: "duplicateName",
      name: "chief",
    });
    expect(teamTemplateProblem({ ...team, members: [second, head] })).toEqual({ kind: "head" });
  });
});
