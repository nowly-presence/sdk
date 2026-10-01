export type IFrameData = Record<string, unknown>;

export type IFrameInstance = {
  on(eventName: "UpdateData", listener: () => void | Promise<void>): void;
  send(data: IFrameData): void;
  getUrl(): Promise<string>;
};

export type IFrameConstructor = {
  new(): IFrameInstance;
};
