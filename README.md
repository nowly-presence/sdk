# @nowly/sdk

Type definitions and helpers for [Nowly](https://nowly.me) presences.

## Install

```bash
npm install @nowly/sdk
```

Zero dependencies.

## Presence scripts

`Presence` and `Assets` are globals injected by the extension at runtime — no import needed.

```typescript
const settings = Presence.Settings({
  "show-details": {
    type: "boolean",
    default: true,
    label: { "en-US": "Show details" },
    description: { "en-US": "Display page details on Discord" },
  },
})

const presence = new Presence(settings)

presence.on("UpdateData", (ctx) => {
  presence.setActivity({
    details: "Browsing",
    state: "Some page",
    largeImageKey: Assets.Logo,
    type: PresenceType.Watching,
  })
})
```

### Typed localized strings

Language packs are optional. A presence that uses them can infer its string keys directly
from `languages/en-US.json`, without generating TypeScript files:

```typescript
import type enUS from "./languages/en-US.json"

const presence = new Presence()

presence.on("UpdateData", async () => {
  const strings = await presence.getStrings<typeof enUS>()

  await presence.setActivity({
    details: strings.browsing,
  })
})
```

The type-only import is removed from the bundle. It gives editors autocomplete for every
key declared in `en-US.json` and makes unknown keys a TypeScript error. Presences without
language packs can continue using inline strings and do not need to call `getStrings()`.

## Helpers

```typescript
import { createMediaTimestamps, PresenceType } from "@nowly/sdk"
import type { PresenceData } from "@nowly/sdk"

createMediaTimestamps(videoElement)
// => { startTimestamp: number, endTimestamp: number } | {}
```

## API

| Export | Kind | Description |
|---|---|---|
| `PresenceData` | type | Activity data sent to Discord |
| `PresenceType` | const | `{ Playing: 0, Streaming: 1, Listening: 2, Watching: 3, Competing: 5 }` |
| `PresenceTypeValue` | type | `0 \| 1 \| 2 \| 3 \| 5` |
| `PresenceButton` | type | `{ label: string, url: string }` |
| `PresenceSetting` | type | Boolean, Input, Select, or Slider setting |
| `InferSettings` | type | Infers the settings object shape from definitions |
| `LocaleString` | type | `Partial<Record<string, string>>` |
| `UpdateDataContext` | type | Context received in `UpdateData` listener |
| `PresenceInstance` | type | Runtime presence instance interface |
| `PresenceConstructor` | type | Presence class interface |
| `PresenceAssets` | type | `{ Logo, Icon, Thumbnail }` |
| `createMediaTimestamps()` | fn | Compute start/end timestamps from media elements |
| `createImageProxyUrl()` | fn | Build direct image proxy URL |
| `createImageProxyPath()` | fn | Build image proxy URL from parts |
| `createCachedImageProxyUrl()` | fn | Build cached image proxy URL (async) |

## License

[MIT](./LICENSE)
