import { describe, expect, it } from "vitest";
import { createMediaTimestamps } from "./media";

describe("createMediaTimestamps", () => {
  it("returns no timestamps while media is paused", () => {
    expect(
      createMediaTimestamps(
        { currentTime: 42, duration: 100, paused: true },
        1000,
      ),
    ).toEqual({});
  });

  it("derives elapsed and remaining timestamps from playback time", () => {
    expect(
      createMediaTimestamps(
        { currentTime: 42.8, duration: 100.9, paused: false },
        1000,
      ),
    ).toEqual({
      startTimestamp: 958,
      endTimestamp: 1058,
    });
  });

  it("omits the end timestamp for live media with an infinite duration", () => {
    expect(
      createMediaTimestamps(
        {
          currentTime: 42.8,
          duration: Number.POSITIVE_INFINITY,
          paused: false,
        },
        1000,
      ),
    ).toEqual({
      startTimestamp: 958,
      endTimestamp: undefined,
    });
  });
});
