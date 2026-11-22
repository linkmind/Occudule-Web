"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type Trait = { id: string; key: string; label: string };
type Invite = {
  childFirstName: string;
  institutionName: string;
  teacherName: string | null;
  recipientName: string | null;
  minTraits: number;
  maxTraits: number;
  maxCustomPhrases: number;
  traits: Trait[];
  phraseHints: string[];
  existingSelections: {
    traitIds: string[];
    traitNotes: { traitId: string; note: string | null }[];
    customPhrases: { phrase: string; note: string | null }[];
    willingToBeReference: boolean | null;
    referenceReason: string | null;
  } | null;
};

type Phrase = { phrase: string; note: string };

const apiBase = () => (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

export function FeedbackClient() {
  const params = useSearchParams();
  const token = params.get("token")?.trim() ?? "";
  const [invite, setInvite] = useState<Invite | null>(null);
  const [phase, setPhase] = useState<"loading" | "invalid" | "expired" | "form" | "done">("loading");
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [reference, setReference] = useState<boolean | null>(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!token) {
      setPhase("invalid");
      return;
    }
    const base = apiBase();
    if (!base) {
      setError("The feedback page is not connected to the API yet.");
      setPhase("invalid");
      return;
    }
    let cancelled = false;
    fetch(`${base}/johari/invite/${encodeURIComponent(token)}`)
      .then(async (res) => {
        if (res.status === 410) {
          setPhase("expired");
          return;
        }
        if (!res.ok) {
          setPhase("invalid");
          return;
        }
        const body = (await res.json()) as Invite;
        if (cancelled) return;
        setInvite(body);
        setName(body.recipientName ?? "");
        const saved = body.existingSelections;
        if (saved) {
          setSelected(saved.traitIds);
          setNotes(Object.fromEntries(saved.traitNotes.filter((row) => row.note).map((row) => [row.traitId, row.note ?? ""])));
          setPhrases(saved.customPhrases.map((row) => ({ phrase: row.phrase, note: row.note ?? "" })));
          setReference(saved.willingToBeReference);
          setReason(saved.referenceReason ?? "");
        }
        setPhase("form");
      })
      .catch(() => {
        if (!cancelled) setPhase("invalid");
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const visible = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return (invite?.traits ?? []).filter((trait) => !needle || trait.label.toLocaleLowerCase().includes(needle));
  }, [invite, query]);

  const suggestions = useMemo(() => {
    const needle = draft.trim().toLocaleLowerCase();
    if (!invite || needle.length < 2) return [];
    return [
      ...invite.traits.filter((trait) => trait.label.toLocaleLowerCase().includes(needle)).slice(0, 6).map((trait) => ({ kind: "trait" as const, id: trait.id, text: trait.label })),
      ...invite.phraseHints.filter((phrase) => phrase.toLocaleLowerCase().includes(needle)).slice(0, 6).map((phrase) => ({ kind: "phrase" as const, id: phrase, text: phrase })),
    ];
  }, [draft, invite]);

  const addPhrase = (phrase: string) => {
    const next = phrase.trim().replace(/\s+/g, " ").slice(0, 35);
    if (!next || !invite || phrases.length >= invite.maxCustomPhrases) return;
    setPhrases((current) => [...current, { phrase: next, note: "" }]);
    setDraft("");
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!invite || reference === null) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`${apiBase()}/johari/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          respondentName: name.trim(),
          willingToBeReference: reference,
          referenceReason: reason.trim() || undefined,
          selectedTraitIds: selected,
          traitNotes: selected.filter((id) => notes[id]?.trim()).map((traitId) => ({ traitId, note: notes[traitId].trim() })),
          customPhrases: phrases.map((row) => ({ phrase: row.phrase, note: row.note.trim() || undefined })),
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { message?: string | string[] } | null;
        const message = Array.isArray(body?.message) ? body?.message[0] : body?.message;
        setError(message || "The feedback could not be saved. Check the form and try again.");
        return;
      }
      setPhase("done");
    } catch {
      setError("The feedback could not be saved. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  if (phase === "loading") {
    return <Shell><p className="text-primary">Loading the feedback form…</p></Shell>;
  }
  if (phase === "expired") {
    return <Shell><p className="text-primary">This feedback link has expired. Ask the family to send a new one if you still want to respond.</p></Shell>;
  }
  if (phase === "invalid" || !invite) {
    return <Shell><p className="text-primary">{error || "This feedback link is missing or invalid."}</p></Shell>;
  }
  if (phase === "done") {
    return (
      <Shell>
        <h1 className="text-2xl font-semibold text-primary">Thank you, {name.trim()}.</h1>
        <p className="mt-3 text-primary/80">Your feedback for {invite.childFirstName} is saved. You can open this same link again before it expires if you want to change your answers.</p>
      </Shell>
    );
  }

  const ready = name.trim().length > 0 && selected.length >= invite.minTraits && selected.length <= invite.maxTraits && phrases.length <= invite.maxCustomPhrases && reference !== null;

  return (
    <Shell>
      <form onSubmit={submit} className="space-y-5">
        <header>
          <h1 className="text-2xl font-semibold text-primary">
            {name.trim() ? `Hi ${name.trim()}, ` : ""}
            {invite.childFirstName}&apos;s family invited you to share words or short phrases that describe them.
          </h1>
          {invite.institutionName ? <p className="mt-2 text-sm text-primary/70">{invite.institutionName}{invite.teacherName ? ` · ${invite.teacherName}` : ""}</p> : null}
        </header>
        <label className="block text-sm font-medium text-primary">
          Your name
          <input value={name} onChange={(event) => setName(event.target.value)} required className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-primary" />
        </label>
        <p className="text-sm text-primary">Selected: {selected.length} / {invite.maxTraits} (minimum {invite.minTraits})</p>
        <p className="text-sm text-primary">Short phrases: {phrases.length} / {invite.maxCustomPhrases}</p>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search traits" className="w-full rounded-lg border border-border bg-white px-3 py-2 text-primary" />
        <div className="flex flex-wrap gap-2">
          {visible.map((trait) => {
            const on = selected.includes(trait.id);
            return (
              <button key={trait.id} type="button" onClick={() => setSelected((current) => on ? current.filter((id) => id !== trait.id) : [...current, trait.id])} className={`rounded-full border px-3 py-2 text-sm ${on ? "border-primary bg-accent/40" : "border-border bg-white"}`}>
                {trait.label}
              </button>
            );
          })}
        </div>
        {selected.map((id) => {
          const trait = invite.traits.find((item) => item.id === id);
          if (!trait) return null;
          return <input key={id} value={notes[id] ?? ""} onChange={(event) => setNotes((current) => ({ ...current, [id]: event.target.value.slice(0, 200) }))} placeholder={`Example for ${trait.label} (optional)`} className="w-full rounded-lg border border-border bg-white px-3 py-2 text-primary" />;
        })}
        <div className="space-y-2">
          <p className="text-sm font-medium text-primary">Short phrases</p>
          {phrases.map((row, index) => (
            <div key={`${row.phrase}-${index}`} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <span className="text-primary">{row.phrase}</span>
                <button type="button" className="text-sm text-primary underline" onClick={() => setPhrases((current) => current.filter((_, item) => item !== index))}>Remove</button>
              </div>
              <input value={row.note} onChange={(event) => setPhrases((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, note: event.target.value.slice(0, 200) } : item))} placeholder="Example or note (optional)" className="w-full rounded-lg border border-border bg-white px-3 py-2 text-primary" />
            </div>
          ))}
          {phrases.length < invite.maxCustomPhrases ? (
            <>
              <input value={draft} onChange={(event) => setDraft(event.target.value.slice(0, 35))} placeholder="Add a short phrase" className="w-full rounded-lg border border-border bg-white px-3 py-2 text-primary" />
              {suggestions.map((item) => (
                <button key={`${item.kind}-${item.id}`} type="button" className="block text-left text-sm text-primary underline" onClick={() => item.kind === "trait" ? setSelected((current) => current.includes(item.id) ? current : [...current, item.id]) : addPhrase(item.text)}>
                  {item.text}
                </button>
              ))}
            </>
          ) : null}
        </div>
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-primary">Willing to be a reference person for {invite.childFirstName}?</legend>
          <label className="mr-4 text-primary"><input type="radio" name="reference" checked={reference === true} onChange={() => setReference(true)} /> Yes</label>
          <label className="text-primary"><input type="radio" name="reference" checked={reference === false} onChange={() => setReference(false)} /> No</label>
          <input value={reason} onChange={(event) => setReason(event.target.value.slice(0, 500))} placeholder="Reason (optional)" className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-2 text-primary" />
        </fieldset>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button type="submit" disabled={!ready || busy} className="rounded-lg bg-cta px-4 py-3 font-semibold text-white disabled:opacity-40">
          {busy ? "Saving…" : "Submit feedback"}
        </button>
      </form>
    </Shell>
  );
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-surface-muted px-4 py-8 text-primary">
      <div className="mx-auto max-w-xl rounded-card bg-surface p-5 shadow-card">{children}</div>
    </main>
  );
}
