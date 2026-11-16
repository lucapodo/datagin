const TIMELINE: { year: string; title: string; body: string }[] = [
  {
    year: 'XVII sec.',
    title: 'La corteccia delle Ande',
    body:
      'In Perù i gesuiti scoprono che la corteccia di china (Cinchona) fa calare la febbre malarica e la portano in Europa, dove diventa famosa come «polvere dei gesuiti». Una leggenda, probabilmente inventata, attribuisce la scoperta alla guarigione della contessa di Chinchón, moglie del viceré.',
  },
  {
    year: '1820',
    title: 'Nasce il chinino',
    body:
      'I chimici francesi Pierre Joseph Pelletier e Joseph Bienaimé Caventou isolano dalla corteccia il principio attivo, il chinino. Diventa possibile dosarlo con precisione e produrlo su larga scala.',
  },
  {
    year: '1840–1860',
    title: 'L’India britannica',
    body:
      'Nelle colonie tropicali gli ufficiali britannici assumono chinino ogni giorno contro la malaria. È amarissimo, quindi lo sciolgono in acqua gassata con zucchero e lime. Aggiungerci la razione di gin è il passo successivo, ed è così che nasce il gin tonic.',
  },
  {
    year: '1858',
    title: 'La prima acqua tonica',
    body:
      'L’inglese Erasmus Bond brevetta un «liquido tonico aerato migliorato», considerato la prima acqua tonica commerciale. Nel 1870 arriva la Indian Tonic Water di Schweppes, l’azienda fondata a Ginevra nel 1783 da Jacob Schweppe.',
  },
  {
    year: 'Novecento',
    title: 'Da medicina a classico',
    body:
      'Il gin tonic diventa il drink simbolo dei circoli coloniali e poi dei bar di tutto il mondo. A Winston Churchill viene attribuita la frase secondo cui il gin tonic avrebbe salvato più vite inglesi di tutti i medici dell’Impero. La citazione però non è documentata.',
  },
  {
    year: 'Anni 2000',
    title: 'La rinascita',
    body:
      'In Spagna, a partire dai Paesi Baschi, il «gintonic» si serve nel grande calice a balloon, con tanto ghiaccio e guarnizioni studiate per ogni gin. Nel 2005 nasce Fever-Tree e, con lei, il mercato delle toniche premium. L’esplosione dei gin artigianali fa il resto.',
  },
];

export function GinTonicPage() {
  return (
    <article className="article-page">
      <p className="article-page__eyebrow">Storia</p>
      <h1 className="display article-page__title">La storia del gin tonic</h1>
      <p className="article-page__lead">
        Il cocktail più semplice del mondo nasce da un problema di salute: rendere bevibile il
        chinino, l’unica difesa contro la malaria nelle colonie dell’Impero britannico.
      </p>

      <ol className="timeline">
        {TIMELINE.map((t) => (
          <li key={t.year} className="timeline__item">
            <div className="timeline__year display">{t.year}</div>
            <div>
              <h2 className="timeline__title">{t.title}</h2>
              <p>{t.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <h2 className="display article-page__h2">Curiosità</h2>
      <ul className="article-list">
        <li>
          Il chinino delle toniche moderne è troppo poco per avere un effetto contro la malaria:
          oggi serve solo a dare il caratteristico amaro.
        </li>
        <li>
          Il chinino è fluorescente: sotto una luce ultravioletta (luce di Wood) il gin tonic si
          illumina di un azzurro brillante.
        </li>
        <li>
          Nella Royal Navy il gin era la bevanda degli ufficiali, il rum quella dei marinai. Con
          il succo di lime contro lo scorbuto, il gin dava vita a un altro classico, il Gimlet.
        </li>
      </ul>

      <h2 className="display article-page__h2">La ricetta classica</h2>
      <div className="recipe">
        <ul className="recipe__ingredients">
          <li>
            <strong>50 ml</strong> di gin
          </li>
          <li>
            <strong>150 ml</strong> di acqua tonica ben fredda
          </li>
          <li>Molto ghiaccio</li>
          <li>Una scorza di limone o uno spicchio di lime</li>
        </ul>
        <p>
          Riempi di ghiaccio un bicchiere alto (highball) o un calice a balloon. Versa il gin, poi
          la tonica lentamente, lungo un cucchiaio da bar, per non disperdere le bollicine. Mescola
          appena e completa con la guarnizione. Il rapporto va da 1:2 a 1:3: più tonica rende il
          drink più dissetante, meno tonica fa emergere le botaniche del gin.
        </p>
      </div>
    </article>
  );
}
