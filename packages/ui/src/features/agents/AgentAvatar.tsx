import type { ExpressionId } from "@norbert_bodziony/bloub";
import type { PlushTransition } from "@norbert_bodziony/bloub/plush";
import type { AvatarMood } from "@openbot/brand/bloub-avatar-motion";
import type { AgentStepActivity, AvatarColor, AvatarHue } from "@openbot/contracts/ipc";
import { createEffect, createMemo, createSignal, For, Show } from "solid-js";
import type { AvatarMotion, SupportedAvatarSilhouetteId } from "../../bloub-avatar";
import type { AgentProfile } from "../../data";
import { AVATAR_EMOTIONS, type AvatarEmotion, characterSpritesFor } from "./character-faces";

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
  const [emotion, setEmotion] = createSignal<AvatarEmotion | null>(null);
  let emotionIndex = hashPhase(seed()) % AVATAR_EMOTIONS.length;
  const nextEmotion = () => {
    if (!sprites().emotions) return;
    emotionIndex = (emotionIndex + 1) % AVATAR_EMOTIONS.length;
    setEmotion(AVATAR_EMOTIONS[emotionIndex] ?? null);
  };
  const className = () => `agent-avatar agent-avatar-motion-${props.motion ?? "hover"} ${props.class ?? ""}`;

  return (
    <Show
      when={url() && !imageFailed()}
      fallback={
        <span
          class={className()}
          style={props.style}
          data-avatar="character"
          data-mood={mood()}
          data-emotion={emotion()}
          aria-hidden="true"
          onMouseEnter={nextEmotion}
          onMouseLeave={() => setEmotion(null)}
        >
          <span class="agent-avatar-body" style={{ "--avatar-phase": `${(hashPhase(seed()) % 3000) / -1000}s` }}>
            <img class="agent-avatar-foot agent-avatar-foot-l" src={sprites().footLeft} alt="" draggable={false} />
            <img class="agent-avatar-foot agent-avatar-foot-r" src={sprites().footRight} alt="" draggable={false} />
            <img class="agent-avatar-layer" src={sprites().body} alt="" draggable={false} />
            <Show when={sprites().blink}>
              {(blink) => <img class="agent-avatar-layer agent-avatar-blink" src={blink()} alt="" draggable={false} />}
            </Show>
            <Show when={sprites().emotions}>
              {(emotions) => (
                <For each={AVATAR_EMOTIONS}>
                  {(name) => (
                    <img
                      class="agent-avatar-emotion"
                      data-emotion={name}
                      src={emotions()[name]}
                      alt=""
                      draggable={false}
                    />
                  )}
                </For>
              )}
            </Show>
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
