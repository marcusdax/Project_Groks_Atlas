import { useEffect, useMemo, useState } from "react";
import { buildRoofModel, type RoofModel, type SkeletonBuilder } from "./roof-geometry";
import { loadSkeletonBuilder } from "./skeleton";
import type { MeasurementInput } from "./types";

export type RoofModelState =
  | { status: "loading"; model: null; error: null }
  | { status: "ready"; model: RoofModel; error: null }
  | { status: "error"; model: null; error: string };

/** Solve the roof for a measurement; recomputes when the outline or pitch changes. */
export function useRoofModel(input: MeasurementInput | undefined): RoofModelState {
  const [builder, setBuilder] = useState<SkeletonBuilder | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    loadSkeletonBuilder().then(
      (b) => live && setBuilder(() => b),
      (err: unknown) => live && setLoadError(err instanceof Error ? err.message : String(err)),
    );
    return () => {
      live = false;
    };
  }, []);

  const footprint = input?.footprint;
  const pitchRise = input?.pitchRise;
  const gableEdges = input?.gableEdges;

  return useMemo<RoofModelState>(() => {
    if (loadError) return { status: "error", model: null, error: loadError };
    if (!builder || !footprint || pitchRise === undefined) {
      return { status: "loading", model: null, error: null };
    }
    try {
      const model = buildRoofModel({ footprint, pitchRise, gableEdges }, builder);
      return { status: "ready", model, error: null };
    } catch (err) {
      return {
        status: "error",
        model: null,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }, [builder, loadError, footprint, pitchRise, gableEdges]);
}
