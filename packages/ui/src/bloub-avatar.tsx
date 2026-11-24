import type { AvatarColor, AvatarHue } from "@openbot/contracts/ipc";
import { characterFaceUrl } from "./features/agents/character-faces";

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

export function createStaticAvatarSvg(
  seed: string,
  hue: AvatarHue | null,
  color: AvatarColor | null = null,
): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
  image.setAttribute("href", characterFaceUrl(seed));
  image.setAttribute("width", "100");
  image.setAttribute("height", "100");
  svg.appendChild(image);
  void hue;
  void color;
  return svg;
}
