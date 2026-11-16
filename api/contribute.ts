// Vercel Function: riceve dal form /contribuisci una segnalazione su un gin
// esistente o la proposta di un nuovo gin, e la inoltra via email con Resend.
// La chiave di Resend vive solo qui, lato server (variabili d'ambiente su
// Vercel), mai nel bundle del sito.
//
// Variabili d'ambiente richieste:
//   RESEND_API_KEY      chiave API di Resend
//   CONTACT_TO_EMAIL    indirizzo che riceve le segnalazioni
//   CONTACT_FROM_EMAIL  mittente su un dominio verificato in Resend, es.
//                       "L'Atlante del Gin <segnalazioni@tuodominio.it>"
//                       (facoltativo: senza, usa il mittente di test di Resend,
//                       che consegna solo all'email dell'account Resend)

const REASON_MAX = 300;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Fields = Record<string, unknown>;

class ValidationError extends Error {}

function str(fields: Fields, key: string, max: number, required = false): string {
  const raw = fields[key];
  const value = typeof raw === 'string' ? raw.trim() : '';
  if (required && !value) throw new ValidationError(`Campo obbligatorio mancante: ${key}`);
  if (value.length > max) throw new ValidationError(`Campo troppo lungo: ${key}`);
  return value;
}

function optionalNumber(fields: Fields, key: string, min: number, max: number): number | null {
  const raw = fields[key];
  if (raw === null || raw === undefined || raw === '') return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < min || n > max) throw new ValidationError(`Valore non valido: ${key}`);
  return n;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface Email {
  subject: string;
  text: string;
  html: string;
}

function rowsToEmail(subject: string, rows: [string, string][], appendix?: { title: string; body: string }): Email {
  const text = [
    ...rows.map(([k, v]) => `${k}: ${v || '—'}`),
    ...(appendix ? ['', appendix.title, appendix.body] : []),
  ].join('\n');
  const html = `
    <h2 style="font-family:Georgia,serif">${escapeHtml(subject)}</h2>
    <table style="border-collapse:collapse;font-family:Georgia,serif;font-size:15px">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:4px 12px 4px 0;color:#3b4a3d;vertical-align:top"><b>${escapeHtml(k)}</b></td>` +
            `<td style="padding:4px 0;white-space:pre-wrap">${escapeHtml(v || '—')}</td></tr>`,
        )
        .join('')}
    </table>
    ${
      appendix
        ? `<h3 style="font-family:Georgia,serif">${escapeHtml(appendix.title)}</h3>` +
          `<pre style="background:#f1e8cc;padding:12px;font-size:13px;white-space:pre-wrap">${escapeHtml(appendix.body)}</pre>`
        : ''
    }`;
  return { subject, text, html };
}

function buildReport(fields: Fields, email: string): Email {
  const ginId = str(fields, 'ginId', 200, true);
  const ginName = str(fields, 'ginName', 200, true);
  const reason = str(fields, 'reason', REASON_MAX, true);
  return rowsToEmail(`Segnalazione: ${ginName}`, [
    ['Gin', `${ginName} (${ginId})`],
    ['Motivazione', reason],
    ['Email', email],
  ]);
}

function buildProposal(fields: Fields, email: string): Email {
  const name = str(fields, 'name', 120, true);
  const country = str(fields, 'country', 80, true);
  const region = str(fields, 'region', 80, true);
  const producedIn = str(fields, 'producedIn', 160, true);
  const type = str(fields, 'type', 80, true);
  const source = str(fields, 'source', 500, true);
  const link = str(fields, 'link', 300);
  const botanicalsRaw = str(fields, 'botanicals', 800);
  const characteristics = str(fields, 'characteristics', 600);
  const anecdote = str(fields, 'anecdote', 600);
  const notes = str(fields, 'notes', 600);
  const productionYear = optionalNumber(fields, 'productionYear', 1500, new Date().getFullYear());
  const price = optionalNumber(fields, 'price', 0, 10000);

  const botanicals = botanicalsRaw
    .split(',')
    .map((b) => b.trim().toLowerCase())
    .filter(Boolean);

  // Bozza già nel formato di data/gins.json (vedi data/SCHEMA.md): va
  // verificata e completata (countryCode, coordinate) prima di aggiungerla.
  const draft = {
    id: slugify(name),
    name,
    country,
    countryCode: '??',
    region,
    coordinates: { lat: null, lng: null },
    type,
    price,
    currency: 'EUR',
    botanicalsCount: botanicals.length,
    botanicals,
    productionYear,
    producedIn,
    image: null,
    characteristics,
    anecdote,
    link: link || null,
  };

  return rowsToEmail(
    `Nuovo gin proposto: ${name}`,
    [
      ['Nome', name],
      ['Nazione', country],
      ['Regione', region],
      ['Distilleria / località', producedIn],
      ['Tipologia', type],
      ['Anno di lancio', productionYear ? String(productionYear) : ''],
      ['Prezzo (EUR)', price !== null ? String(price) : ''],
      ['Botaniche', botanicals.join(', ')],
      ['Caratteristiche', characteristics],
      ['Aneddoto', anecdote],
      ['Sito del produttore', link],
      ['Fonte', source],
      ['Note', notes],
      ['Email', email],
    ],
    {
      title: 'Bozza per data/gins.json (da verificare: countryCode e coordinate)',
      body: JSON.stringify(draft, null, 2),
    },
  );
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request: Request): Promise<Response> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL || "L'Atlante del Gin <onboarding@resend.dev>";
  if (!apiKey || !to) {
    console.error('[contribute] RESEND_API_KEY o CONTACT_TO_EMAIL non configurate');
    return json(500, { error: 'Invio non configurato sul server.' });
  }

  let fields: Fields;
  try {
    fields = (await request.json()) as Fields;
    if (!fields || typeof fields !== 'object') throw new Error();
  } catch {
    return json(400, { error: 'Richiesta non valida.' });
  }

  // Honeypot: campo nascosto che solo i bot compilano. Fingiamo un successo.
  if (typeof fields.website === 'string' && fields.website.trim() !== '') {
    return json(200, { ok: true });
  }

  let message: Email;
  let email: string;
  try {
    email = str(fields, 'email', 254, true);
    if (!EMAIL_RE.test(email)) throw new ValidationError('Indirizzo email non valido.');
    if (fields.kind === 'report') message = buildReport(fields, email);
    else if (fields.kind === 'proposal') message = buildProposal(fields, email);
    else throw new ValidationError('Tipo di richiesta sconosciuto.');
  } catch (err) {
    if (err instanceof ValidationError) return json(400, { error: err.message });
    throw err;
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `[Atlante del Gin] ${message.subject}`,
      text: message.text,
      html: message.html,
    }),
  });

  if (!res.ok) {
    console.error('[contribute] Resend ha risposto', res.status, await res.text());
    return json(502, { error: 'Invio non riuscito, riprova più tardi.' });
  }
  return json(200, { ok: true });
}
