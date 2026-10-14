"use client";

import { withdrawEntry } from "@/app/entry-actions";

export function WithdrawButton({
  entryId,
  riderName,
}: {
  entryId: string;
  riderName: string;
}) {
  return (
    <form
      action={withdrawEntry.bind(null, entryId)}
      onSubmit={(e) => {
        if (!confirm(`Vil du melde av ${riderName}?`)) e.preventDefault();
      }}
    >
      <button
        type="submit"
        className="rounded-full px-3 py-1.5 text-sm font-bold text-berry ring-2 ring-blush transition hover:bg-blush"
      >
        Meld av
      </button>
    </form>
  );
}
