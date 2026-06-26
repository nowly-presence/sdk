export type PresenceButton = {
  label: string;
  url: string;
};

export type PresenceData = {
  appName?: string;
  name?: string;
  details?: string;
  state?: string;
  startTimestamp?: number;
  endTimestamp?: number;
  largeImageKey?: string;
  largeImageText?: string;
  smallImageKey?: string;
  smallImageText?: string;
  type?: PresenceTypeValue;
  buttons?: PresenceButton[];
};

export const PresenceType = {
  Playing: 0,
  Streaming: 1,
  Listening: 2,
  Watching: 3,
  Competing: 5,
} as const;

export type PresenceTypeValue = typeof PresenceType[keyof typeof PresenceType];

export type PresenceEventName = "UpdateData" | "iFrameData";

export type UpdateDataContext<S extends Record<string, unknown> = Record<string, unknown>> = {
  settings: S;
};

export type ImageProxyService = string;