export type AppLogoAnimation = "none" | "blink" | "look-around" | "surprised";
export type AppLogoVariant = "production" | "dev" | "preview";

export interface AppLogoProps {
  variant: AppLogoVariant;
  animation?: AppLogoAnimation;
  interactive?: boolean;
  pointerArea?: HTMLElement | undefined;
  class?: string;
}

const APP_MARK_URL = new URL("./app-mark.png", import.meta.url).href;

export function AppLogo(props: AppLogoProps) {
  const className = () => ["app-logo", props.class].filter(Boolean).join(" ");

  return (
    <img
      class={className()}
      src={APP_MARK_URL}
      alt=""
      draggable={false}
      data-variant={props.variant}
      data-interactive={props.interactive ? "true" : undefined}
      aria-hidden={props.interactive ? undefined : "true"}
      aria-label={props.interactive ? "Dani Dex" : undefined}
      role={props.interactive ? "button" : undefined}
      tabindex={props.interactive ? 0 : undefined}
    />
  );
}
