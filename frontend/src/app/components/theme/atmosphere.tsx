import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

import { cn } from "@/shared/utils/cn";

import { MOTIF_MORPH_MS, useAtmosphere } from "./atmosphere-provider";
import { MOTIF_COMPONENTS, type MotifId } from "./motifs";

type Layer = {
  key: string;
  id: MotifId;
  phase: "enter" | "in" | "out";
};

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const MotifLayersContext = createContext<Layer[] | null>(null);

function MotifArt({
  id,
  phase,
  preserveAspectRatio,
}: {
  id: MotifId;
  phase: Layer["phase"];
  preserveAspectRatio: string;
}) {
  const Art = MOTIF_COMPONENTS[id];
  return (
    <div data-phase={phase} className="atmosphere-motif absolute inset-0">
      <Art
        preserveAspectRatio={preserveAspectRatio}
        className="h-full w-full"
      />
    </div>
  );
}

export function MotifStage({ children }: { children: ReactNode }) {
  const { motifId } = useAtmosphere();
  const [layers, setLayers] = useState<Layer[]>([
    { key: motifId, id: motifId, phase: "in" },
  ]);
  const [prevMotifId, setPrevMotifId] = useState(motifId);

  if (motifId !== prevMotifId) {
    setPrevMotifId(motifId);
    if (prefersReducedMotion()) {
      setLayers([{ key: motifId, id: motifId, phase: "in" }]);
    } else {
      setLayers((current) => [
        ...current.map((layer) =>
          layer.phase === "out" ? layer : { ...layer, phase: "out" as const },
        ),
        { key: `${prevMotifId}->${motifId}`, id: motifId, phase: "enter" },
      ]);
    }
  }

  useLayoutEffect(() => {
    if (!layers.some((layer) => layer.phase === "enter")) return;
    const frame = requestAnimationFrame(() => {
      setLayers((current) =>
        current.map((layer) =>
          layer.phase === "enter" ? { ...layer, phase: "in" } : layer,
        ),
      );
    });
    return () => cancelAnimationFrame(frame);
  }, [layers]);

  useEffect(() => {
    if (!layers.some((layer) => layer.phase === "out")) return;
    const timeout = window.setTimeout(() => {
      setLayers((current) => current.filter((layer) => layer.phase !== "out"));
    }, MOTIF_MORPH_MS);
    return () => window.clearTimeout(timeout);
  }, [layers]);

  return (
    <MotifLayersContext.Provider value={layers}>
      {children}
    </MotifLayersContext.Provider>
  );
}

function useMotifLayers() {
  const layers = useContext(MotifLayersContext);
  if (!layers) {
    throw new Error("Motif copies must render inside MotifStage");
  }
  return layers;
}

function MotifCopy({
  className,
  preserveAspectRatio,
}: {
  className?: string;
  preserveAspectRatio: string;
}) {
  const layers = useMotifLayers();

  return (
    <div className={cn("atmosphere-piece", className)} aria-hidden>
      {layers.map((layer) => (
        <MotifArt
          key={layer.key}
          id={layer.id}
          phase={layer.phase}
          preserveAspectRatio={preserveAspectRatio}
        />
      ))}
    </div>
  );
}

export function PageMotifs({
  occupyLeft = false,
  withSidebar = false,
}: {
  occupyLeft?: boolean;
  withSidebar?: boolean;
}) {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden text-primary-main"
      aria-hidden
    >
      <MotifCopy
        preserveAspectRatio="xMidYMax meet"
        className={cn(
          "page-motif-left absolute -bottom-8 -left-6 h-[min(48vh,380px)] w-[min(48vh,380px)]",
          withSidebar && "md:left-12",
          occupyLeft ? "opacity-0" : "opacity-(--atmosphere-opacity)",
        )}
      />
      <MotifCopy
        preserveAspectRatio="xMidYMin meet"
        className="page-motif-right absolute top-[54px] -right-8 h-[min(32vh,260px)] w-[min(32vh,260px)] rotate-12 opacity-[calc(var(--atmosphere-opacity)*0.65)]"
      />
    </div>
  );
}

export function SidebarAtmosphere() {
  return (
    <MotifCopy
      preserveAspectRatio="xMidYMax meet"
      className="sidebar-rail-atmosphere pointer-events-none absolute -bottom-6 -left-5 z-0 h-[min(38vh,240px)] w-[min(38vh,240px)] text-primary-main md:h-[min(34vh,220px)] md:w-[min(34vh,220px)]"
    />
  );
}

export default function Atmosphere() {
  return (
    <MotifStage>
      <PageMotifs />
    </MotifStage>
  );
}
