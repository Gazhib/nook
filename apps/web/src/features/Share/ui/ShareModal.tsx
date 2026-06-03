"use client";

import { SketchButton } from "@/components/Button";
import { Modal, Select } from "antd";
import { useShare } from "../model/useShare";

const RoleOptions = ["Editor", "Owner", "Viewer"];

export const ShareModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const {
    visibility,
    handleChangeVisibility,
    isPublic,
    link,
    handleCopy,
    username,
    handleUsername,
    role,
    setRole,
    members,
    handleInvite,
  } = useShare();

  return (
    <Modal
      open={open}
      onCancel={onClose}
      closable={false}
      footer={null}
      centered
      width={460}
      styles={{
        mask: { background: "rgba(29, 26, 22, 0.35)" },
      }}
    >
      <div className="w-[460px] overflow-hidden rounded-lg bg-white font-body shadow-[0_4px_20px_rgba(0,0,0,0.10),0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="border-b border-hair px-6 py-5">
          <div className="font-display text-base font-medium text-ink">
            Invite to Studio apartment
          </div>
        </div>

        <div className="border-b border-hair p-6">
          {/* visibility toggle */}
          <div className="mb-4 flex items-center justify-between gap-4">
            <div
              role="radiogroup"
              aria-label="Room visibility"
              className="inline-flex shrink-0 rounded-md border border-hair p-0.5"
            >
              {(["private", "public"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  role="radio"
                  aria-checked={visibility === v}
                  onClick={handleChangeVisibility}
                  className={`cursor-pointer rounded-[5px] px-3 py-1 text-xs font-medium capitalize transition-colors ${
                    visibility === v
                      ? "bg-ink text-white"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {isPublic ? (
            <>
              {" "}
              <div className="flex gap-2">
                <div className="flex-1 rounded-md border border-hair bg-paper px-2.5 py-2 font-mono text-xs text-ink-2 truncate">
                  {link}
                </div>
                <div className="flex items-center gap-1.5 rounded-md border border-hair px-2.5 py-2 text-xs">
                  Can edit ▾
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <SketchButton
                  onClick={handleCopy}
                  primary
                  className="px-3.5 py-2 text-xs"
                >
                  Copy link
                </SketchButton>
              </div>{" "}
            </>
          ) : (
            <>
              <div className="flex gap-2">
                <input
                  placeholder="add by username"
                  value={username}
                  onChange={handleUsername}
                  className="flex-1 rounded-md border border-hair bg-paper px-2.5 py-2 font-mono text-xs text-ink-2 truncate"
                />
                <Select
                  options={RoleOptions.map((role) => {
                    return { label: role, value: role };
                  })}
                  onChange={(value) => setRole(value)}
                  value={role}
                  className="flex items-center gap-1.5 
              rounded-md border border-hair px-2.5 py-2 text-xs"
                />
              </div>
              <div className="mt-3 flex justify-end">
                <SketchButton
                  onClick={handleInvite}
                  primary
                  className="px-3.5 py-2 text-xs"
                >
                  Add to Room
                </SketchButton>
              </div>
            </>
          )}
        </div>

        <div className="px-6 py-4">
          <div className="mb-2.5 text-[11px] uppercase tracking-[0.6px] text-muted">
            Members · {members.length}
          </div>
          {members.map((m, i) => (
            <div
              key={m.username}
              className={`flex items-center gap-2.5 py-2 ${
                i === 0 ? "" : "border-t border-hair-2"
              }`}
            >
              {/* <SketchAvatar size={28} label={m.n[0]} color={m.c} /> */}
              <div className="flex-1 text-[13px] text-ink">{m.username}</div>
              <div className="text-xs text-ink-2">{m.role}</div>
            </div>
          ))}
        </div>

        <div className="border-t border-hair bg-paper px-6 py-3.5">
          <div className="text-[11px] text-muted">
            {isPublic
              ? "Anyone with the link can join as Editor."
              : "Sharing is off — invite members by username to grant access."}
          </div>
        </div>
      </div>
    </Modal>
  );
};
