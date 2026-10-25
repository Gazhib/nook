/**
 * Returns true when a keyboard event originates from a text-editing element
 * (input, textarea, or contenteditable). Canvas shortcuts attach to `window`,
 * so they must bail out when the user is typing — otherwise keys like Space,
 * Delete, the arrows, or Ctrl+Z get hijacked by the canvas instead of the field
 * (e.g. the room-name input).
 */
export const isEditableTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false;

  return (
    target.isContentEditable ||
    target.closest("input, textarea, select, button, a, [role='dialog']") !==
      null
  );
};
