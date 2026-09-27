import type { SkeletonBuilder } from "./roof-geometry";

let loading: Promise<SkeletonBuilder> | null = null;

/**
 * Lazily load the CGAL straight-skeleton Wasm (≈1 MB, inlined in the bundle).
 * Client only — the package's UMD wrapper touches `self` at import time.
 */
export function loadSkeletonBuilder(): Promise<SkeletonBuilder> {
  loading ??= import("straight-skeleton")
    .then(async (mod) => {
      // UMD/CJS package: named export in ESM builds, `default` under some interop.
      type Api = Pick<typeof mod, "SkeletonBuilder">;
      const ns = mod as unknown as Api & { default?: Api };
      const { SkeletonBuilder } = ns.default ?? ns;
      await SkeletonBuilder.init();
      return (rings: number[][][]) =>
        SkeletonBuilder.buildFromPolygon(rings) as ReturnType<SkeletonBuilder>;
    })
    .catch((err) => {
      loading = null;
      throw err;
    });
  return loading;
}
