import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGins } from '../hooks/useGins';
import type { Gin } from '../types';

const REASON_MAX = 300;

const GIN_TYPES = [
  'London Dry Gin',
  'Contemporary Dry Gin',
  'Dry Gin',
  'Distilled Gin',
  'Mediterranean Gin',
  'Old Tom Gin',
  'Plymouth Gin',
  'Navy Strength Gin',
  'Genever',
  'Compound Gin',
  'Sloe Gin',
  'Gin invecchiato (Aged)',
  'Altro',
];

type Tab = 'report' | 'proposal';
type SendState = { status: 'idle' | 'sending' | 'sent' } | { status: 'error'; message: string };

async function submit(payload: Record<string, unknown>): Promise<void> {
  const res = await fetch('/api/contribute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? `Errore ${res.status}`);
  }
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Invio non riuscito, riprova più tardi.';
}

function Field({ label, hint, children }: { label: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <label className="form-field">
      <span className="form-field__label">{label}</span>
      {children}
      {hint && <span className="form-field__hint">{hint}</span>}
    </label>
  );
}

/** Campo nascosto anti-spam: gli utenti non lo vedono, i bot spesso lo compilano. */
function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      className="form-honeypot"
      type="text"
      name="website"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function SendStatus({ state, sentText }: { state: SendState; sentText: string }) {
  if (state.status === 'sent') return <p className="form-status form-status--ok">{sentText}</p>;
  if (state.status === 'error') return <p className="form-status form-status--error">{state.message}</p>;
  return null;
}

