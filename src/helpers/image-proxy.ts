import type { ImageProxyService } from "#/types/presence";

const DISCORD_IMAGE_KEY_MAX_LENGTH = 300;
const IMAGE_PROXY_BASE_URL = "https://api.nowly.me/image-proxy";
const SHORT_IMAGE_PROXY_BASE_URL = "https://api.nowly.me/i";
const CACHED_IMAGE_PROXY_BASE_URL = "https://api.nowly.me/images-proxy";
const CACHED_IMAGE_REFRESH_GRACE_MS = 30 * 1000;

type CachedImageProxyEntry = {
  url: string;
  expiresAt: number;
};

const cachedImageProxyUrls = new Map<string, CachedImageProxyEntry>();

export const createImageProxyUrl = (
  service: ImageProxyService,
  imageUrl: string | undefined,
): string | undefined => {
  if (!imageUrl?.startsWith("https://")) return undefined;
  const proxyUrl = `${SHORT_IMAGE_PROXY_BASE_URL}?u=${encodeURIComponent(imageUrl)}`;
  return proxyUrl.length <= DISCORD_IMAGE_KEY_MAX_LENGTH ? proxyUrl : undefined;
};

export const createImageProxyPath = (
  service: ImageProxyService,
  ...parts: Array<string | number | undefined>
): string | undefined => {
  if (parts.some(part => part === undefined || String(part).trim() === "")) return undefined;
  const path = [
    IMAGE_PROXY_BASE_URL,
    encodeURIComponent(service),
    ...parts.map(part => encodeURIComponent(String(part))),
  ].join("/");
  return path.length <= DISCORD_IMAGE_KEY_MAX_LENGTH ? path : undefined;
};

export const createCachedImageProxyUrl = async (
  service: ImageProxyService,
  imageUrl: string | undefined,
): Promise<string | undefined> => {
  if (!imageUrl?.startsWith("https://")) return undefined;

  const cacheKey = `${service}:${imageUrl}`;
  const cached = cachedImageProxyUrls.get(cacheKey);
  if (cached && cached.expiresAt - CACHED_IMAGE_REFRESH_GRACE_MS > Date.now()) {
    return cached.url;
  }

  try {
    const response = await fetch(CACHED_IMAGE_PROXY_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ service, url: imageUrl }),
    });

    if (!response.ok) return undefined;

    const data = await response.json() as { url?: string; expiresIn?: number };
    if (!data.url?.startsWith("https://") || data.url.length > DISCORD_IMAGE_KEY_MAX_LENGTH) {
      return undefined;
    }

    cachedImageProxyUrls.set(cacheKey, {
      url: data.url,
      expiresAt: Date.now() + Math.max(1, data.expiresIn ?? 300) * 1000,
    });

    return data.url;
  } catch {
    return undefined;
  }
};