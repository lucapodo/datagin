# Fonti e note editoriali — L'Atlante del Gin

## Natura del progetto

"L'Atlante del Gin" è un progetto editoriale indipendente, di carattere informativo e divulgativo,
dedicato al mondo del gin nel suo complesso. **Non è un sito ufficiale di alcun marchio, distilleria
o gruppo del settore**, e non ha alcuna affiliazione, sponsorizzazione o rapporto commerciale con i
produttori citati. I marchi e i prodotti menzionati appartengono ai rispettivi titolari; il loro
utilizzo qui ha finalità puramente descrittiva e di rassegna, nello stesso spirito con cui una guida
enogastronomica indipendente presenta vini, birre o distillati reali.

## Come sono stati compilati i contenuti

- I dati fattuali (nazione/regione di produzione, distilleria, anno di fondazione/lancio, tipologia
  di gin, botaniche principali dichiarate dal produttore) derivano da conoscenza generale pubblica
  del settore, non da una singola fonte proprietaria né da testi copiati da siti ufficiali.
- I campi descrittivi `characteristics` (profilo di gusto) e `anecdote` (curiosità/aneddoto) sono
  scritti in forma originale dal team editoriale: non sono traduzioni né copie di materiale prodotto
  dai marchi o da terzi. Dove non si disponeva di un aneddoto storico verificabile con ragionevole
  certezza, si è preferito descrivere una caratteristica distintiva reale del prodotto o del metodo
  di produzione, evitando di inventare fatti presentati come veri (premi, citazioni, eventi storici
  fittizi).
- Alcuni dati minori (es. anno esatto di lancio di una particolare espressione, dettagli societari)
  sono indicati con ragionevole ma non assoluta certezza; in caso di dubbio significativo si è scelto
  di essere prudenti nella formulazione piuttosto che affermare un fatto non verificato.

## Prezzi

I prezzi indicati nel campo `price` sono **fasce indicative in EUR**, basate sul posizionamento di
mercato generale del prodotto (fascia da supermercato, fascia premium, fascia artigianale/di nicchia).
Non rappresentano il prezzo esatto di un singolo rivenditore o mercato specifico e possono variare
sensibilmente in base al paese, al formato della bottiglia e al canale di vendita. Vanno intesi come
un orientamento, non come un dato commerciale accurato o aggiornato in tempo reale.

## Link

Il campo `link`, quando presente, punta al sito che si ritiene con ragionevole certezza essere quello
ufficiale del produttore. Quando questa certezza non c'era, il campo è stato lasciato `null`
volutamente, invece di indovinare o inventare un URL plausibile ma potenzialmente errato.

## Immagini

Il campo `image` è sempre impostato a `null`: il progetto non dispone dei diritti d'uso su fotografie
di prodotto reali dei marchi citati, e non ne utilizza di reperite online senza licenza. Il frontend
mostra un'illustrazione vettoriale segnaposto ogni volta che `image` è `null`.

## Aggiornamenti

Il settore del gin è in continua evoluzione (nuove distillerie, cambi di ricetta, acquisizioni). I
contenuti di questo file vanno considerati un'istantanea editoriale e non una fonte aggiornata in
tempo reale: per informazioni ufficiali e aggiornate su un prodotto specifico si rimanda sempre al
sito del produttore.

## Copertura geografica (espansione a scala globale)

A partire da una prima selezione di 47 gin distribuiti su 17 nazioni (Regno Unito, Italia, Spagna,
Germania, Paesi Bassi, Francia, Belgio, Austria, Svizzera, Portogallo, Stati Uniti, Giappone, India,
Filippine, Sudafrica, Australia, Svezia), il database è stato ampliato con l'obiettivo di rappresentare
la crescita globale del gin artigianale dell'ultimo decennio. Per ogni nuova nazione è stata inclusa
almeno una voce solo quando è stato possibile identificare con ragionevole certezza un marchio e una
distilleria realmente esistenti; ricerche mirate (anche tramite fonti web di settore) sono state usate
per verificare nome del produttore, luogo di produzione e botaniche dichiarate.

Il database copre ora **72 nazioni** e **102 gin**. Le 55 nazioni aggiunte in questo passaggio sono:

