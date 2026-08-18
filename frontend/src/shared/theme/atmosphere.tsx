import { useEffect, useLayoutEffect, useState } from "react";

import { MOTIF_COMPONENTS, type MotifId } from "@/shared/components/atmosphere";
import { cn } from "@/shared/lib/utils";

import { MOTIF_MORPH_MS, useAtmosphere } from "./atmosphere-provider";

type Layer = {
  key: string;
  id: MotifId;
  phase: "enter" | "in" | "out";
};

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

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

function MotifStage({
  motifId,
  className,
  preserveAspectRatio,
}: {
  motifId: MotifId;
  className?: string;
  preserveAspectRatio: string;
}) {
  const [layers, setLayers] = useState<Layer[]>([
    { key: motifId, id: motifId, phase: "in" },
  ]);

  useLayoutEffect(() => {
    setLayers((current) => {
      const visible = current.find((layer) => layer.phase !== "out");
      if (visible?.id === motifId) return current;
      if (prefersReducedMotion()) {
        return [{ key: motifId, id: motifId, phase: "in" }];
      }
      return [
        ...current.map((layer) =>
          layer.phase === "out" ? layer : { ...layer, phase: "out" as const },
        ),
        { key: `${motifId}-${Date.now()}`, id: motifId, phase: "enter" },
      ];
    });
  }, [motifId]);

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
    <div className={cn("atmosphere-piece", className)}>
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

export function SidebarAtmosphere({ visible }: { visible: boolean }) {
  const { motifId } = useAtmosphere();

  return (
    <div
      className={cn(
        "atmosphere-piece pointer-events-none absolute -bottom-6 -left-5 z-0 h-[min(38vh,240px)] w-[min(38vh,240px)] text-primary-main transition-opacity duration-700 ease-out motion-reduce:transition-none md:h-[min(34vh,220px)] md:w-[min(34vh,220px)]",
        visible ? "opacity-(--atmosphere-opacity)" : "opacity-0",
      )}
      aria-hidden
    >
      <MotifStage
        motifId={motifId}
        preserveAspectRatio="xMidYMax meet"
        className="h-full w-full"
      />
    </div>
  );
}

export default function Atmosphere({
  sidebarOpen = false,
  withSidebar = false,
}: {
  sidebarOpen?: boolean;
  withSidebar?: boolean;
}) {
  const { motifId } = useAtmosphere();
  const showCornerLeft = !withSidebar || !sidebarOpen;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden text-primary-main"
      aria-hidden
    >
      <MotifStage
        motifId={motifId}
        preserveAspectRatio="xMidYMax meet"
        className={cn(
          "atmosphere-piece absolute -bottom-8 -left-6 h-[min(48vh,380px)] w-[min(48vh,380px)] transition-opacity duration-700 ease-out motion-reduce:transition-none",
          withSidebar && "md:left-31",
          showCornerLeft ? "opacity-(--atmosphere-opacity)" : "opacity-0",
        )}
      />
      <MotifStage
        motifId={motifId}
        preserveAspectRatio="xMidYMin meet"
        className={cn(
          "atmosphere-piece absolute -top-10 -right-8 h-[min(32vh,260px)] w-[min(32vh,260px)] rotate-12 transition-opacity duration-700 ease-out motion-reduce:transition-none",
          withSidebar && sidebarOpen
            ? "opacity-0 md:opacity-[calc(var(--atmosphere-opacity)*0.65)]"
            : "opacity-[calc(var(--atmosphere-opacity)*0.65)]",
        )}
      />
    </div>
  );
}
