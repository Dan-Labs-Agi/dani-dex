import type { ExpressionId } from "@norbert_bodziony/bloub";
import type { PlushTransition } from "@norbert_bodziony/bloub/plush";
import { type AvatarMood, avatarMoodIsBusy } from "@openbot/brand/bloub-avatar-motion";
import { DaniAvatar } from "@openbot/brand/dani-avatar";
import type { AgentStepActivity, AvatarColor, AvatarHue } from "@openbot/contracts/ipc";
import { prefersReducedMotion } from "@openbot/ui/utils";
import { createEffect, createMemo, createSignal, Show } from "solid-js";
import { useAmbientMotion } from "../../ambient-motion";
import type { AvatarMotion, SupportedAvatarSilhouetteId } from "../../bloub-avatar";
import type { AgentProfile } from "../../data";

const PHOTO_BREATHE = "0.03";
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
  const hue = createMemo(() => (props.hue !== undefined ? props.hue : (props.agent?.avatarHue ?? null)));
  const color = createMemo(() =>
    props.color !== undefined || props.hue !== undefined ? (props.color ?? null) : (props.agent?.avatarColor ?? null),
  );
  const motion = () => props.motion ?? "hover";
  const url = createMemo(() => (props.url !== undefined ? props.url : (props.agent?.avatarUrl ?? null)));
  const mood = (): AvatarMood => props.mood ?? "idle";
  const [imageFailed, setImageFailed] = createSignal(false);
  createEffect(
    () => url(),
    () => {
      setImageFailed(false);
    },
  );
  const className = () => `agent-avatar agent-avatar-motion-${motion()} ${props.class ?? ""}`;
  const ambientMotion = useAmbientMotion();
  const breathe = () => (avatarMoodIsBusy(mood()) && ambientMotion() ? PHOTO_BREATHE : undefined);
  const photoStyle = (): Record<string, string> => {
    const amount = breathe();
    return amount ? { ...props.style, "--agent-avatar-breathe": amount } : { ...props.style };
  };
  return (
    <Show
      when={url() && !imageFailed()}
      fallback={
        <GeneratedAvatar
          seed={seed()}
          hue={hue()}
          color={color()}
          motion={motion()}
          mood={mood()}
          animationOffset={props.animationOffset}
          shape={props.shape}
          expression={props.expression}
          transition={props.transition ?? "pop"}
          followPointer={props.followPointer === true}
          workingFaces={props.workingFaces === true}
          activity={props.activity ?? null}
          eyeScale={props.eyeScale}
          class={className()}
          style={props.style}
        />
      }
    >
      <span
        class={`${className()} agent-avatar-custom`}
        style={photoStyle()}
        data-avatar="image"
        data-mood={mood()}
        data-breathe={breathe()}
        aria-hidden="true"
      >
        <AvatarImage url={url()} onFailed={() => setImageFailed(true)} />
      </span>
    </Show>
  );
}

function AvatarImage(props: { url: string | null; onFailed: () => void }) {
  return <img src={props.url ?? ""} alt="" draggable={false} onError={() => props.onFailed()} />;
}

function GeneratedAvatar(props: {
  seed: string;
  hue: AvatarHue | null;
  color: AvatarColor | null;
  motion: AvatarMotion;
  mood: AvatarMood;
  animationOffset?: number | undefined;
  shape?: SupportedAvatarSilhouetteId | undefined;
  expression?: ExpressionId | undefined;
  transition: PlushTransition;
  followPointer: boolean;
  workingFaces: boolean;
  activity: AgentStepActivity | null;
  eyeScale?: number | undefined;
  class: string;
  style?: Record<string, string> | undefined;
}) {
  const motion = () =>
    props.mood === "working" || props.mood === "connecting"
      ? ("working" as const)
      : props.mood === "waiting"
        ? ("waiting" as const)
        : props.mood === "responded"
          ? ("celebrate" as const)
          : ("idle" as const);
  return (
    <DaniAvatar
      seed={props.seed}
      hue={props.hue}
      color={props.color}
      motion={motion()}
      animated={props.motion === "always" && !prefersReducedMotion()}
      class={props.class}
      style={props.style}
    />
  );
}
