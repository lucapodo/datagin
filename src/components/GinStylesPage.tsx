interface GinStyle {
  name: string;
  tagline: string;
  body: string;
  facts: string[];
}

const STYLES: GinStyle[] = [
  {
    name: 'London Dry Gin',
    tagline: 'Un metodo, non un luogo',
    body:
      'Nonostante il nome, può essere prodotto ovunque: «London» indica il metodo, non il luogo. Tutte le botaniche devono essere distillate insieme all’alcol, in alambicchi tradizionali. Dopo la distillazione si possono aggiungere solo acqua e una quantità minima di zucchero. Il risultato è un gin secco, dominato dal ginepro, con agrumi e spezie in secondo piano.',
    facts: [
      'Nessun aroma o colorante aggiunto dopo la distillazione',
      'Zucchero massimo 0,1 g per litro',
      'Gradazione minima 37,5% vol.',
    ],
  },
  {
    name: 'Distilled Gin',
    tagline: 'Distillato, ma con più libertà',
    body:
      'Come il London Dry nasce dalla ridistillazione di alcol neutro con ginepro e altre botaniche. A differenza del London Dry, però, dopo la distillazione si possono aggiungere altri aromi naturali o artificiali, e anche colore. Molti gin contemporanei, aromatizzati o colorati rientrano in questa categoria.',
    facts: ['Aromi e coloranti ammessi dopo la distillazione', 'Gradazione minima 37,5% vol.'],
  },
  {
    name: 'Gin (compound)',
    tagline: 'Senza distillazione delle botaniche',
    body:
      'È la definizione di base: alcol neutro aromatizzato con ginepro, anche solo per infusione o con aromi, senza ridistillare. È il metodo dei «bathtub gin» del Proibizionismo e di molti gin economici. Oggi però lo usano anche alcuni produttori artigianali, che lasciano le botaniche in infusione a freddo.',
    facts: ['Il ginepro deve restare l’aroma dominante', 'Gradazione minima 37,5% vol.'],
  },
  {
    name: 'Old Tom Gin',
    tagline: 'Il gin dolce dell’Ottocento',
    body:
      'Era lo stile più diffuso nell’Inghilterra del XVIII e XIX secolo, prima del London Dry: un gin leggermente dolcificato, un tempo anche per coprire i difetti di distillati poco raffinati. Secondo la tradizione il nome viene dalle insegne a forma di gatto («old tom cat») dei locali che lo vendevano di nascosto. Caduto in disuso nel Novecento, è tornato in voga con la riscoperta dei cocktail classici.',
    facts: ['Più morbido e rotondo del London Dry', 'Ideale nei cocktail storici dell’Ottocento'],
  },
  {
    name: 'Plymouth Gin',
    tagline: 'Lo stile di una sola distilleria',
    body:
      'Prodotto dal 1793 nella distilleria Black Friars di Plymouth. Ha un profilo più terroso e meno secco del London Dry, con più radici e meno ginepro in primo piano. Per decenni è stato l’unico gin europeo con un’indicazione geografica, che però è decaduta nel 2015: oggi «Plymouth» è di fatto un marchio.',
    facts: ['Profilo più morbido e terroso', 'Storicamente legato alla Royal Navy'],
  },
  {
    name: 'Navy Strength',
    tagline: 'Almeno 57 gradi',
    body:
      'È un gin imbottigliato a gradazione molto alta, di solito 57% vol. o più. Si racconta che a bordo delle navi della Royal Navy servisse a dimostrare che non fosse stato annacquato: la polvere da sparo bagnata con un gin così forte riusciva ancora a prendere fuoco. Più alcol porta con sé più aroma, quindi regge bene la diluizione nei cocktail.',
    facts: ['Gradazione di solito ≥ 57% vol.', 'Aromi intensi e concentrati'],
  },
  {
    name: 'Genever (Jenever)',
    tagline: 'L’antenato olandese',
    body:
      'È il distillato da cui è nato il gin. Viene dai Paesi Bassi e dal Belgio, dove è tutelato come denominazione di origine. Alla base c’è il «moutwijn», un distillato di cereali maltati simile al whisky, aromatizzato con ginepro. Lo «jonge» è più leggero e neutro, l’«oude» più ricco di malto. I due nomi indicano lo stile della ricetta, non l’età.',
    facts: ['Base di vino di malto (moutwijn)', 'Jonge: max 15% di moutwijn · Oude: almeno 15%'],
  },
  {
    name: 'Contemporary / New Western',
    tagline: 'Il ginepro fa un passo indietro',
    body:
      'È lo stile nato con la rinascita del gin tra fine anni Novanta e anni Duemila. Il ginepro resta obbligatorio ma non domina più: lo affiancano botaniche floreali, vegetali o locali, come cetriolo, rosa, tè, alghe o erbe di montagna. Gran parte dei gin artigianali di oggi, in Italia e nel mondo, appartiene a questa famiglia.',
    facts: ['Spesso legato al territorio di produzione', 'Profili molto vari, dal floreale all’erbaceo'],
  },
  {
    name: 'Sloe Gin',
    tagline: 'Un liquore, non un gin',
    body:
      'Si ottiene lasciando in infusione nel gin le bacche di prugnolo selvatico (sloe) con zucchero, per settimane o mesi. Il risultato è rosso rubino, dolce e acidulo. Per legge è un liquore: la gradazione minima è più bassa di quella del gin.',
    facts: ['Gradazione minima 25% vol.', 'Tradizione invernale britannica'],
  },
  {
    name: 'Gin invecchiato',
    tagline: 'Il gin che passa dal legno',
    body:
      'Chiamato anche «barrel aged» o «reserve», è un gin che riposa da qualche settimana a qualche mese in botti di legno. Spesso si usano botti che hanno già contenuto vino, sherry o whisky. Il legno dà colore ambrato e note di vaniglia, spezie e frutta secca.',
    facts: ['Colore dal giallo paglierino all’ambra', 'Si beve anche liscio, come un distillato scuro'],
  },
];

