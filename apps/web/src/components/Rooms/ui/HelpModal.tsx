"use client";

import { Modal } from "antd";

const shortcuts: { keys: string; label: string }[] = [
  { keys: "Space + drag", label: "Pan the canvas" },
  { keys: "Scroll", label: "Zoom in / out" },
  { keys: "Arrows", label: "Nudge selected item" },
  { keys: "Delete", label: "Remove selected item" },
  { keys: "Ctrl + Z / Y", label: "Undo / redo" },
];

export const HelpModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      closable={false}
      footer={null}
      centered
      width={440}
      styles={{
        mask: { background: "rgba(29, 26, 22, 0.35)" },
      }}
    >
      <div className="w-[440px] overflow-hidden rounded-lg bg-white font-body shadow-[0_4px_20px_rgba(0,0,0,0.10),0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="border-b border-hair px-6 py-5">
          <div className="font-display text-base font-medium text-ink">
            Help
          </div>
          <div className="mt-1 font-body text-[13px] text-muted">
            Keyboard shortcuts for the room canvas.
          </div>
        </div>

        <div className="border-b border-hair p-6">
          <div className="flex flex-col gap-2.5">
            {shortcuts.map((s) => (
              <div
                key={s.keys}
                className="flex items-center justify-between gap-4"
              >
                <span className="font-body text-[13px] text-ink-2">
                  {s.label}
                </span>
                <kbd className="rounded-[5px] border border-hair bg-paper px-2 py-1 font-mono text-[11px] text-ink">
                  {s.keys}
                </kbd>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 font-body text-[12px] text-muted">
          Built by one person, not a company. Questions?{" "}
          <a
            href="mailto:hello@nook.app"
            className="text-ink underline decoration-hair underline-offset-2 hover:decoration-ink"
          >
            hello@nook.app
          </a>
        </div>
      </div>
    </Modal>
  );
};
