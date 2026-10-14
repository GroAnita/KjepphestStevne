"use client";

import { useId, useState, type ReactNode } from "react";

export type Tab = {
  id: string;
  label: string;
  sublabel: string;
  count: number;
  panel: ReactNode;
};

const accents = {
  mint: {
    selected: "border-mint bg-white",
    idle: "border-transparent bg-mint-soft/70 hover:bg-mint-soft",
    panel: "border-mint",
  },
  lilac: {
    selected: "border-lilac bg-white",
    idle: "border-transparent bg-lilac-soft/70 hover:bg-lilac-soft",
    panel: "border-lilac",
  },
};

export function ClassTabs({
  tabs,
  accent,
}: {
  tabs: Tab[];
  accent: keyof typeof accents;
}) {
  const colors = accents[accent];
  const [active, setActive] = useState(tabs[0]?.id);
  const baseId = useId();

  return (
    <div>
      <div role="tablist" aria-label="Klasser" className="grid grid-cols-3 gap-2 pt-2">
        {tabs.map((tab) => {
          const selected = tab.id === active;
          return (
            <button
              key={tab.id}
              role="tab"
              id={`${baseId}-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${tab.id}`}
              onClick={() => setActive(tab.id)}
              className={`relative flex flex-col items-center rounded-t-3xl border-2 border-b-0 px-2 pb-2 pt-3 transition ${
                selected ? colors.selected : colors.idle
              }`}
            >
              <span className="whitespace-nowrap font-display text-lg font-semibold sm:text-2xl">
                {tab.label}
              </span>
              <span
                aria-label={`${tab.count} påmeldte`}
                className={`absolute -top-2 right-1 grid min-w-6 place-items-center rounded-full px-1.5 text-sm font-bold text-white sm:right-3 ${
                  selected ? "bg-bubblegum" : "bg-plum-soft/60"
                }`}
              >
                {tab.count}
              </span>
              <span className="text-xs text-plum-soft sm:text-sm">
                {tab.sublabel}
              </span>
            </button>
          );
        })}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${baseId}-panel-${tab.id}`}
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          hidden={tab.id !== active}
          className={`-mt-0.5 rounded-b-3xl rounded-tr-3xl border-2 bg-white p-3 sm:p-5 ${colors.panel}`}
        >
          {tab.panel}
        </div>
      ))}
    </div>
  );
}
