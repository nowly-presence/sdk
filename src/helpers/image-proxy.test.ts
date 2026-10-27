import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createCachedImageProxyUrl,
  createImageProxyPath,
  createImageProxyUrl,
} from "./image-proxy";

afterEach(() => vi.unstubAllGlobals());

describe("image proxy URL helpers", () => {
  it("returns short HTTPS URLs and rejects unsupported or overlong URLs", () => {
    expect(
      createImageProxyUrl("netflix", "https://images.example/poster.jpg"),
    ).toBe(
      "https://api.nowly.me/i?u=https%3A%2F%2Fimages.example%2Fposter.jpg",
    );
    expect(
      createImageProxyUrl("netflix", "http://images.example/poster.jpg"),
    ).toBeUndefined();
    expect(
      createImageProxyUrl(
        "netflix",
        `https://images.example/${"x".repeat(300)}`,
      ),
    ).toBeUndefined();
  });

  it("encodes path components and rejects missing or oversized parts", () => {
    expect(createImageProxyPath("My Service", "poster one", 7)).toBe(
      "https://api.nowly.me/image-proxy/My%20Service/poster%20one/7",
    );
    expect(createImageProxyPath("netflix", "", 7)).toBeUndefined();
    expect(createImageProxyPath("netflix", "x".repeat(300))).toBeUndefined();
  });

  it("caches valid service URLs and refreshes them inside the expiry grace period", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      Response.json({
        url: "https://cdn.nowly.me/cached/image",
        expiresIn: 300,
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const first = await createCachedImageProxyUrl(
      "test-cache",
      "https://images.example/cached.jpg",
    );
    const second = await createCachedImageProxyUrl(
      "test-cache",
      "https://images.example/cached.jpg",
    );

    expect(first).toBe("https://cdn.nowly.me/cached/image");
    expect(second).toBe(first);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("rejects invalid proxy responses and network errors", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(
        Response.json({ url: "http://cdn.nowly.me/image" }),
      )
      .mockResolvedValueOnce(new Response(null, { status: 503 }))
      .mockRejectedValueOnce(new Error("offline"));
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      createCachedImageProxyUrl(
        "invalid-scheme",
        "https://images.example/a.jpg",
      ),
    ).resolves.toBeUndefined();
    await expect(
      createCachedImageProxyUrl("http-error", "https://images.example/b.jpg"),
    ).resolves.toBeUndefined();
    await expect(
      createCachedImageProxyUrl("offline", "https://images.example/c.jpg"),
    ).resolves.toBeUndefined();
  });
});