- **Europa (22):** Irlanda, Norvegia, Danimarca, Finlandia, Islanda, Polonia, Repubblica Ceca,
  Ungheria, Grecia, Croazia, Estonia, Malta, Slovenia, Serbia, Romania, Bulgaria, Lituania, Lettonia,
  Slovacchia, Cipro, Macedonia del Nord, Ucraina.
- **Africa (7):** Kenya, Uganda, Nigeria, Namibia, Ghana, Etiopia, Zambia.
- **Asia e Medio Oriente (12):** Cina, Corea del Sud, Taiwan, Vietnam, Tailandia, Singapore,
  Indonesia, Malesia, Sri Lanka, Israele, Nepal, Libano.
- **Nord America (2):** Canada, Messico.
- **Sud America (10):** Argentina, Brasile, Perù, Cile, Colombia, Uruguay, Ecuador, Venezuela,
  Bolivia, Paraguay.
- **Oceania (2):** Nuova Zelanda, Figi.

### Nazioni verificate ma escluse per assenza di un gin reale identificabile con certezza

Per le seguenti nazioni sono state condotte ricerche mirate senza trovare un marchio di gin
realmente prodotto in loco che si potesse citare con ragionevole sicurezza (nome del produttore,
sede della distillazione e prodotto esistente confermati insieme). Si è scelto di ometterle piuttosto
che indovinare:

- **Africa:** Marocco (i gin "ispirati al Marocco" reperiti sono distillati nel Regno Unito o in
  Francia, non in loco), Zimbabwe, Mauritius, Tanzania, altri paesi dell'Africa centrale/occidentale
  non citati sopra.
- **Medio Oriente / Asia Centrale:** Turchia (mercato del gin in crescita ma nessun marchio
  interamente prodotto in loco confermato con certezza), Georgia (esiste una distilleria artigianale
  a Tbilisi che produce anche gin, ma non è stato possibile confermare il nome esatto del prodotto),
  Giordania, Emirati Arabi Uniti e altri paesi del Golfo (produzione di alcolici assente o non
  documentabile).
- **Caraibi e Centro America:** Giamaica, Trinidad e Tobago, Costa Rica, Barbados, Cuba, Repubblica
  Dominicana, Panama (distillerie storiche orientate quasi esclusivamente al rum; nessun gin locale
  affermato identificato con certezza).
- **Balcani e piccoli stati europei:** Albania, Bosnia ed Erzegovina, Montenegro, Lussemburgo,
  Andorra, Monaco, San Marino, Città del Vaticano, Liechtenstein (nessuna industria distillatoria
  del gin documentabile).
