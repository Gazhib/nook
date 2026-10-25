"use client";

import { Modal } from "antd";
import { Icon } from "../../Icon";

const shortcuts = [
  { keys: "Space + drag", label: "Pan the canvas" },
  { keys: "Scroll", label: "Zoom in or out" },
  { keys: "Arrow keys", label: "Move selected piece" },
  { keys: "Delete", label: "Remove selected piece" },
  { keys: "Ctrl / ⌘ + Z", label: "Undo" },
  { keys: "Ctrl + Y / ⌘ + Shift + Z", label: "Redo" },
];

export const HelpModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => (
  <Modal
    open={open}
    onCancel={onClose}
    closable={false}
    footer={null}
    centered
    width={480}
    className="nook-modal"
    styles={{ mask: { background: "rgba(28,43,32,.35)" } }}
  >
    <div className="font-body text-ink">
      <div className="flex items-start justify-between border-b border-hair px-6 py-6">
        <div>
          <p className="eyebrow mb-2 text-muted">A few handy moves</p>
          <h2 className="font-display text-[28px] tracking-tight">
            Make yourself at home.
          </h2>
        </div>
        <button
          type="button"
          aria-label="Close help"
          onClick={onClose}
          className="rounded-lg p-2 text-muted hover:bg-fill"
        >
          <Icon name="close" size={18} />
        </button>
      </div>
      <div className="px-6 py-3">
        {shortcuts.map((s) => (
          <div
            key={s.label}
            className="flex flex-wrap items-center justify-between gap-3 border-b border-hair-2 py-4 last:border-0"
          >
            <span className="text-xs text-ink-2">{s.label}</span>
            <kbd className="rounded-md border border-hair bg-paper px-2 py-1.5 font-mono text-[10px] text-muted">
              {s.keys}
            </kbd>
          </div>
        ))}
      </div>
      <p className="border-t border-hair bg-paper px-6 py-4 text-[11px] leading-relaxed text-muted">
        Click a piece in the library to place it. Select it on the canvas to
        move, resize, or rotate it.
      </p>
    </div>
  </Modal>
);
