import type { ReactNode } from "react";
import { AppShell } from "@/components/AppShell";
import { requireAdmin } from "@/lib/auth";
import type { PaymentStatus } from "@/lib/my-entries";
import { getPaymentGroups, type PaymentGroup } from "@/lib/payments";
import { getSettings } from "@/lib/settings";
import { ConfirmButton, SettingsForm, UndoButton } from "./PaymentButtons";

export async function PaymentsPage() {
  const user = await requireAdmin();
  const [settings, groups] = await Promise.all([
    getSettings(),
    getPaymentGroups(),
  ]);

  // Each account's entries split by status, so one Vipps payment that
  // covers several riders can be confirmed in one go.
  const byStatus = (status: PaymentStatus) =>
    groups
      .map((g) => ({
        ...g,
        entries: g.entries.filter((e) => e.status === status),
      }))
      .filter((g) => g.entries.length > 0);
  const reported = byStatus("reported");
  const unpaid = byStatus("unpaid");
  const paid = byStatus("paid");
  const paidCount = paid.reduce((n, g) => n + g.entries.length, 0);
  const paidSum = paid.reduce(
    (n, g) => n + g.entries.reduce((s, e) => s + e.fee_nok, 0),
    0,
  );

  return (
    <AppShell user={user}>
      <h1 className="text-center font-display text-4xl font-semibold text-berry sm:text-left sm:text-5xl">
        Betalinger
      </h1>
      <p className="mt-2 text-center text-lg text-plum-soft sm:text-left">
        Sjekk Vipps, og bekreft betalingene her. Da kommer rytterne opp som
        påmeldt i klassene.
      </p>

      <section className="mt-6 rounded-[2rem] bg-white p-5 shadow-[0_12px_32px_-16px_rgba(75,44,85,0.35)] sm:p-6">
        <h2 className="mb-3 font-display text-2xl font-semibold">
          Pris og Vipps
        </h2>
        <SettingsForm settings={settings} />
      </section>

      <Section
        title="Venter på bekreftelse"
        hint="Disse har trykket «Jeg har vippset». Sjekk at pengene har kommet inn."
        empty="Ingen venter på bekreftelse akkurat nå."
        groups={reported}
        action={(g) => (
          <ConfirmButton entryIds={g.entries.map((e) => e.id)} total={sum(g)} />
        )}
      />

      <Section
        title="Ikke betalt ennå"
        hint="Påmeldt, men ikke vippset. Betaler de på stedet, kan du bekrefte her."
        empty="Ingen ubetalte påmeldinger."
        groups={unpaid}
        action={(g) => (
          <ConfirmButton entryIds={g.entries.map((e) => e.id)} total={sum(g)} />
        )}
      />

      <details className="mt-10 rounded-[2rem] bg-white/70 px-5 py-4">
        <summary className="cursor-pointer font-display text-2xl font-semibold">
          Betalt ({paidCount} {paidCount === 1 ? "påmelding" : "påmeldinger"} ·{" "}
          {paidSum} kr)
        </summary>
        <div className="mt-4">
          {paid.length === 0 ? (
            <p className="text-plum-soft">Ingen betalte påmeldinger ennå.</p>
          ) : (
            <GroupList
              groups={paid}
              action={(g) => (
                <UndoButton entryIds={g.entries.map((e) => e.id)} />
              )}
            />
          )}
        </div>
      </details>
    </AppShell>
  );
}

function sum(group: PaymentGroup) {
  return group.entries.reduce((total, e) => total + e.fee_nok, 0);
}

function Section({
  title,
  hint,
  empty,
  groups,
  action,
}: {
  title: string;
  hint: string;
  empty: string;
  groups: PaymentGroup[];
  action: (group: PaymentGroup) => ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-3xl font-semibold">
        {title}{" "}
        {groups.length > 0 && (
          <span className="align-middle text-lg text-plum-soft">
            ({groups.length})
          </span>
        )}
      </h2>
      <p className="mb-4 mt-1 text-plum-soft">{hint}</p>
      {groups.length === 0 ? (
        <p className="rounded-2xl bg-white/70 px-4 py-3 text-plum-soft">
          {empty}
        </p>
      ) : (
        <GroupList groups={groups} action={action} />
      )}
    </section>
  );
}

function GroupList({
  groups,
  action,
}: {
  groups: PaymentGroup[];
  action: (group: PaymentGroup) => ReactNode;
}) {
  return (
    <ul className="flex flex-col gap-3">
      {groups.map((group) => (
        <li
          key={group.userId}
          className="rounded-2xl bg-white px-4 py-4 shadow-[0_8px_24px_-14px_rgba(75,44,85,0.4)]"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p>
              <span className="block font-display text-xl font-semibold">
                {group.accountName}
              </span>
              <span className="text-sm text-plum-soft">
                Konto · {group.entries.length}{" "}
                {group.entries.length === 1 ? "påmelding" : "påmeldinger"} ·{" "}
                {sum(group)} kr
              </span>
            </p>
            {action(group)}
          </div>
          <ul className="mt-3 flex flex-col gap-1 border-t-2 border-dashed border-lilac-soft pt-3">
            {group.entries.map((e) => (
              <li key={e.id} className="flex flex-wrap justify-between gap-x-3">
                <span>
                  <strong>{e.rider_name}</strong> · {e.horse_name}
                </span>
                <span className="text-plum-soft">
                  {e.class_label} · {e.fee_nok} kr
                </span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
