export const ZoomWidget = ({ scale = 1 }: { scale?: number }) => (
  <div
    aria-label="Canvas zoom"
    title="Scroll over the canvas to zoom"
    className="flex min-h-9 items-center gap-2 rounded-lg border border-hair bg-white px-3 text-muted shadow-sm"
  >
    <span className="text-[12px]" aria-hidden="true">
      ⌕
    </span>
    <output className="font-mono text-[10px]">
      {Math.round(scale * 100)}%
    </output>
  </div>
);
