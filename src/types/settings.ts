export type LocaleString = Partial<Record<string, string>>

export type BooleanSetting = {
  type: "boolean";
  default: boolean;
  label: LocaleString;
  description?: LocaleString;
};

export type InputSetting = {
  type: "input";
  default: string;
  label: LocaleString;
  description?: LocaleString;
  placeholder?: LocaleString;
};

export type SelectOption = {
  value: string;
  label: LocaleString;
};

export type SelectSetting = {
  type: "select";
  default: string;
  options: SelectOption[];
  label: LocaleString;
  description?: LocaleString;
};

export type SliderSetting = {
  type: "slider";
  default: number;
  label: LocaleString;
  description?: LocaleString;
  min?: number;
  max?: number;
  step?: number;
};

export type PresenceSetting = BooleanSetting | InputSetting | SelectSetting | SliderSetting;

type ShorthandValue = boolean | string | number;

export type SettingDefinition = ShorthandValue | PresenceSetting;

type InferValue<T> =
  T extends BooleanSetting ? boolean
  : T extends InputSetting ? string
  : T extends SelectSetting ? string
  : T extends SliderSetting ? number
  : T extends boolean ? boolean
  : T extends string ? string
  : T extends number ? number
  : never;

export type InferSettings<T extends Record<string, SettingDefinition>> = {
  [K in keyof T]: InferValue<T[K]>;
};