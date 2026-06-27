# @nowly/sdk

Type definitions and helpers for [Nowly](https://nowly.me) presences.

## Install

```bash
npm install @nowly/sdk
```

Zero dependencies.

## Usage

### Presence scripts

```typescript
import { Presence, PresenceType } from "@nowly/sdk";

const presence = new Presence({
  Settings({
    "show-button": {
      title: "Show button",
      description: "Display a button on Discord",
      type: "boolean",
      value: true,
    },
  }),
});

presence.on("UpdateData", async () => {
  presence.setActivity({
    details: "Browsing",
    state: "Some page",
    largeImageKey: "logo",
    type: PresenceType.Watching,
  });
});
```

### Metadata

```typescript
import type { Metadata } from "@nowly/sdk/metadata";

const meta: Metadata = {
  name: "YouTube",
  description: {
    "en-US": "YouTube presence"
  },
  longDescription: {
    "en-US": "A presence for YouTube that shows what you're watching."
  },
  color: "#FF0000",
  category: "video",
  url: ["youtube.com"],
  assets: {
    logo: "logo.png",
    icon: "icon.png",
    thumbnail: "thumbnail.jpg",
  },
};
```

## API

### `@nowly/sdk`

| Export | Description |
|---|---|
| `PresenceData` | Activity data sent to Discord |
| `PresenceType` | `Watching`, `Playing`, `Listening`, `Streaming`, `Competing` |
| `PresenceButton` | Button with label + URL |
| `PresenceSetting` / `InferSettings` | Setting types (boolean, input, select, slider) |
| `PresenceInstance` / `PresenceConstructor` | Presence runtime types |
| `createMediaTimestamps()` | Compute `start`/`end` from media elements |
| `createImageProxyUrl()` | Build image proxy URL |
| `createImageProxyPath()` | Build image proxy path |
| `createCachedImageProxyUrl()` | Build cached image proxy URL |

### `@nowly/sdk/metadata`

| Export | Description |
|---|---|
| `Metadata` | Presence metadata schema |
| `PresenceContext` | Runtime context for factory-based presences |
| `PresenceFactory` | Alternative presence interface |

## License

MIT — see [LICENSE](./LICENSE).