- **Asia:** Pakistan, Bangladesh, Myanmar, Laos, Cambogia, Mongolia, Bhutan, Brunei (assenza di
  un'industria del gin nota o forti restrizioni sulla produzione di alcolici).
- **Microstati e piccoli stati insulari:** la maggior parte dei microstati europei, molti piccoli
  stati insulari del Pacifico (oltre a Figi) e dei Caraibi non hanno una distilleria di gin nota.

Questa lista non è necessariamente esaustiva rispetto a tutte le circa 190 nazioni del mondo, ma
riflette le verifiche effettuate in questo passaggio di lavoro; ulteriori nazioni potranno essere
aggiunte in futuro se emergeranno marchi reali verificabili.

## Secondo giro di espansione: approfondimento delle nazioni esistenti

A partire dalla base di 102 gin su 72 nazioni descritta sopra, si è deciso di superare il vincolo
"almeno un gin per nazione" e di cercare, nazione per nazione, ulteriori marchi realmente prodotti
in loco, con priorità alle nazioni che avevano una sola voce (60 su 72). Ogni nuova voce è stata
verificata tramite ricerche mirate (fonti di settore, siti dei produttori, guide specializzate al
gin) prima di essere inclusa, seguendo lo stesso principio guida di sempre: nessuna invenzione, e
nessun riempimento "a numero". Dove le ricerche non hanno restituito marchi aggiuntivi verificabili
con ragionevole certezza, la nazione è stata lasciata invariata.

Il database è ora composto da **147 gin distribuiti su 75 nazioni**. Le nazioni approfondite con
una o più voci aggiuntive, con il nuovo conteggio totale per ciascuna, sono:

- **Regno Unito** (10 → 17): aggiunti Whitley Neill, Silent Pool Gin, Cotswolds Dry Gin, Martin
  Miller's Gin, Portobello Road Gin, Isle of Harris Gin, Blackwoods Gin.
- **Italia** (6 → 8): aggiunti Bordiga Dry Gin (Distilleria Bordiga, Cuneo, dal 1888) e Macchia Gin
  Selvaggio (Sardegna).
- **Germania** (3 → 6): aggiunti Elephant Gin, Windspiel Premium Dry Gin, Ferdinand's Saar Dry Gin.
- **Stati Uniti** (4 → 6): aggiunti Junipero Gin (San Francisco) e Barr Hill Gin (Vermont).
- **Spagna** (4 → 5): aggiunto Xoriguer Gin de Mahón (Minorca), uno dei pochi gin al mondo con
  Denominazione d'Origine europea.
- **Australia** (2 → 5): aggiunti Never Never Triple Juniper Gin, The West Winds Gin (The Cutlass),
  Poor Toms Sydney Dry Gin.
- **Paesi Bassi** (3 → 4): aggiunto Bobby's Schiedam Dry Gin.
- **Giappone** (2 → 4): aggiunti Nikka Coffey Gin e Sakurao Gin.
- **India** (2 → 4): aggiunti Jaisalmer Gin e Greater Than Gin.
- **Irlanda** (1 → 4): aggiunti Dingle Gin, Glendalough Wild Botanical Gin, Blackwater No. 5 Gin.
- **Francia** (2 → 3): aggiunto Magellan Gin.
- **Svizzera** (2 → 3): aggiunto Xellent Swiss Edelweiss Gin.
- **Portogallo** (1 → 3): aggiunti Big Boss Gin e Black Pig Costa Alentejana Gin.
- **Norvegia** (1 → 3): aggiunti Harahorn Gin e Himkok Gin.
- **Canada** (1 → 3): aggiunti Empress 1908 Gin e Dillon's Dry Gin No. 7.
- **Belgio** (1 → 2): aggiunto Poppies Gin (Distilleria Rubbens, Zele).
- **Austria** (1 → 2): aggiunto Reisetbauer Blue Gin.
- **Svezia** (1 → 2): aggiunto Spirit of Hven Organic Gin (Isola di Hven).
- **Finlandia** (1 → 2): aggiunto Helsinki Dry Gin.
- **Cina** (1 → 2): aggiunto Julu Gin (Shanghai/Isola di Chongming).
- **Corea del Sud** (1 → 2): aggiunto Jung One (Ki One Distillery).
- **Messico** (1 → 2): aggiunto Condesa Gin (Città del Messico).
- **Brasile** (1 → 2): aggiunto Kalvelage London Dry Gin (Santa Catarina).

### Nuove nazioni aggiunte in questo secondo giro

Durante le ricerche sono emersi tre marchi reali e verificabili in nazioni non ancora presenti nel
database, tutti con distilleria e produzione confermate in loco:

- **Zimbabwe**: Falls Gin, prodotto dalla Victoria Falls Distilling Co. direttamente nella località
  delle Cascate Vittoria.
- **Tanzania**: Gin of Africa, distillato alla Old Moshi Distillery di Arusha con il frutto di un
  baobab millenario raccolto in un'area gestita dalla comunità masai.
- **Georgia**: Malamo, gin lanciato nel 2023 a Tbilisi, tra i primi London Dry Gin prodotti
  interamente in Georgia.

### Nazioni ricercate ma non ampliate in questo giro

Per le seguenti nazioni sono state condotte nuove ricerche mirate senza trovare, questa volta,
marchi aggiuntivi (o nuovi marchi per nazioni assenti) verificabili con ragionevole certezza; sono
quindi rimaste invariate rispetto al giro precedente:

- **Marocco**: confermata l'assenza di gin realmente distillati in loco; i prodotti "ispirati al
  Marocco" reperiti restano distillati nel Regno Unito.
- **Turchia**: il gin "Anatolia Turkish Delight", pur ispirato alla cultura turca, risulta distillato
  a Manchester, nel Regno Unito, e non in Turchia.
- Non sono state trovate ulteriori voci verificabili per la maggior parte delle 51 nazioni rimaste a
  una sola voce (ad es. Danimarca, Islanda, Polonia, Repubblica Ceca, Ungheria, Grecia, Croazia,
  Estonia, Malta, Slovenia, Serbia, Romania, Bulgaria, Lituania, Lettonia, Slovacchia, Cipro,
  Macedonia del Nord, Ucraina, gran parte dell'Africa subsahariana già coperta, Vietnam, Tailandia,
  Singapore, Indonesia, Malesia, Sri Lanka, Israele, Nepal, Libano, Argentina, Perù, Cile, Colombia,
  Uruguay, Ecuador, Venezuela, Bolivia, Paraguay, Nuova Zelanda, Figi): ricerche più approfondite in
  futuro potrebbero comunque far emergere marchi realmente prodotti in questi paesi che al momento
  non è stato possibile confermare con certezza sufficiente.

### Dati da trattare con cautela

Per alcune delle nuove voci l'anno di produzione (`productionYear`) è una stima prudente basata
sulla data di fondazione dell'azienda produttrice più che sul lancio esatto di quel prodotto specifico
(è il caso, ad esempio, di Chelsea Dry Gin/Nigeria, Apet Dry Gin/Ghana e Baro's Dry Gin/Etiopia, i cui
gruppi produttori sono più antichi del prodotto stesso ma per cui non è stato possibile determinare
con certezza l'anno esatto di lancio del gin). Anche alcune coordinate geografiche di distillerie molto
piccole o recenti sono approssimate alla città o regione più vicina in mancanza di un indirizzo
pubblico preciso.

## Revisione geografica (ottobre 2026)

Tutte le 147 voci sono state ricontrollate sul luogo reale di distillazione/produzione. Le voci corrette
e la fonte usata per ciascuna:

| id | correzione | fonte |
|---|---|---|
| vecchio-magazzino-doganale-gin | San Vito dei Normanni (Puglia) → Montalto Uffugo (CS), Calabria | https://www.vino.com/en/produttore/vecchio-magazzino-doganale |
| sabatini-gin | Montalcino (Italia) → distillato a Londra da Thames Distillers; botaniche da Teccognano, Cortona (AR) | https://www.gin-foundry.com/gin/sabatini-gin/ |
| gin-del-professore | Torino → Antica Distilleria Quaglia, Castelnuovo Don Bosco (AT) | https://www.callmewine.com/en/gin-monsieur-del-professore-P6487.htm |
| macchia-gin-selvaggio | coordinate generiche → Berchidda (SS) | https://vinodabere.it/dalla-sardegna-i-profumi-mediterranei-nei-distillati-dellazienda-macchia-di-emilio-rocchino/ |
| puerto-de-indias-classic | Córdoba → Carmona (Siviglia) | https://ginpuertodeindias.com/en/visit-us/ |
| nordes-atlantic-galician-gin | → Vedra (A Coruña) | https://nordesgin.com/blog-nordes/casa-nordes-el-enclave-donde-descubrir-origen-de-nordes-gin/ |
| monkey-47-schwarzwald-dry-gin | Löffingen → Loßburg-Betzweiler | https://www.vinorama.at/Destillerien/Black-Forest-Distillers-Lossburg-Betzweiler/Monkey-47-Schwarzwald-Dry-Gin.html |
| duke-munich-dry-gin | Monaco centro → Aschheim | https://theduke-gin.de/en/pages/destillerie |
| sharish-gin | Arraiolos → Reguengos de Monsaraz | https://sharishgin.pt/distillery/?lang=en |
| stin-gin-kitzbuhel | Kitzbühel (Tirolo) → Ehrenhausen an der Weinstraße (Stiria) | https://www.falstaff.com/en/spiritproducer/stin |
| studer-swiss-gin | coordinate corrette su Escholzmatt | https://www.distillery.ch/ |
| nginious-vermouth-cask-gin | Neuchâtel → Basilea (Liquid Spirit Distillery) | https://www.falstaff.com/en/spirits/nginious-nginious-swiss-blended-gin-1 |
| musgrave-gin | Durban → Salt River, Città del Capo | https://thirstytraveler.co.za/south-africa-craft-gin-tasting-musgrave-gin/ |
| chelsea-dry-gin | Lagos → Ota (Ogun State) | https://idlng.com/?product=chelsea-dry-gin |
| paper-lantern-gin | Kuala Lumpur (Malesia) → Vietnam settentrionale (marchio con sede a Singapore) | https://drinkpaperlantern.com/international-craft-gin/ |
| colombo-no-7-gin | Colombo (Sri Lanka) → Langley Distillery, Oldbury (Inghilterra) | https://www.theginguide.com/colombo-gin-review-and-tasting-notes.html |
| vovis-gin | Malta → Paesi Bassi (distillazione per conto terzi) | https://lovinmalta.com/news/maltas-spirit-producers-cant-make-their-products-on-the-island-heres-why/ |
| origin-veliki-preslav-gin | Veliki Preslav (Bulgaria) → Inghilterra (Master of Malt, Kent); solo il ginepro è bulgaro | https://www.masterofmalt.com/gin/origin/origin-veliki-preslav-bulgaria-gin/ |
| gingin-slovakia | Slovacchia occidentale → Porúbka (Žilina) | https://www.startitup.sk/local-slovensko-ma-svoj-prvy-premiovy-gin-nesie-odkaz-tradicneho-bylinkarstva-aj-modrotlace/ |
| aoratos-dry-gin | Cipro generico → Tseri (Nicosia) | https://aristidesdistilling.eu/contact-us/ |
| lunin-first-ukrainian-dry-gin | Kyiv generico → Verkhniakivtsi (Ternopil) | https://lunindistillery.com/ |
| ungava-gin | Frelighsburg → Cowansville | https://www.easterntownships.org/things-to-do/5011/les-spiritueux-ungava |
| gracias-a-dios-agave-gin | Oaxaca città → Santiago Matatlán | https://www.mezcalreviews.com/mezcal/gracias-dios-gin/ |
| amazzoni-gin | coordinate di Resende → Barra Mansa (Fazenda Cachoeira) | https://www.theginguild.com/ginopedia/gin-distillery/destilaria-rocha-do-brasil-home-of-amazzoni-gin/ |
| tepaluma-gin | Regione dei Laghi → La Junta (Aysén) | https://www.tepaluma.com/patagoniandistillery |
| selva-gin-colombia | Bogotá → Cartagena de Indias | https://www.7canibales.com/beber/destilados/selva-gin-caribe/ |
| cruzloma-gin | Nayón → Tumbaco | https://www.linkedin.com/in/daniel-gonz%C3%A1lez-alday-489032b9/ |
| canaima-gin | Barinas → La Miel (Lara), Destilerías Unidas | https://www.thespiritsbusiness.com/2025/08/behind-the-scenes-at-canaima-gin/ |
| blue-turtle-gin | Figi generico → Pacific Harbour | https://tdcfiji.com/blue-turtle-gin-fiji/ |
| martin-millers-gin | Langley (Berkshire) → Langley, Oldbury (West Midlands) | https://www.diffordsguide.com/beer-wine-spirits/225/martin-millers-gin |
| blackwoods-gin | Shetland → Ardgowan Estate, Inverkip (dal 2024) | https://en.wikipedia.org/wiki/Blackwoods_Gin |
| poppies-gin | Zele → Wichelen (Rubbens trasferita dal 2014) | https://en.wikipedia.org/wiki/Rubbens_(distillery) |
| reisetbauer-blue-gin | coordinate corrette su Axberg/Kirchberg-Thening | https://www.skurnik.com/sku/blue-gin-hans-reisetbauer/ |
| black-pig-costa-alentejana-gin | → Vila Nova de Santo André | https://www.nauticalportugal.com/estacoes-nauticas/alentejo-e-ribatejo/estacao-nautica-de-sines/pontos-de-interesse/natureza/geo_artigo/destilaria-black-pig-56 |
| empress-1908-gin | Victoria → Sidney (BC) | https://www.cocktailsaway.com/blog/victoria-distillers-home-of-empress-1908-gin/ |
| kalvelage-london-dry-gin | → Botuverá (SC) | https://bomgourmet.com/bomgourmet/bebidas/gim-catarinense-kalvelage/ |
| barr-hill-gin | Hardwick → Montpelier (dal 2019) | https://en.wikipedia.org/wiki/Caledonia_Spirits |
| ginebra-san-miguel | Manila → Cabuyao (Laguna) | https://en.wikipedia.org/wiki/Ginebra_San_Miguel |
| glendalough-wild-botanical-gin | → Newtownmountkennedy | https://www.theginguild.com/ginopedia/gin-distillery/glendalough-distillery/ |
| bombay-sapphire | coordinate corrette su Laverstoke Mill | https://www.bombaysapphire.com/distillery/plan-your-visit/ |
| beefeater-london-dry | Londra centro → Kennington | https://en.wikipedia.org/wiki/Beefeater_Gin |
| stranger-and-sons-gin | Goa generico → Ponda | https://www.theginguild.com/ginopedia/gin-producers/stranger-and-sons/ |
| uganda-waragi | Kampala centro → Port Bell/Luzira | (stesso stabilimento già indicato in `producedIn`) |
| archie-rose-signature-dry-gin | Sydney centro → Botany/Rosebery | https://www.thespiritsbusiness.com/2020/11/archie-rose-kicks-off-production-at-second-distillery/ |
| gvine-floraison | Charente generico → Merpins | https://www.theginguide.com/gin-blog/gvine-gin-distillery |
| caorunn-gin, kyro-napue-gin, drumshanbo-gunpowder-irish-gin, magellan-gin | solo affinamento coordinate sulla località già indicata | — |

Nota: con lo spostamento di Vovis, Origin, Colombo No. 7 e Paper Lantern verso il loro reale paese di
distillazione, Malta, Bulgaria, Sri Lanka e Malesia non hanno più alcuna voce; il database copre ora
71 nazioni. `selva-dargento` (Selva d'Argento) non risulta come prodotto reale ed è da considerarsi
segnaposto.

## Gin delle isole remote (ottobre 2026)

Ricerca mirata su gin realmente distillati su isole isolate del Pacifico e dell'Atlantico (e nell'Artico).
Il database passa a **187 gin su 74 nazioni**, con tre nuovi territori: Isole Cook, Isole Falkland e
Isole Fær Øer. Le verifiche sono state fatte tramite ricerca web, perché il firewall della sandbox
blocca l'apertura diretta dei siti dei produttori.

| id | isola | fonte |
|---|---|---|
| tavake-gin | Rarotonga (Isole Cook) | https://www.rnz.co.nz/news/pacific/573110/rarotongan-husband-and-wife-team-start-new-distillery-that-crafts-spirits-from-taro-leaves |
| island-gin-great-barrier | Great Barrier Island (Nuova Zelanda) | https://www.nzherald.co.nz/viva/food-drink/meet-the-one-woman-craft-gin-distiller-making-waves-on-great-barrier-island/NVDEOKGXZRASZ6WJGSXUGBXHTQ/ |
| lord-howe-wild-lemon-hibiscus-gin | Lord Howe Island (Australia) | https://australiandistillers.org.au/NSW-ACT-News/13333186 |
| kangaroo-island-wild-gin | Kangaroo Island (Australia) | https://theginqueen.com/2022/04/kangaroo-island-spirits/ |
| fid-street-hawaiian-gin | Maui (Hawaii) | https://thedailypour.com/spirit/fid-st-hawaiian-gin/ |
| darwins-botanicals-gin | Falkland Orientale | https://www.thedrinksbusiness.com/2026/07/meet-the-man-bottling-the-spirit-of-the-falkland-islands/ |
| tumbledown-falkland-islands-gin | Falkland Orientale | https://www.theginguide.com/tumbledown-distillery.html |
| faer-isles-north-atlantic-dry-gin | Streymoy (Fær Øer) | https://guidetofaroeislands.fo/tour-operator-tours-holiday/faer-isles-distillery/ |
| shetland-reel-original-gin | Unst (Shetland) | https://en.wikipedia.org/wiki/Saxa_Vord_distillery |
| macaronesian-white-gin | Tenerife (Canarie) | https://www.finedrams.com/macaronesian-white-gin.html |

Note di cautela:
- Le liste `botanicals` contengono solo le botaniche dichiarate pubblicamente. Per alcuni gin sono
  incomplete: Shetland Reel ne dichiara 9 ma ne sono state confermate 6, e Lord Howe e Kangaroo Island
  ne indicano solo alcune. In ogni voce `botanicalsCount` corrisponde alle botaniche elencate.
- `fid-street-hawaiian-gin`: l'anno 2010 è quello di fondazione della Hali'imaile Distilling Company,
  perché l'anno esatto di lancio del gin non è stato trovato. `kangaroo-island-wild-gin`: 2006 è l'anno
  di fondazione della distilleria.
- `tumbledown-falkland-islands-gin`: le fonti indicano date diverse (2016, 2018, 2021); è stato usato il
  2018 indicato dal sito del marchio. Il prezzo è alto perché il gin viene venduto nel Regno Unito a circa 139 £.
- `faer-isles-north-atlantic-dry-gin` e `macaronesian-white-gin`: `link` è `null` perché non è stato
  possibile confermare con certezza il sito ufficiale.

Esclusi:
- **Jamestown Gin** (St Helena Distillery, Sant'Elena): era l'unico gin al mondo con ginepro delle Bermuda,
  ma la distilleria risulta chiusa dopo la morte del titolare.
- **Q Gin** (Q Distillery, Narsaq, Groenlandia) e **Svalbard Spirits** (Longyearbyen): i produttori esistono,
  ma non è stato possibile verificare l'anno e, per Svalbard, il nome del prodotto e le botaniche.
- **Goshawk Azores Gin** (Ribeira Grande, São Miguel): indicato come primo gin distillato alle Azzorre, ma
  l'anno di lancio non è stato trovato. **Ghosts of the Ocean** e **Azor**: il luogo esatto di distillazione
  non è confermato.
- Nessun gin prodotto sul posto è stato trovato per Capo Verde, Madeira, Tahiti, Samoa, Isola di Pasqua,
  Galápagos e Tristan da Cunha.

## Stati Uniti: gin degli stati dell'interno e dell'Alaska (ottobre 2026)

Prima di questo giro le voci americane erano quasi tutte delle coste. Sono stati aggiunti cinque gin
di stati non ancora presenti, scelti per le botaniche locali particolari. Il database passa a
**192 gin su 74 nazioni**, di cui 12 negli Stati Uniti. Anche queste voci sono state verificate con
ricerca web, perché il firewall della sandbox blocca l'apertura diretta dei siti.

| id | stato | fonte |
|---|---|---|
| waterloo-no-9-gin | Texas | https://www.texasmonthly.com/food/9-texas-gins-to-drink-now/ |
| amalga-juneauper-gin | Alaska | https://ediblealaska.ediblecommunities.com/drink/drink-juneau-distilled/ |
| wheelers-western-dry-gin | Nuovo Messico | https://www.everettpotter.com/2020/12/colin-keegan-the-architect-of-santa-fe-spirits/ |
| brush-creek-gin | Wyoming | https://bigskyjournal.com/round-up-brush-creek-distillery/ |
| new-riff-kentucky-wild-gin | Kentucky | https://www.insidehook.com/spirits/bourbon-country-kentucky-gin |

Note di cautela:
- `wheelers-western-dry-gin`: il 2013 è l'anno del primo articolo trovato che cita il gin (Santa Fe
  Spirits è stata fondata nel 2010). `link` è `null` perché non è stato possibile confermare il sito.
- `new-riff-kentucky-wild-gin`: il 2014 è l'anno di apertura della distilleria; l'anno di lancio del gin
  non è stato trovato. Una fonte parla di 12 botaniche, ma ne sono state confermate 11.
- `brush-creek-gin`: sono indicate solo le botaniche citate pubblicamente (ginepro, iris, camomilla).

Trovati ma non aggiunti: Old Yaupon Gin (Treaty Oak, Texas), Still Austin Gin (Texas), 50 Fathoms Gin
(Port Chilkoot, Alaska), Skagway Spirits (Alaska), VARA High Desert Gin e As Above, So Below (Nuovo
Messico), Canyon Diablo Desert Rain (Arizona), Old Harbor 1542 e Giant Rock Gin (California),
Frey Ranch Gin (Nevada). Si potranno aggiungere in futuro dopo una verifica dettagliata.

## Asia e Sud America: luoghi insoliti (ottobre 2026)

Sono stati aggiunti otto gin, con due nuove nazioni: **Cambogia** e **Armenia**. Il database passa a
**200 gin su 76 nazioni**. Anche queste voci sono state verificate con ricerca web, perché il firewall
della sandbox blocca l'apertura diretta dei siti.

| id | luogo | fonte |
|---|---|---|
| masahiro-okinawa-gin | Itoman, Okinawa (Giappone) | https://www.tatlerasia.com/dining/drinks/hk-flavours-from-okinawa-how-masahiro-okinawa-craft-gin-changed-the-game |
| porcelain-shanghai-dry-gin | presso Tieling, Liaoning (Cina) | https://www.velier.it/en/gin/6556-porcelain-distillery.html |
| dragons-blood-gin | Chifeng, Mongolia Interna (Cina) | https://www.bottledinchina.com/gin-dragons/bottledinchina |
| seekers-mekong-dry-gin | Phnom Penh (Cambogia) | https://www.seekersspirits.com/mekong-dry |
| vogis-gin | Armenia | https://www.theginguide.com/gin-blog/vogis-gin-interview |
| gin-nativo-atacama | El Tránsito, Atacama (Cile) | https://comomegusta.cl/gin-nativo-aroma-y-sabor-del-desierto-de-atacama-elaborado-solo-por-mujeres/ |
| last-hope-calafate-gin | Puerto Natales (Cile) | https://www.afar.com/magazine/chiles-patagonia-region-serves-up-this-small-batch-distillery |
| jeremy-button-gin | Ushuaia (Argentina) | https://argentina.viajando.travel/ushuaia/ushuaia-se-suma-al-fenomeno-del-gin-jeremy-button-n38275 |

Note di cautela:
- `dragons-blood-gin`: l'anno di lancio non è noto. 2019 è l'anno della prima fonte datata che ne
  parla (un podcast del maggio 2019). Il tipo è "Compound Gin" perché le botaniche sono in parte
  distillate e in parte macerate a freddo. `link` è `null`.
- `jeremy-button-gin`: l'anno di lancio non è noto. 2022 è l'anno del primo articolo datato trovato.
- `last-hope-calafate-gin`: 2017 è l'anno di apertura della distilleria.
- `porcelain-shanghai-dry-gin`: 2022 è l'anno del lancio ufficiale (la distilleria ha aperto nel 2019).
  Sono elencate le 12 botaniche dichiarate su 18 totali.
- `gin-nativo-atacama`: le fonti dicono 13 botaniche in tutto; ne sono elencate 7. `link` è `null`.
- `vogis-gin`: si sa solo che la sede è a Yerevan; il luogo esatto della distilleria non è stato trovato.

Esclusi:
- (Q Gin è stato poi aggiunto: vedi sotto.)
- **Isfjord Arctic Gin**: usa acqua di iceberg della Groenlandia ma è distillato in Danimarca.
- **Gin Malaya** (Malesia): distillato a Glasgow da Crossbill Distilling.
- **Myanmar Dry Gin**, **Istak** (Armenia), **Gin Provincia** e **La República Amazónica**: trovati ma
  non ancora verificati nel dettaglio.
- Nessun gin prodotto sul posto è stato trovato per Mongolia, Kazakistan, Uzbekistan, Kirghizistan, Laos,
  Sri Lanka, Guyana, Suriname e Guyana francese.

### Groenlandia: Q Gin

Aggiunto `q-gin-greenland` (Q Distillery, Narsaq; fonte: https://www.distillery.gl/product-page/greenlandic-botanical-gin).
Il database passa a **201 gin su 77 nazioni**. L'anno di fondazione o di lancio non è stato trovato:
`productionYear` è `null` e il frontend mostra "—". Per questo `productionYear` è ora tipizzato
`number | null` anche in `frontend/src/types.ts`, come già indicato nella pagina Open Data.
