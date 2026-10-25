# @nowly/sdk

Build [Nowly](https://nowly.me) presences with typed activity data, settings, localization and small media/image helpers. The package describes the extension's presence API; it does not start a presence on its own. Use it in a presence script that the Nowly extension loads.

## Install

```sh
npm install @nowly/sdk
```

The package has no runtime dependencies. Its main entry exports types, `PresenceType` and helpers; metadata types are available separately from `@nowly/sdk/metadata`.

## Your first presence

In the [Nowly presences project](https://github.com/nowly-presence/presences), use CLI 1.7.0 or later and put definitions in `settings.ts`:

```ts
import type { PresenceSetting } from "@nowly/sdk"

export default {
  "show-title": {
    type: "boolean",
    default: true,
    label: { "en-US": "Show page title" },
  },
} satisfies Record<string, PresenceSetting>
```

In `presence.ts`, the CLI has already registered the settings automatically:

```ts
import { PresenceType } from "@nowly/sdk"

const presence = new Presence()

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

The CLI gives `settings.ts` complete priority over legacy inline `Presence.Settings({ ... })` definitions, without merging them. Invalid files fail the build; legacy definitions remain supported when the file is absent. Use declarative, JSON-compatible definitions without browser or Node APIs. No settings import or manual registration is needed. The CLI still produces `settings.json` and registers defaults for existing extensions; saved user values remain unchanged. Read values from `ctx.settings`, or use `getSetting<boolean>("show-title")` when you need an explicitly typed value.

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
- **Clickable text (SDK 1.7.0+):** `detailsUrl` links the primary line and `stateUrl` links the secondary line, independently of activity buttons. Both require a compatible extension and native host; older runtimes ignore them. Supply a verified public HTTPS destination for the corresponding text. Links are omitted when text is missing, the URL contains credentials, the URL is invalid, or its normalized length exceeds 2048 characters. Preserve query parameters needed to identify content, but never share access tokens, private chats, secret links, or hidden metadata. Privacy settings must omit both the text and its link.
- **Runtime typing:** `PresenceConstructor`, `PresenceInstance`, `PresenceAssets` and `UpdateDataContext` type the injected API and its `UpdateData` callback. An instance can register `UpdateData`/`iFrameData` listeners, `setActivity`, `clearActivity`, `getStrings`, `formatString`, `getSetting`, `info` and `error`.
- **Settings and frames:** `PresenceSetting`, `InferSettings`, `LocaleString` and the individual setting types cover boolean, input, select and slider settings. `IFrameConstructor`, `IFrameInstance` and `IFrameData` type nested-frame scripts.
- **Helpers:** `createMediaTimestamps(media)` returns an empty object for paused media or start/end timestamps for playing media (the end timestamp is `undefined` if duration is not finite). `createImageProxyUrl`, `createImageProxyPath` and asynchronous `createCachedImageProxyUrl` build image proxy URLs and may return `undefined`.
- **Metadata:** import `Metadata` from `@nowly/sdk/metadata`, not from the main entry.

See the [export list](https://github.com/nowly-presence/sdk/blob/stable/src/index.ts), [runtime interfaces](https://github.com/nowly-presence/sdk/blob/stable/src/types/instance.ts) and [metadata definition](https://github.com/nowly-presence/sdk/blob/stable/src/metadata.ts) for the exact signatures.

## Contributing

For a new or broken **presence**, use the [presences repository](https://github.com/nowly-presence/presences) rather than adding a site script to this SDK. For SDK type or helper changes, [open an issue](https://github.com/nowly-presence/sdk/issues) or [submit a pull request](https://github.com/nowly-presence/sdk/pulls) here. The source lives in [`src/`](https://github.com/nowly-presence/sdk/tree/stable/src); the package's `build` script runs `tsup`.

## License

[MIT](https://github.com/nowly-presence/sdk/blob/stable/LICENSE)
