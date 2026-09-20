import type { PresenceData } from "#/types/presence";
export { PresenceType } from "#/types/presence";

type LocaleString = Partial<Record<string, string>>

export interface PresenceContext {
  setActivity(data: PresenceData): void;
  clearActivity(): void;
  storage: Map<string, unknown>;
  settings: Record<string, unknown>;
}

export interface PresenceFactory {
  init(ctx: PresenceContext): void;
  tick?(ctx: PresenceContext): void;
  destroy?(): void;
}

export interface Metadata {
  slug?: string;
  name: string;
  version?: string;
  author: { name: string; github?: string };
  contributors?: { name: string; github?: string }[];
  description: LocaleString;
  longDescription?: LocaleString;
  url: string[];
  regExp?: string;
  world?: "main" | "isolated";
  runAt?: "document_start" | "document_end" | "document_idle";
  color: string;
  category:
    | "streaming"
    | "music"
    | "video"
    | "social"
    | "gaming"
    | "tools"
    | "ai"
    | "learning"
    | "creator"
    | "other";
  features?: Record<string, string[]>;
  settings?: Record<string, unknown>;
  discordNative?: boolean;
  imageProxy?: {
    hostSuffixes: string[];
    headers?: Record<string, string>;
  };
}