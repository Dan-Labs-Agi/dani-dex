import { daniVariantForAvatar } from "@openbot/brand/dani-identity";
import { DANI_PICTURES } from "@openbot/brand/dani-pictures";
import type { ServerAppearance } from "@openbot/contracts/team-protocol/host-appearance-v1";
import type { JSX } from "@solidjs/web";
export interface ServerPlushLogoProps {
  seed: string;
  appearance?: ServerAppearance | null;
  class?: JSX.HTMLAttributes<HTMLImageElement>["class"];
}
export function ServerPlushLogo(props: ServerPlushLogoProps): JSX.Element {
  return (
    <img
      class={`ui-server-plush-logo ${props.class ?? ""}`}
      src={DANI_PICTURES[daniVariantForAvatar(props.seed, props.appearance?.color)]}
      alt=""
      draggable={false}
      aria-hidden="true"
    />
  );
}
