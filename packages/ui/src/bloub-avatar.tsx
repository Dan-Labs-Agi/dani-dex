import { DANI_PICTURES } from "@openbot/brand/dani-pictures";
import { daniVariantForAvatar } from "@openbot/brand/dani-identity";
import type { AvatarColor, AvatarHue } from "@openbot/contracts/ipc";
export type AvatarMotion = "hover" | "always" | "idle";
export {
  AVATAR_COLOR_CHOICES,
  AVATAR_EXPRESSIONS,
  AVATAR_HUE_CHOICES,
  AVATAR_STYLES,
  type AvatarColorChoice,
  type AvatarStyle,
  avatarDefaultSeed,
  avatarHeadColor,
  avatarHueForColor,
  avatarHueSwatch,
  avatarSeedForFace,
  avatarStyleForSeed,
  type BloubAvatarProfile,
  bloubAvatarProfile,
  isAvatarColorChoice,
  SUPPORTED_AVATAR_SILHOUETTES,
  type SupportedAvatarSilhouetteId,
} from "@openbot/brand/bloub-avatar";
export {
  type AvatarMood,
  avatarMoodIsBusy,
  avatarMoodPresentation,
  SHAPE_SAFE_STATES,
  type ShapeSafeStateId,
} from "@openbot/brand/bloub-avatar-motion";

export function createStaticAvatarSvg(seed: string, hue: AvatarHue | null, color: AvatarColor | null = null): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 384 384");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
  image.setAttribute("href", DANI_PICTURES[daniVariantForAvatar(seed, color, hue)]);
  image.setAttribute("width", "384"); image.setAttribute("height", "384");
  svg.appendChild(image); return svg;
}
