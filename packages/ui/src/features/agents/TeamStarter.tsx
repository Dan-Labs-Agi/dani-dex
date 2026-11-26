import type { TeamTemplate } from "@openbot/contracts/team-templates";
import { Button, Heading, Text } from "@openbot/ui";
import { For } from "solid-js";
import { useText } from "../../text";
import { AgentAvatar } from "./AgentAvatar";

export interface TeamStarterProps {
  teams: readonly TeamTemplate[];
  busyTeamId: string | null;
  error?: string | null | undefined;
  onAdd: (team: TeamTemplate) => void;
}

export function TeamStarter(props: TeamStarterProps) {
  const { t } = useText();
  return (
    <section
      aria-label={t("app.team.title")}
      style={{ display: "grid", gap: "12px", padding: "16px 24px", "max-width": "720px", margin: "0 auto" }}
    >
      <Heading as="h2" size="md">
        {t("app.team.title")}
      </Heading>
      <Text tone="muted">{t("app.team.description")}</Text>
      <For each={props.teams}>
        {(team) => (
          <div
            style={{
              display: "grid",
              gap: "8px",
              padding: "12px",
              border: "1px solid var(--border, #8884)",
              "border-radius": "12px",
            }}
          >
            <Heading as="h3" size="sm">
              {team.name}
            </Heading>
            <Text tone="muted">{team.summary}</Text>
            <ul style={{ display: "flex", gap: "12px", "flex-wrap": "wrap", padding: "0", margin: "0" }}>
              <For each={team.members}>
                {(member) => (
                  <li style={{ display: "flex", "align-items": "center", gap: "6px", "list-style": "none" }}>
                    <span style={{ width: "36px", height: "36px", display: "inline-block" }}>
                      <AgentAvatar seed={member.avatarSeed} hue={member.avatarHue} />
                    </span>
                    <span>
                      {member.name}
                      <Text tone="muted">{member.title}</Text>
                    </span>
                  </li>
                )}
              </For>
            </ul>
            <div>
              <Button
                type="button"
                variant="default"
                disabled={props.busyTeamId !== null}
                onClick={() => props.onAdd(team)}
              >
                {props.busyTeamId === team.id ? t("app.team.adding") : t("app.team.add")}
              </Button>
            </div>
          </div>
        )}
      </For>
      {props.error ? <Text role="alert">{props.error}</Text> : null}
    </section>
  );
}
