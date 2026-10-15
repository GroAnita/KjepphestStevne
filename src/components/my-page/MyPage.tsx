import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { EnterRiderSection } from "@/components/competition/EntryList";
import { WithdrawButton } from "@/components/competition/WithdrawButton";
import type { CurrentUser } from "@/lib/auth";
import { getClasses } from "@/lib/competition";
import { disciplineNames, formatDuration } from "@/lib/competition-shared";
import { dressageScore, formatPercent } from "@/lib/dressage-shared";
import { formatTime, totalFaults } from "@/lib/jumping-shared";
import {
  getMyEntries,
  type MyEntry,
  type PaymentStatus,
} from "@/lib/my-entries";
import { getSettings } from "@/lib/settings";
import { ReportPaymentButton } from "./ReportPaymentButton";
import { VippsCheckout } from "./VippsCheckout";

const statusLook: Record<PaymentStatus, { label: string; className: string }> =
  {
    unpaid: { label: "Ikke betalt", className: "bg-blush text-berry" },
    reported: { label: "Venter på bekreftelse", className: "bg-sunny/60" },
    paid: { label: "Påmeldt ✓", className: "bg-mint-soft" },
  };

export async function MyPage({ user }: { user: CurrentUser }) {
  const [settings, entries, jumpingClasses, dressageClasses] =
    await Promise.all([
      getSettings(),
      getMyEntries(user.id),
      getClasses("jumping"),
      getClasses("dressage"),
    ]);
  const firstName = user.name.split(" ")[0];
  const unpaid = entries.filter((e) => e.status === "unpaid");
  const waiting = entries.filter((e) => e.status === "reported");
  const total = unpaid.reduce((sum, e) => sum + e.fee_nok, 0);

  return (
    <AppShell user={user}>
      <div className="text-center sm:text-left">
        <h1 className="font-display text-4xl font-semibold text-berry sm:text-5xl">
          Hei, {firstName}!
        </h1>
        <p className="mt-2 text-lg text-plum-soft">
          Her melder du på deg selv, barna dine eller andre ryttere.
        </p>
      </div>

      {unpaid.length > 0 && (
        <section className="mt-8 rounded-[2rem] bg-sunny/40 p-2">
          <div className="rounded-[1.6rem] border-2 border-dashed border-sunny bg-white/70 px-5 py-6 sm:px-8">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">
              Til betaling: {total} kr
            </h2>
            <p className="mt-1 text-plum-soft">
              {unpaid.length === 1
                ? "1 påmelding"
                : `${unpaid.length} påmeldinger`}{" "}
              (
              {unpaid
                .map((e) => e.rider_name)
                .filter(unique)
                .join(", ")}
              )
            </p>
            <div className="mt-5">
              <VippsCheckout total={total} />
            </div>
            {settings.vipps_number ? (
              <div className="mt-5">
                <h3 className="font-display text-xl font-semibold">
                  Slik betaler du nå
                </h3>
                <ol className="mt-2 flex list-decimal flex-col gap-1 pl-5 text-lg">
                  <li>
                    Vipps <strong>{total} kr</strong> til{" "}
                    <strong className="font-display text-xl text-berry">
                      {settings.vipps_number}
                    </strong>
                  </li>
                  <li>Skriv rytterens navn i meldingen.</li>
                  <li>Trykk på knappen under når du har betalt.</li>
                </ol>
                <div className="mt-5">
                  <ReportPaymentButton
                    entryIds={unpaid.map((e) => e.id)}
                    total={total}
                  />
                </div>
              </div>
            ) : (
              <p className="mt-4 font-semibold">
                Betalingsinformasjon kommer snart. Påmeldingen din er lagret.
              </p>
            )}
          </div>
        </section>
      )}

      {waiting.length > 0 && (
        <p className="mt-6 rounded-2xl bg-white px-5 py-4 text-plum-soft shadow-[0_8px_24px_-14px_rgba(75,44,85,0.4)]">
          Takk for betalingen! Vi sjekker den så fort vi kan. Da blir{" "}
          {waiting
            .map((e) => e.rider_name)
            .filter(unique)
            .join(" og ")}{" "}
          påmeldt.
        </p>
      )}

      {entries.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 font-display text-3xl font-semibold">
            Mine påmeldinger
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </ul>
        </section>
      )}

      <EnterRiderSection
        options={[
          { discipline: "jumping", label: "Sprang", classes: jumpingClasses },
          {
            discipline: "dressage",
            label: "Dressur",
            classes: dressageClasses,
          },
        ]}
        feeNok={settings.entry_fee_nok}
        description="Velg Sprang, Dressur eller begge. Klassen velges automatisk ut fra rytterens alder."
      />

      <Link
        href="/results"
        className="mt-8 flex items-center justify-between gap-4 rounded-[2rem] bg-white px-6 py-5 shadow-[0_12px_32px_-16px_rgba(75,44,85,0.35)] transition hover:-translate-y-0.5"
      >
        <span>
          <span className="block font-display text-2xl font-semibold">
            Startlister og resultater
          </span>
          <span className="text-plum-soft">
            Se hvem som er påmeldt i hver klasse, og hvordan det gikk.
          </span>
        </span>
        <span aria-hidden="true" className="text-3xl text-berry">
          →
        </span>
      </Link>
    </AppShell>
  );
}

function unique<T>(value: T, index: number, list: T[]) {
  return list.indexOf(value) === index;
}

function EntryCard({ entry }: { entry: MyEntry }) {
  const status = statusLook[entry.status];
  return (
    <li className="flex flex-col gap-3 rounded-2xl bg-white px-4 py-4 shadow-[0_8px_24px_-14px_rgba(75,44,85,0.4)]">
      <div className="flex items-start gap-3">
        <span className="min-w-0 flex-1">
          <span className="block font-display text-xl font-semibold">
            {entry.rider_name}
          </span>
          <span className="block text-sm text-plum-soft">
            {entry.horse_name} · {disciplineNames[entry.discipline]}{" "}
            {entry.class.name}
          </span>
        </span>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold ${status.className}`}
        >
          {status.label}
        </span>
      </div>
      <EntryResult entry={entry} />
      {entry.status !== "paid" && (
        <div className="flex justify-end">
          <WithdrawButton entryId={entry.id} riderName={entry.rider_name} />
        </div>
      )}
    </li>
  );
}

function EntryResult({ entry }: { entry: MyEntry }) {
  if (entry.discipline === "jumping" && entry.jumping?.time_seconds != null) {
    return (
      <p className="rounded-xl bg-mint-soft px-3 py-2 font-semibold">
        Resultat: {totalFaults(entry.jumping)} feil ·{" "}
        {formatTime(entry.jumping.time_seconds)} s
      </p>
    );
  }
  if (entry.discipline === "dressage" && entry.dressage) {
    const { percent } = dressageScore(entry.dressage, entry.class);
    return (
      <div className="rounded-xl bg-lilac-soft px-3 py-2">
        <p className="font-semibold">
          Resultat: {formatPercent(percent)}
          {entry.dressage.time_seconds != null &&
            ` · ${formatDuration(entry.dressage.time_seconds)}`}
        </p>
        {entry.dressage.comment && (
          <p className="mt-1 text-plum-soft">
            Dommeren skrev: «{entry.dressage.comment}»
          </p>
        )}
      </div>
    );
  }
  return null;
}