function ReportForm({ gins, initialGinId }: { gins: Gin[]; initialGinId: string }) {
  const [ginId, setGinId] = useState(initialGinId);
  const [reason, setReason] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [state, setState] = useState<SendState>({ status: 'idle' });

  // Elenco raggruppato per nazione, in ordine alfabetico.
  const groups = useMemo(() => {
    const byCountry = new Map<string, Gin[]>();
    for (const g of gins) byCountry.set(g.country, [...(byCountry.get(g.country) ?? []), g]);
    return [...byCountry.entries()]
      .sort(([a], [b]) => a.localeCompare(b, 'it'))
      .map(([country, list]) => [country, list.sort((a, b) => a.name.localeCompare(b.name, 'it'))] as const);
  }, [gins]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const gin = gins.find((g) => g.id === ginId);
    if (!gin) return;
    setState({ status: 'sending' });
    try {
      await submit({ kind: 'report', ginId: gin.id, ginName: gin.name, reason, email, website });
      setState({ status: 'sent' });
      setReason('');
    } catch (err) {
      setState({ status: 'error', message: errorMessage(err) });
    }
  }

  return (
    <form className="contribute-form" onSubmit={handleSubmit}>
      <Field label="Gin">
        <select required value={ginId} onChange={(e) => setGinId(e.target.value)}>
          <option value="">Scegli un gin…</option>
          {groups.map(([country, list]) => (
            <optgroup key={country} label={country}>
              {list.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </Field>

      <Field
        label="Cosa non va?"
        hint={
          <>
            Luogo sbagliato, dati errati, gin non più prodotto… {reason.length}/{REASON_MAX}
          </>
        }
      >
        <textarea
          required
          rows={4}
          maxLength={REASON_MAX}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </Field>

      <Field label="La tua email" hint="Solo per risponderti se servono chiarimenti.">
        <input type="email" required maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} />
      </Field>

      <Honeypot value={website} onChange={setWebsite} />

      <button type="submit" className="form-submit" disabled={state.status === 'sending'}>
        {state.status === 'sending' ? 'Invio in corso…' : 'Invia la segnalazione'}
      </button>
      <SendStatus state={state} sentText="Grazie! La segnalazione è arrivata alla redazione." />
    </form>
  );
}

const EMPTY_PROPOSAL = {
  name: '',
  country: '',
  region: '',
  producedIn: '',
  type: '',
  productionYear: '',
  price: '',
  botanicals: '',
  characteristics: '',
  anecdote: '',
  link: '',
  source: '',
  notes: '',
  email: '',
};

function ProposalForm({ gins }: { gins: Gin[] }) {
  const [form, setForm] = useState(EMPTY_PROPOSAL);
  const [website, setWebsite] = useState('');
  const [state, setState] = useState<SendState>({ status: 'idle' });
  const set = (key: keyof typeof EMPTY_PROPOSAL) => (
    e: { target: { value: string } },
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const countries = useMemo(
    () => [...new Set(gins.map((g) => g.country))].sort((a, b) => a.localeCompare(b, 'it')),
    [gins],
  );

  const duplicate = useMemo(() => {
    const q = form.name.trim().toLowerCase();
    return q.length >= 4 ? gins.find((g) => g.name.toLowerCase().includes(q)) : undefined;
  }, [form.name, gins]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setState({ status: 'sending' });
    try {
      await submit({ kind: 'proposal', ...form, website });
      setState({ status: 'sent' });
      setForm({ ...EMPTY_PROPOSAL, email: form.email });
    } catch (err) {
      setState({ status: 'error', message: errorMessage(err) });
    }
  }

  return (
    <form className="contribute-form" onSubmit={handleSubmit}>
      <Field
        label="Nome del gin *"
        hint={duplicate && <>Attenzione: nell'atlante c'è già «{duplicate.name}».</>}
      >
        <input required maxLength={120} value={form.name} onChange={set('name')} />
      </Field>

      <div className="form-row">
        <Field label="Nazione *">
          <input required maxLength={80} list="contribute-countries" value={form.country} onChange={set('country')} />
          <datalist id="contribute-countries">
            {countries.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Field>
        <Field label="Regione *">
          <input required maxLength={80} value={form.region} onChange={set('region')} placeholder="es. Toscana" />
        </Field>
      </div>

      <Field
        label="Distilleria e località *"
        hint="Dove viene distillato davvero, non la sede del marchio."
      >
        <input
          required
          maxLength={160}
          value={form.producedIn}
          onChange={set('producedIn')}
          placeholder="es. Distilleria Quaglia, Castelnuovo Don Bosco (AT)"
        />
      </Field>

      <div className="form-row">
        <Field label="Tipologia *">
          <select required value={form.type} onChange={set('type')}>
            <option value="">Scegli…</option>
            {GIN_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Anno di lancio">
          <input
            type="number"
            min={1500}
            max={new Date().getFullYear()}
            value={form.productionYear}
            onChange={set('productionYear')}
          />
        </Field>
        <Field label="Prezzo (€)">
          <input type="number" min={0} step="0.5" value={form.price} onChange={set('price')} />
        </Field>
      </div>

      <Field label="Botaniche" hint="Separate da virgola, es. ginepro, coriandolo, scorza di limone">
        <input maxLength={800} value={form.botanicals} onChange={set('botanicals')} />
      </Field>

      <Field label="Caratteristiche" hint="Profilo aromatico, con parole tue.">
        <textarea rows={3} maxLength={600} value={form.characteristics} onChange={set('characteristics')} />
      </Field>

      <Field label="Aneddoto o curiosità">
        <textarea rows={3} maxLength={600} value={form.anecdote} onChange={set('anecdote')} />
      </Field>

      <div className="form-row">
        <Field label="Sito del produttore">
          <input type="url" maxLength={300} value={form.link} onChange={set('link')} placeholder="https://" />
        </Field>
        <Field label="Fonte delle informazioni *" hint="Un link o un riferimento per verificarle.">
          <input required maxLength={500} value={form.source} onChange={set('source')} />
        </Field>
      </div>

      <Field label="Note per la redazione">
        <textarea rows={2} maxLength={600} value={form.notes} onChange={set('notes')} />
      </Field>

      <Field label="La tua email *" hint="Solo per risponderti se servono chiarimenti.">
        <input type="email" required maxLength={254} value={form.email} onChange={set('email')} />
      </Field>

      <Honeypot value={website} onChange={setWebsite} />

      <button type="submit" className="form-submit" disabled={state.status === 'sending'}>
        {state.status === 'sending' ? 'Invio in corso…' : 'Proponi il gin'}
      </button>
      <SendStatus
        state={state}
        sentText="Grazie! Verificheremo le informazioni e, se tutto torna, il gin entrerà nell'atlante."
      />
    </form>
  );
}

export function ContributePage() {
  const { gins, status } = useGins();
  const [params, setParams] = useSearchParams();
  const tab: Tab = params.get('tab') === 'nuovo' ? 'proposal' : 'report';
  const initialGinId = params.get('gin') ?? '';

  function selectTab(next: Tab) {
    setParams(next === 'proposal' ? { tab: 'nuovo' } : {}, { replace: true });
  }

  return (
    <article className="article-page">
      <p className="article-page__eyebrow">Contribuisci</p>
      <h1 className="display article-page__title">Aiutaci a migliorare l'atlante</h1>
      <p className="article-page__lead">
        Hai trovato un errore o conosci un gin che manca? Ogni segnalazione viene letta e verificata
        dalla redazione prima di finire sul globo.
      </p>

      <div className="contribute-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'report'}
          className={`contribute-tabs__tab${tab === 'report' ? ' is-active' : ''}`}
          onClick={() => selectTab('report')}
        >
          Segnala un errore
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'proposal'}
          className={`contribute-tabs__tab${tab === 'proposal' ? ' is-active' : ''}`}
          onClick={() => selectTab('proposal')}
        >
          Proponi un nuovo gin
        </button>
      </div>

      {status === 'loading' && <p className="form-status">Caricamento dell'elenco dei gin…</p>}
      {status === 'error' && (
        <p className="form-status form-status--error">Non è stato possibile caricare l'elenco dei gin.</p>
      )}
      {status === 'ready' &&
        (tab === 'report' ? (
          <ReportForm key={initialGinId} gins={gins} initialGinId={initialGinId} />
        ) : (
          <ProposalForm gins={gins} />
        ))}
    </article>
  );
}
