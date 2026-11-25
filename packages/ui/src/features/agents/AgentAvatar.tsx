import type { ExpressionId } from "@norbert_bodziony/bloub";
import type { PlushTransition } from "@norbert_bodziony/bloub/plush";
import type { AvatarMood } from "@openbot/brand/bloub-avatar-motion";
import type { AgentStepActivity, AvatarColor, AvatarHue } from "@openbot/contracts/ipc";
import { createEffect, createMemo, createSignal, Show } from "solid-js";
import type { AvatarMotion, SupportedAvatarSilhouetteId } from "../../bloub-avatar";
import type { AgentProfile } from "../../data";
import { characterSpritesFor } from "./character-faces";

const MOTION_CLASS = { idle: "agent-avatar-motion-idle", hover: "agent-avatar-motion-hover" } as const;

function hexHue(color: string): number | null {
  const match = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(color);
  if (!match) return null;
  const [r = 0, g = 0, b = 0] = [match[1], match[2], match[3]].map((part) => Number.parseInt(part ?? "0", 16) / 255);
  const max = Math.max(r, g, b);
  const delta = max - Math.min(r, g, b);
  if (delta < 0.04) return null;
  let hue = 0;
  if (max === r) hue = ((g - b) / delta) % 6;
  else if (max === g) hue = (b - r) / delta + 2;
  else hue = (r - g) / delta + 4;
  return (hue * 60 + 360) % 360;
}

function hashPhase(seed: string): number {
  let hash = 0;
  for (const char of seed) hash = (hash * 17 + char.charCodeAt(0)) >>> 0;
  return hash;
}

interface AgentAvatarProps {
  agent?: Pick<AgentProfile, "avatarSeed" | "avatarHue" | "avatarColor" | "avatarUrl"> | undefined;
  seed?: string | undefined;
  hue?: AvatarHue | null;
  color?: AvatarColor | null | undefined;
  url?: string | null | undefined;
  motion?: AvatarMotion;
  mood?: AvatarMood;
  animationOffset?: number;
  shape?: SupportedAvatarSilhouetteId;
  expression?: ExpressionId;
  transition?: PlushTransition;
  followPointer?: boolean;
  workingFaces?: boolean;
  activity?: AgentStepActivity | null | undefined;
  eyeScale?: number;
  class?: string;
  style?: Record<string, string>;
}

export function AgentAvatar(props: AgentAvatarProps) {
  const seed = createMemo(() => props.seed ?? props.agent?.avatarSeed ?? "agent");
  const url = createMemo(() => (props.url !== undefined ? props.url : (props.agent?.avatarUrl ?? null)));
  const mood = (): AvatarMood => props.mood ?? "idle";
  const [imageFailed, setImageFailed] = createSignal(false);
  createEffect(
    () => url(),
    () => {
      setImageFailed(false);
    },
  );
  const sprites = createMemo(() => characterSpritesFor(seed()));
  const targetHue = (): number | null => {
    const fromColor = props.color ? hexHue(props.color) : null;
    if (fromColor !== null) return fromColor;
    return typeof props.hue === "number" ? props.hue : null;
  };
  const tint = () => {
    const target = targetHue();
    return target === null ? "none" : `hue-rotate(${Math.round(target - sprites().hue)}deg)`;
  };
  const motionClass = () => MOTION_CLASS[props.motion === "idle" ? "idle" : "hover"];
  const className = () => `agent-avatar ${motionClass()} ${props.class ?? ""}`;

  return (
    <Show
      when={url() && !imageFailed()}
      fallback={
        <span class={className()} style={props.style} data-avatar="character" data-mood={mood()} aria-hidden="true">
          <span
            class={`agent-avatar-body ${sprites().bodyClass}`}
            style={{ "--avatar-phase": `${(hashPhase(seed()) % 3000) / -1000}s`, "--avatar-tint": tint() }}
          >
            <img class="agent-avatar-layer" src={sprites().body} alt="" draggable={false} />
            <Show when={sprites().blink}>
              {(blink) => <img class="agent-avatar-layer agent-avatar-blink" src={blink()} alt="" draggable={false} />}
            </Show>
            <Show when={sprites().happy}>
              {(happy) => <img class="agent-avatar-happy" src={happy()} alt="" draggable={false} />}
            </Show>
            <Show when={sprites().crown}>
              {(crown) => <img class="agent-avatar-layer agent-avatar-crown" src={crown()} alt="" draggable={false} />}
            </Show>
            <img class="agent-avatar-layer agent-avatar-arm" src={sprites().arm} alt="" draggable={false} />
          </span>
        </span>
      }
    >
      <span
        class={`${className()} agent-avatar-custom`}
        style={props.style}
        data-avatar="image"
        data-mood={mood()}
        aria-hidden="true"
      >
        <img src={url() ?? ""} alt="" draggable={false} onError={() => setImageFailed(true)} />
      </span>
    </Show>
  );
}
