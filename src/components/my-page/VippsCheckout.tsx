"use client";

import { useId, useState } from "react";

// Norwegian mobile numbers: 8 digits starting with 4 or 9.
function cleanPhone(value: string) {
  return value.replace(/[\s+]/g, "").replace(/^(0047|47)(?=\d{8}$)/, "");
}
const isMobile = (value: string) => /^[49]\d{7}$/.test(cleanPhone(value));

// "Betal med Vipps". Shown now, but switched off until the club's Vipps
// business agreement is connected; then pass enabled and wire up onPay.
export function VippsCheckout({
  total,
  enabled = false,
}: {
  total: number;
  enabled?: boolean;
}) {
  const id = useId();
  const [phone, setPhone] = useState("");
  const showError = phone.trim() !== "" && !isMobile(phone);

  return (
    <div className="rounded-2xl border-2 border-vipps/30 bg-white px-4 py-5 sm:px-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-xl font-semibold">
          Betal med <span className="text-vipps">Vipps</span>
        </h3>
        {!enabled && (
          <span className="rounded-full bg-sunny/60 px-3 py-1 text-sm font-bold">
            Kommer snart
          </span>
        )}
      </div>

      <label htmlFor={id} className="mt-3 block font-bold">
        Mobilnummer
      </label>
      <div className="mt-1.5 flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center rounded-2xl border-2 border-lilac-soft bg-white focus-within:border-vipps focus-within:ring-4 focus-within:ring-vipps/20">
          <span className="pl-4 pr-2 font-semibold text-plum-soft">+47</span>
          <input
            id={id}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="123 45 678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            aria-invalid={showError}
            aria-describedby={`${id}-hint`}
            className="w-full min-w-0 rounded-2xl bg-transparent py-3 pr-4 text-lg outline-none"
          />
        </div>
        <button
          type="button"
          disabled={!enabled || !isMobile(phone)}
          title={enabled ? undefined : "Betaling med Vipps kommer snart"}
          className="rounded-full bg-vipps px-6 py-3 font-display text-lg font-semibold text-white shadow-[0_4px_0_#c43d10] transition active:translate-y-1 active:shadow-[0_1px_0_#c43d10] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:active:translate-y-0"
        >
          Betal {total} kr med Vipps
        </button>
      </div>
      <p
        id={`${id}-hint`}
        className={`mt-2 text-sm ${showError ? "font-semibold text-berry" : "text-plum-soft"}`}
      >
        {showError
          ? "Skriv et norsk mobilnummer med 8 siffer."
          : enabled
            ? "Du får en melding i Vipps-appen for å godkjenne betalingen."
            : "Snart kan du betale direkte i Vipps-appen her. Inntil videre: se under."}
      </p>
    </div>
  );
}
