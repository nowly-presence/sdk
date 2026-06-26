import type { PresenceData, PresenceEventName, UpdateDataContext } from "@/types/presence"
import type { InferSettings, SettingDefinition } from "@/types/settings"

export type PresenceAssets = {
  readonly Logo: string;
  readonly Icon: string;
  readonly Thumbnail: string;
};

export type PresenceInstance<S extends Record<string, unknown> = Record<string, unknown>> = {
  on(eventName: "UpdateData", listener: (ctx: UpdateDataContext<S>) => void | Promise<void>): void;
  on(eventName: PresenceEventName, listener: (...args: unknown[]) => void | Promise<void>): void;
  setActivity(data: PresenceData): Promise<void>;
  clearActivity(): void;
  getStrings<T extends Record<string, string>>(strings: T): Promise<T>;
  getSetting<T extends string | boolean | number = string>(key?: string): Promise<T | undefined>;
  info(message: string): void;
  error(message: string): void;
};

export type PresenceConstructor = {
  new(): PresenceInstance;
  new<S extends Record<string, unknown>>(settings: S): PresenceInstance<S>;
  Settings: <T extends Record<string, SettingDefinition>>(definitions: T) => InferSettings<T>;
  Assets: <T extends Record<string, string>>(assets: T) => { [K in keyof T]: string };
};
