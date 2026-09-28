import type { EdgeKind } from "./roof-geometry";

/** Line colours shared by the plan, the 3D model and the map overlay. */
export const EDGE_COLORS: Record<EdgeKind, string> = {
  eave: "#8aa58a",
  rake: "#9d8ac4",
  ridge: "#c17a6e",
  hip: "#c4b59a",
  valley: "#6f9cc4",
};

export const EDGE_LABELS: Record<EdgeKind, string> = {
  eave: "Eaves",
  rake: "Rakes",
  ridge: "Ridges",
  hip: "Hips",
  valley: "Valleys",
};

export const EDGE_ORDER: EdgeKind[] = ["ridge", "hip", "valley", "eave", "rake"];
