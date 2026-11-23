import { DANI_MARK_URI } from "./dani-mark";
export type AppLogoAnimation = "none" | "blink" | "look-around" | "surprised";
export type AppLogoVariant = "production" | "dev" | "preview";
export interface AppLogoProps { variant: AppLogoVariant; animation?: AppLogoAnimation; interactive?: boolean; pointerArea?: HTMLElement; class?: string; }
export function AppLogo(props: AppLogoProps) {
  return <svg class={["app-logo", props.class].filter(Boolean).join(" ")} data-variant={props.variant} viewBox="0 0 1024 1024" role="img" aria-label="Dani Dex"><image href={DANI_MARK_URI} width="1024" height="1024" /></svg>;
}
