import { DANI_PICTURES } from "@openbot/brand/dani-pictures";
import { daniVariantForAvatar } from "@openbot/brand/dani-identity";
import { type AvatarMood, avatarMoodPresentation } from "@openbot/brand/bloub-avatar-motion";
import type { AvatarColor, AvatarHue } from "@openbot/contracts/ipc";
import { Image } from "expo-image";
import { memo } from "react";
import { useAgentActivity } from "@/features/workspace/components/use-agent-activity";
import { useMobileWorkspaceSelector } from "@/features/workspace/context/mobile-workspace-context";
import { agentActivityMood } from "@/features/workspace/model/agent-activity";
import { showsOnline } from "@/features/workspace/model/server-status";
import { AgentPhoto, type AgentPhotoProps } from "./agent-photo";
interface BloubAvatarProps extends AgentPhotoProps {
  agentId: string;
  hue: AvatarHue | null;
  color?: AvatarColor | null;
  seed: string;
  size?: number;
  animateIdle?: boolean;
  paused?: boolean;
  rings?: boolean;
}

type PlushTransition = "pop" | "cut";

export function BloubAvatar({
  activityMood,
  ...props
}: BloubAvatarProps & {
  activityMood?: AvatarMood;
}) {
  if (activityMood !== undefined) return <LiveBloubAvatar {...props} activityMood={activityMood} />;
  return <ChatBloubAvatar {...props} />;
}

function ChatBloubAvatar(props: BloubAvatarProps) {
  return <LiveBloubAvatar {...props} activityMood={agentActivityMood(useAgentActivity(props.agentId))} />;
}

function LiveBloubAvatar({
  agentId,
  serverId: hostId,
  avatarUrl,
  hue,
  color = null,
  seed,
  size = 54,
  animateIdle = true,
  paused = false,
  rings = false,
  activityMood,
}: BloubAvatarProps & { activityMood: AvatarMood }) {
  const serverId = useMobileWorkspaceSelector(
    (workspace) => hostId ?? workspace.agents.find((agent) => agent.id === agentId)?.serverId,
  );
  const disconnected = useMobileWorkspaceSelector(
    (workspace) => !workspace.servers.some((server) => server.id === serverId && showsOnline(server)),
  );
  return (
    <BloubAvatarPreview
      agentId={agentId}
      serverId={serverId}
      avatarUrl={avatarUrl}
      hue={hue}
      color={color}
      seed={seed}
      size={size}
      animateIdle={animateIdle}
      paused={paused}
      rings={rings}
      disconnected={disconnected}
      mood={disconnected ? "idle" : activityMood}
    />
  );
}

interface AvatarPreviewOptions {
  disconnected?: boolean;
  mood?: AvatarMood;
  transition?: PlushTransition;
}

export const BloubAvatarPreview = memo(function BloubAvatarPreview(
  props: Omit<BloubAvatarProps, "agentId"> & AgentPhotoProps & AvatarPreviewOptions,
) {
  const size = props.size ?? 54;
  return (
    <AgentPhoto
      {...props}
      size={size}
      rings={props.rings ? !props.disconnected && avatarMoodPresentation(props.mood ?? "idle").rings : undefined}
    >
      <PlushAvatar
        seed={props.seed}
        hue={props.hue}
        color={props.color ?? null}
        size={size}
        mood={props.mood}
        animateIdle={props.animateIdle}
        paused={props.paused}
        disconnected={props.disconnected}
        transition={props.transition}
      />
    </AgentPhoto>
  );
});

function PlushAvatar(props: {seed: string; hue: AvatarHue | null; color: AvatarColor | null; size: number; mood?: AvatarMood; animateIdle?: boolean; paused?: boolean; disconnected?: boolean; transition?: PlushTransition}) {
  const variant = daniVariantForAvatar(props.seed, props.color, props.hue);
  return <Image source={{uri: DANI_PICTURES[variant]}} contentFit="contain" recyclingKey={`dani-v1-${variant}`} style={{width:props.size,height:props.size,opacity:props.disconnected ? 0.5 : 1}} accessibilityLabel={variant === "dani" ? "Dani" : `Dani ${variant}`} />;
}

export const BloubAvatarThumbnail = memo(function BloubAvatarThumbnail(props: Omit<BloubAvatarProps, "agentId"> & AgentPhotoProps & { disconnected?: boolean }) {
  return <AgentPhoto {...props} size={props.size ?? 48}><AvatarThumbnail {...props} /></AgentPhoto>;
});
export const AvatarThumbnail = memo(function AvatarThumbnail(props: Omit<BloubAvatarProps, "agentId"> & { disconnected?: boolean; animateColor?: boolean }) {
  return <PlushAvatar seed={props.seed} hue={props.hue} color={props.color ?? null} size={props.size ?? 48} disconnected={props.disconnected} />;
});
export function thumbnailColor(color: string, disconnected: boolean) { return disconnected ? "#888888" : color; }
