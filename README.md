# @nowly/sdk

Build [Nowly](https://nowly.me) presences with typed activity data, settings, localization and small media/image helpers. The package describes the extension's presence API; it does not start a presence on its own. Use it in a presence script that the Nowly extension loads.

## Install

```sh
npm install @nowly/sdk
```

The package has no runtime dependencies. Its main entry exports types, `PresenceType` and helpers; metadata types are available separately from `@nowly/sdk/metadata`.

## Your first presence

In a `presence.ts` in the [Nowly presences project](https://github.com/nowly-presence/presences), where the runtime globals are already declared:

```ts
import { PresenceType } from "@nowly/sdk"

const settings = Presence.Settings({
  "show-title": {
    type: "boolean",
    default: true,
    label: { "en-US": "Show page title" },
  },
})

const presence = new Presence(settings)

presence.on("UpdateData", async ({ settings }) => {
  await presence.setActivity({
    details: "Browsing",
    state: settings["show-title"] ? document.title : undefined,
    largeImageKey: Assets.Logo,
    type: PresenceType.Watching,
  })
})
```

`Presence` and `Assets` are **injected by the extension**, not imported from `@nowly/sdk`. `PresenceType` **is** a package export and must be imported. In a different TypeScript project, declare the injected globals using the exported `PresenceConstructor` and `PresenceAssets` types; installing the package alone does not supply those globals at runtime. The [presences project's global declarations](https://github.com/nowly-presence/presences/blob/stable/src/global.d.ts) show the pattern.

### Optional locale files

Inline strings are fine; no locale files or `getStrings()` call are required. If your presence has `locales/en-US.json`, for example:

```json
{
  "browsingPage": "Browsing {title}"
}
```

Import its shape as a type and request the current locale's strings:

```ts
import type enUS from "./locales/en-US.json"

const presence = new Presence()

presence.on("UpdateData", async () => {
  const strings = await presence.getStrings<typeof enUS>()
  await presence.setActivity({
    details: presence.formatString(strings.browsingPage, { title: document.title }),
  })
})
```

The type-only import gives editors the keys in the JSON file without importing that JSON at runtime. `formatString` replaces `{title}`-style placeholders; placeholders without a matching parameter remain unchanged.

## API at a glance

- **Activity:** `PresenceData` describes details, state, timestamps, images, activity type and buttons; `PresenceType` supplies the supported numeric activity types. `PresenceButton` and `PresenceTypeValue` are also exported.
- **Status text:** optional `statusDisplayType` selects the field shown in Discord's compact status: `0` for the activity name, `1` for state, or `2` for details. It does not replace the card's name, details or state. This requires an extension and native host that forward this field; older versions ignore it.
- **Runtime typing:** `PresenceConstructor`, `PresenceInstance`, `PresenceAssets` and `UpdateDataContext` type the injected API and its `UpdateData` callback. An instance can register `UpdateData`/`iFrameData` listeners, `setActivity`, `clearActivity`, `getStrings`, `formatString`, `getSetting`, `info` and `error`.
- **Settings and frames:** `PresenceSetting`, `InferSettings`, `LocaleString` and the individual setting types cover boolean, input, select and slider settings. `IFrameConstructor`, `IFrameInstance` and `IFrameData` type nested-frame scripts.
- **Helpers:** `createMediaTimestamps(media)` returns an empty object for paused media or start/end timestamps for playing media (the end timestamp is `undefined` if duration is not finite). `createImageProxyUrl`, `createImageProxyPath` and asynchronous `createCachedImageProxyUrl` build image proxy URLs and may return `undefined`.
- **Metadata:** import `Metadata` from `@nowly/sdk/metadata`, not from the main entry.

See the [export list](https://github.com/nowly-presence/sdk/blob/stable/src/index.ts), [runtime interfaces](https://github.com/nowly-presence/sdk/blob/stable/src/types/instance.ts) and [metadata definition](https://github.com/nowly-presence/sdk/blob/stable/src/metadata.ts) for the exact signatures.

## Contributing

For a new or broken **presence**, use the [presences repository](https://github.com/nowly-presence/presences) rather than adding a site script to this SDK. For SDK type or helper changes, [open an issue](https://github.com/nowly-presence/sdk/issues) or [submit a pull request](https://github.com/nowly-presence/sdk/pulls) here. The source lives in [`src/`](https://github.com/nowly-presence/sdk/tree/stable/src); the package's `build` script runs `tsup`.

## License

[MIT](https://github.com/nowly-presence/sdk/blob/stable/LICENSE)