const METHODS: { name: string; body: string }[] = [
  {
    name: 'Macerazione',
    body:
      'Le botaniche restano in infusione nell’alcol per ore o giorni prima della distillazione. In questo modo trasferiscono anche gli aromi più pesanti, come radici, cortecce e semi.',
  },
  {
    name: 'Infusione a vapore',
    body:
      'Le botaniche stanno in un cestello sopra l’alcol e vengono attraversate solo dai vapori. Così si ottiene un profilo più delicato e floreale; è il metodo usato, per esempio, per Bombay Sapphire.',
  },
  {
    name: 'Distillazione sottovuoto',
    body:
      'Abbassando la pressione l’alcol bolle a temperature molto più basse. Gli aromi freschi, come agrumi ed erbe, non «cuociono» e restano più vivi e vicini alla pianta.',
  },
  {
    name: 'One-shot e multi-shot',
    body:
      'Nel metodo one-shot si distilla tutto alla diluizione finale. Nel multi-shot si produce un concentrato molto aromatico, poi allungato con altro alcol neutro: un metodo più efficiente, usato soprattutto per i grandi volumi.',
  },
];

export function GinStylesPage() {
  return (
    <article className="article-page">
      <p className="article-page__eyebrow">Guida</p>
      <h1 className="display article-page__title">Le tipologie di gin</h1>
      <p className="article-page__lead">
        Tutti i gin hanno una cosa in comune: il ginepro deve essere l’aroma principale. A cambiare
        è il modo in cui ci si arriva: come vengono estratte le botaniche, cosa si aggiunge dopo la
        distillazione e da quale alcol si parte. Le definizioni seguono il regolamento europeo sulle
        bevande spiritose (UE 2019/787).
      </p>

      <div className="style-list">
        {STYLES.map((s) => (
          <section key={s.name} className="style-card">
            <h2 className="display style-card__name">{s.name}</h2>
            <p className="style-card__tagline">{s.tagline}</p>
            <p>{s.body}</p>
            <ul className="style-card__facts">
              {s.facts.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <h2 className="display article-page__h2">Come si estraggono gli aromi</h2>
      <p>
        Accanto alla categoria legale conta il metodo di produzione. Spesso è questo che spiega
        perché due gin con le stesse botaniche hanno un sapore così diverso.
      </p>
      <dl className="method-list">
        {METHODS.map((m) => (
          <div key={m.name} className="method-list__item">
            <dt className="display">{m.name}</dt>
            <dd>{m.body}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
