import { Wordmark } from "../../Logo";

export const RoomsHeader = ()=> {
  return (
    <div className="flex h-12 shrink-0 items-center gap-4 border-b border-hair bg-white px-5">
      <Wordmark size={18} />
      <div className="flex-1" />
      <div className="font-body text-[13px] text-muted">Help</div>
    </div>
  );
}