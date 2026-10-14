"use client";

import { useId, useState, type ReactNode } from "react";

export type Tab = {
  id: string;
  label: string;
  sublabel: string;
  count: number;
  panel: ReactNode;
};

export function ClassTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0]?.id);
  const baseId = useId();

  return (
    <div>
      <div role="tablist" aria-label="Klasser" className="grid grid-cols-3 gap-2">
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
              className={`flex flex-col items-center rounded-t-3xl border-2 border-b-0 px-2 pb-2 pt-3 transition ${
                selected
                  ? "border-mint bg-white"
                  : "border-transparent bg-mint-soft/70 hover:bg-mint-soft"
              }`}
            >
              <span className="flex items-center gap-1.5 font-display text-xl font-semibold sm:text-2xl">
                {tab.label}
                <span
                  className={`grid min-w-6 place-items-center rounded-full px-1.5 text-sm text-white ${
                    selected ? "bg-bubblegum" : "bg-plum-soft/60"
                  }`}
                >
                  {tab.count}
                </span>
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
          className="-mt-0.5 rounded-b-3xl rounded-tr-3xl border-2 border-mint bg-white p-3 sm:p-5"
        >
          {tab.panel}
        </div>
      ))}
    </div>
  );
}
