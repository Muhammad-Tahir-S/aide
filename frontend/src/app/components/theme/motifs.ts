import type { ComponentType, SVGProps } from "react";

import FernFronds from "@/shared/assets/icons/fern-fronds.svg?react";
import Fiddlehead from "@/shared/assets/icons/fiddlehead.svg?react";
import OliveBranch from "@/shared/assets/icons/olive-branch.svg?react";
import PineMushrooms from "@/shared/assets/icons/pine-mushrooms.svg?react";
import TeaLeaves from "@/shared/assets/icons/tea-leaves.svg?react";

export const MOTIF_IDS = [
  "pine-mushrooms",
  "fern-fronds",
  "olive-branch",
  "tea-leaves",
  "fiddlehead",
] as const;

export type MotifId = (typeof MOTIF_IDS)[number];

export const MOTIF_LABELS: Record<MotifId, string> = {
  "pine-mushrooms": "Pine & mushrooms",
  "fern-fronds": "Fern fronds",
  "olive-branch": "Olive branch",
  "tea-leaves": "Tea leaves",
  fiddlehead: "Fiddlehead",
};

export const MOTIF_COMPONENTS: Record<
  MotifId,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  "pine-mushrooms": PineMushrooms,
  "fern-fronds": FernFronds,
  "olive-branch": OliveBranch,
  "tea-leaves": TeaLeaves,
  fiddlehead: Fiddlehead,
};

export function isMotifId(value: string | null | undefined): value is MotifId {
  return MOTIF_IDS.includes(value as MotifId);
}

function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const current = next[i];
    const swap = next[j];
    if (current === undefined || swap === undefined) continue;
    next[i] = swap;
    next[j] = current;
  }
  return next;
}

export function shuffleMotifs(exclude?: MotifId): MotifId[] {
  const deck = shuffle([...MOTIF_IDS]);
  if (!exclude || deck.length < 2 || deck[0] !== exclude) return deck;

  const swapAt = deck.findIndex((id, index) => index > 0 && id !== exclude);
  if (swapAt > 0) {
    const first = deck[0];
    const swap = deck[swapAt];
    if (first !== undefined && swap !== undefined) {
      deck[0] = swap;
      deck[swapAt] = first;
    }
  }
  return deck;
}
