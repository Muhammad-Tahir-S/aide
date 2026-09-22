import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocation } from "react-router";

import { isMotifId, type MotifId, shuffleMotifs } from "./motifs";

const DEFAULT_MOTIF = "fern-fronds";
const MOTIF_STORAGE_KEY = "aide-atmosphere-motif";
const HOUR_MS = 60 * 60 * 1000;

type MotifState = {
  current: MotifId;
  deck: MotifId[];
  changedAt: number;
};

type AtmosphereContextValue = {
  motifId: MotifId;
};

const AtmosphereContext = createContext<AtmosphereContextValue | null>(null);

function readMotifState(): MotifState {
  const fallback: MotifState = {
    current: DEFAULT_MOTIF,
    deck: shuffleMotifs(DEFAULT_MOTIF).filter((id) => id !== DEFAULT_MOTIF),
    changedAt: Date.now(),
  };

  try {
    const raw = sessionStorage.getItem(MOTIF_STORAGE_KEY);
    if (!raw) {
      sessionStorage.setItem(MOTIF_STORAGE_KEY, JSON.stringify(fallback));
      return fallback;
    }
    const parsed = JSON.parse(raw) as Partial<MotifState>;
    if (!isMotifId(parsed.current) || typeof parsed.changedAt !== "number") {
      sessionStorage.setItem(MOTIF_STORAGE_KEY, JSON.stringify(fallback));
      return fallback;
    }
    const deck = Array.isArray(parsed.deck)
      ? parsed.deck.filter(isMotifId)
      : [];
    return {
      current: parsed.current,
      deck,
      changedAt: parsed.changedAt,
    };
  } catch {
    return fallback;
  }
}

function writeMotifState(state: MotifState) {
  sessionStorage.setItem(MOTIF_STORAGE_KEY, JSON.stringify(state));
}

function takeNext(state: MotifState): MotifState {
  const remaining = state.deck.filter((id) => id !== state.current);
  const nextId =
    remaining[0] ?? shuffleMotifs(state.current)[0] ?? DEFAULT_MOTIF;
  const leftover = remaining.slice(1);
  const deck =
    leftover.length > 0
      ? leftover
      : shuffleMotifs(nextId).filter((id) => id !== nextId);

  return {
    current: nextId,
    deck,
    changedAt: Date.now(),
  };
}

function maybeAdvanceMotif(): MotifState | null {
  const state = readMotifState();
  if (Date.now() - state.changedAt < HOUR_MS) return null;
  const next = takeNext(state);
  writeMotifState(next);
  return next;
}

export const MOTIF_MORPH_MS = 2800;

export function AtmosphereProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [motifId, setMotifId] = useState<MotifId>(
    () => readMotifState().current,
  );
  const [seenPath, setSeenPath] = useState(pathname);

  if (pathname !== seenPath) {
    setSeenPath(pathname);
    const next = maybeAdvanceMotif();
    if (next) setMotifId(next.current);
  }

  useEffect(() => {
    let timeoutId: number | undefined;

    const clear = () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      timeoutId = undefined;
    };

    const tick = () => {
      const next = maybeAdvanceMotif();
      if (next) setMotifId(next.current);
    };

    const arm = () => {
      clear();
      if (document.hidden) return;
      const remaining = HOUR_MS - (Date.now() - readMotifState().changedAt);
      timeoutId = window.setTimeout(tick, Math.max(0, remaining));
    };

    arm();
    const onVisibility = () => {
      if (document.hidden) clear();
      else arm();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clear();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [motifId]);

  return (
    <AtmosphereContext.Provider value={{ motifId }}>
      {children}
    </AtmosphereContext.Provider>
  );
}

export function useAtmosphere() {
  const context = useContext(AtmosphereContext);
  if (!context) {
    throw new Error("useAtmosphere must be used within an AtmosphereProvider");
  }
  return context;
}
