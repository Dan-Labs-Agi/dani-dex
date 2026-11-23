import { createEffect, createSignal } from "solid-js";
import { type AvatarInstance, registerAvatar } from "./dani/robot-avatar-engine";
import type { RobotMotion } from "./dani/robot-model";
import { type DaniVariantId, daniVariantForAvatar } from "./dani-identity";

import { DANI_PICTURES } from "./dani-pictures";
export function daniAvatarPicture(variant: DaniVariantId): string {
  return DANI_PICTURES[variant];
}
export interface DaniAvatarProps {
  seed?: string;
  color?: string | null;
  hue?: number | null;
  variant?: DaniVariantId;
  motion?: RobotMotion;
  animated?: boolean;
  class?: string;
  style?: Record<string, string>;
}
/** Solid owns the subscription and releases it on every replacement or unmount. */
export function DaniAvatar(props: DaniAvatarProps) {
  let element: HTMLSpanElement | undefined;
  let canvas: HTMLCanvasElement | undefined;
  const [ready, setReady] = createSignal(false);
  const variant = () => props.variant ?? daniVariantForAvatar(props.seed ?? "agent", props.color, props.hue);
  createEffect(
    () => ({ variant: variant(), motion: props.motion ?? "idle", animated: props.animated === true }),
    (state) => {
      if (!element || !canvas) return;
      setReady(false);
      if (!state.animated) return;
      const instance: AvatarInstance = {
        element,
        canvas,
        context: canvas.getContext("2d"),
        size: 128,
        role: "default",
        variant: state.variant,
        color: props.color ?? "#9561ED",
        motion: state.motion,
        animated: true,
        seed: 0,
        visible: true,
        dirty: true,
        ready: false,
        waveStarted: null,
        motionStarted: null,
        motionCompleted: false,
        onReady: setReady,
        onFailure: () => setReady(false),
      };
      return registerAvatar(instance);
    },
  );
  return (
    <span
      ref={element}
      class={props.class}
      style={{ position: "relative", display: "inline-grid", "aspect-ratio": "1", ...props.style }}
      data-dani-variant={variant()}
      aria-hidden="true"
    >
      <img
        src={daniAvatarPicture(variant())}
        alt=""
        draggable={false}
        style={{
          width: "100%",
          height: "100%",
          "object-fit": "contain",
          opacity: ready() ? "0" : "1",
          "grid-area": "1 / 1",
        }}
      />
      <canvas
        ref={canvas}
        width={128}
        height={128}
        style={{ width: "100%", height: "100%", opacity: ready() ? "1" : "0", "grid-area": "1 / 1" }}
      />
    </span>
  );
}
