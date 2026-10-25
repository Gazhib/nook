"use client";

import { Modal } from "antd";
import { SketchButton } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { useShare } from "../model/useShare";
import { Role } from "@nook/shared";

const roles: Role[] = ["editor", "viewer", "owner"];

export const ShareModal = ({
  open,
  onClose,
  currentUserRole,
}: {
  open: boolean;
  onClose: () => void;
  currentUserRole: Role | null;
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
    destroyOnHidden
  >
    {open && (
      <ShareContent onClose={onClose} currentUserRole={currentUserRole} />
    )}
  </Modal>
);

function ShareContent({
  onClose,
  currentUserRole,
}: {
  onClose: () => void;
  currentUserRole: Role | null;
}) {
  const {
    visibility,
    handleChangeVisibility,
    isPublic,
    link,
    handleCopy,
    username,
    setUsername,
    role,
    setRole,
    members,
    handleInvite,
    handleChangeRole,
    handleRemove,
    canManage,
    pending,
    isLoading,
    error,
  } = useShare(true, currentUserRole);
  return (
    <div className="font-body text-ink">
      <div className="flex items-start justify-between border-b border-hair px-6 py-6">
        <div>
          <p className="eyebrow mb-2 text-muted">Better together</p>
          <h2 className="font-display text-[30px] tracking-tight">
            Share your space.
          </h2>
          <p className="mt-2 text-xs text-muted">
            A second pair of eyes. A few more possibilities.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close sharing settings"
          className="rounded-lg p-2 text-muted hover:bg-fill"
        >
          <Icon name="close" size={18} />
        </button>
      </div>
      {isLoading ? (
        <p role="status" className="p-6 text-sm text-muted">
          Loading sharing settings…
        </p>
      ) : error ? (
        <p role="alert" className="p-6 text-sm text-red-700">
          {error}
        </p>
      ) : (
        <>
          <div className="border-b border-hair px-6 py-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-medium">Room access</span>
              {canManage ? (
                <div
                  role="group"
                  aria-label="Room visibility"
                  className="inline-flex rounded-lg border border-hair bg-paper p-1"
                >
                  {(["private", "public"] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      disabled={pending}
                      aria-pressed={visibility === v}
                      onClick={() => void handleChangeVisibility(v)}
                      className={`rounded-md px-3 py-1.5 text-[11px] capitalize disabled:opacity-50 ${visibility === v ? "bg-white text-accent shadow-sm" : "text-muted hover:text-ink"}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              ) : (
                <span className="rounded-md bg-fill px-3 py-1.5 text-[11px] capitalize text-muted">
                  {visibility}
                </span>
              )}
            </div>
            <p className="text-xs leading-relaxed text-muted">
              {isPublic
                ? "Anyone signed in with the link can open and edit this room."
                : "Only invited members can open this room."}
            </p>
            {isPublic && (
              <div className="mt-4 flex gap-2">
                <label className="min-w-0 flex-1">
                  <span className="sr-only">Room link</span>
                  <input
                    readOnly
                    value={link}
                    onFocus={(e) => e.target.select()}
                    className="nook-input !bg-paper !text-[11px]"
                  />
                </label>
                <SketchButton
                  onClick={() => void handleCopy()}
                  className="!px-3 !text-xs"
                >
                  Copy link
                </SketchButton>
              </div>
            )}
            {canManage && (
              <form
                className="mt-5 border-t border-hair-2 pt-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  void handleInvite();
                }}
              >
                <label
                  htmlFor="invite-username"
                  className="mb-2 block text-xs font-medium"
                >
                  Invite by username
                </label>
                <div className="flex flex-wrap gap-2">
                  <input
                    id="invite-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    maxLength={24}
                    placeholder="Their username"
                    className="nook-input !w-auto min-w-0 flex-1"
                    disabled={pending}
                  />
                  <select
                    aria-label="Invitation role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    disabled={pending}
                    className="nook-select !px-2"
                  >
                    {roles.map((r) => (
                      <option value={r} key={r}>
                        {r[0].toUpperCase() + r.slice(1)}
                      </option>
                    ))}
                  </select>
                  <SketchButton
                    type="submit"
                    primary
                    disabled={pending || !username.trim()}
                    className="!px-3 !text-xs"
                  >
                    Invite
                  </SketchButton>
                </div>
              </form>
            )}
          </div>
          <div className="max-h-[240px] overflow-y-auto px-6 py-5">
            <p className="eyebrow mb-3 text-muted">
              People with access · {members.length}
            </p>
            {members.map((member) => (
              <div
                key={member.userId}
                className="flex items-center gap-2.5 border-b border-hair-2 py-3 last:border-0"
              >
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-fill-2 font-display text-sm text-accent"
                >
                  {member.username.charAt(0).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1 truncate text-xs">
                  {member.username}
                </span>
                {canManage && member.role !== "owner" ? (
                  <>
                    <select
                      aria-label={`Role for ${member.username}`}
                      value={member.role}
                      onChange={(e) =>
                        void handleChangeRole(
                          member.userId,
                          e.target.value as Role,
                        )
                      }
                      disabled={pending}
                      className="nook-select !px-1 !py-2 !text-[10px]"
                    >
                      {roles.map((r) => (
                        <option value={r} key={r}>
                          {r[0].toUpperCase() + r.slice(1)}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => void handleRemove(member.userId)}
                      aria-label={`Remove ${member.username}`}
                      className="rounded p-2 text-muted hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                    >
                      <Icon name="close" size={14} />
                    </button>
                  </>
                ) : (
                  <span className="text-[10px] capitalize text-muted">
                    {member.role}
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 border-t border-hair bg-paper px-6 py-4 text-[10px] text-muted">
            <Icon name="lock" size={13} />
            {canManage
              ? "You're in control of who can access this room."
              : "The room's owner manages invitations and access."}
          </div>
        </>
      )}
    </div>
  );
}
