// @vitest-environment node

import { describe, expect, it } from "vitest";
import { DEFAULT_ENERGY_OPTIONS, EnergyDetector, type EnergyEvent, frameLoudness } from "./voice-energy-detector";

const loud = new Float32Array(160).fill(0.2);
const quiet = new Float32Array(160).fill(0.001);

function feed(detector: EnergyDetector, frame: Float32Array, count: number): EnergyEvent[] {
  return Array.from({ length: count }, () => detector.push(frame)).filter((event) => event !== null);
}

describe("speech energy detector", () => {
  it("measures loudness", () => {
    expect(frameLoudness(new Float32Array(0))).toBe(0);
    expect(frameLoudness(loud)).toBeCloseTo(0.2, 5);
  });

  it("starts after a few loud frames and ends after a stretch of quiet", () => {
    const detector = new EnergyDetector();
    expect(feed(detector, quiet, 10)).toEqual([]);
    expect(feed(detector, loud, DEFAULT_ENERGY_OPTIONS.startFrames)).toEqual(["start"]);
    expect(detector.speaking).toBe(true);
    expect(feed(detector, quiet, DEFAULT_ENERGY_OPTIONS.endFrames - 1)).toEqual([]);
    expect(feed(detector, quiet, 1)).toEqual(["end"]);
    expect(detector.speaking).toBe(false);
  });

  it("ignores a single click and short pauses", () => {
    const detector = new EnergyDetector();
    expect(feed(detector, loud, 1)).toEqual([]);
    feed(detector, quiet, 1);
    expect(feed(detector, loud, 2)).toEqual([]);
    feed(detector, loud, 3);
    feed(detector, quiet, 5);
    expect(feed(detector, loud, 5)).toEqual([]);
    expect(detector.speaking).toBe(true);
  });
});
