import type { PresenceData } from "#/types/presence";

export const createMediaTimestamps = (
  media: Pick<HTMLMediaElement, "currentTime" | "duration" | "paused">,
  now = Math.floor(Date.now() / 1000),
): Partial<Pick<PresenceData, "startTimestamp" | "endTimestamp">> => {
  if (media.paused) return {};

  return {
    startTimestamp: now - Math.floor(media.currentTime),
    endTimestamp: Number.isFinite(media.duration)
      ? now + Math.floor(media.duration - media.currentTime)
      : undefined,
  };
};