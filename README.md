# PewPlay Game Template

Punto di partenza per creare un gioco su [PewPlay](https://www.pewplay.com). HTML/CSS/JS puri: niente build, niente dipendenze. Il gioco è **indipendente**: funziona aprendo `index.html`, dentro PewPlay o su qualunque altro sito.

## Branch

| Branch | Dove finisce |
|---|---|
| `preview` | sito di anteprima (`preview.<progetto>.pages.dev`) |
| `main` | sito pubblico (`www.pewplay.com`) |

Si lavora su `preview`, si controlla l'anteprima, poi si fa il merge in `main`.

## Creare un nuovo gioco

1. Su GitHub: **Use this template → Create a new repository** nell'organizzazione PewPlay.
   Il nome del repo diventa l'indirizzo: `space-invaders` → `pewplay.com/space-invaders/`.
2. Clona e crea il branch di lavoro:
   ```bash
   git checkout -b preview
   ```
3. In `game.js` cambia `GAME_ID` con il nome del repo, poi sviluppa (apri `index.html` nel browser per provarlo).
4. Compila `game.json` e sostituisci `preview.png`.
5. `git push -u origin preview` → il gioco compare sul **sito di anteprima**. Il link diretto è nel riepilogo della GitHub Action (tab *Actions → PewPlay*).
6. Quando è pronto: togli `"draft": true` da `game.json`, fai il merge di `preview` in `main` (pull request o `git merge`) e push → online su pewplay.com.

> Il template parte con `"draft": true` perché, alla creazione del repo, il codice demo finisce subito su `main`: così non va sul sito pubblico per sbaglio.

## Aggiornare un gioco già online

```bash
git checkout preview
git merge main          # se serve, per ripartire dall'ultima versione pubblicata
# ...modifiche...
git push                # aggiorna SOLO il sito di anteprima
```
Quando va bene, merge di `preview` in `main`: si aggiorna il sito pubblico.

## File

```
├── index.html          ← punto di ingresso (obbligatorio)
├── game.js             ← logica del gioco
├── style.css           ← stili
├── game.json           ← testi e impostazioni della pagina del gioco (vedi sotto)
├── preview.png         ← icona quadrata 512×512: card in home, categorie, giochi correlati
├── cover.png           ← copertina 16:9, 1280×720: schermata "Play now" e immagine dei link condivisi
├── screenshots/        ← 2–4 screenshot 1280×720: galleria nella pagina del gioco
│   ├── 1.png
│   └── 2.png
├── og.png              ← (facoltativa) immagine per i link condivisi 1200×630; se manca viene generata
└── .github/workflows/pewplay.yml  ← collegamento a PewPlay, non toccarlo
```

Le immagini vengono ottimizzate dal sito (AVIF/WebP in più dimensioni): puoi caricarle in PNG o JPG senza preoccuparti del peso. `cover.png` e la cartella `screenshots/` non finiscono dentro il gioco pubblicato.

## `game.json`

Il file completo di esempio è `game.json` di questo template. Ogni campo compare in un punto preciso della pagina del gioco:

| Campo | Dove si vede | Consigli |
|---|---|---|
| `title` | titolo della pagina, card, risultati Google | 2–4 parole |
| `description` | sotto il titolo, risultati Google, link condivisi | **50–160 caratteri**, una frase che dice cosa si fa |
| `about` | sezione "About …" | 1–3 paragrafi (separa i paragrafi con `\n\n`). **È il testo più importante per Google**: scrivi cosa rende il gioco divertente, le modalità, i livelli |
| `howToPlay` | sezione "How to play" e pulsante **?** nella barra del gioco | regole in 2–4 frasi |
| `controls` | tabella "Controls" e pulsante **?** | `{ "input": "Space", "action": "Jump" }` |
| `tips` | elenco "Tips" | 2–5 consigli, una frase ciascuno |
| `faq` | domande e risposte in fondo alla pagina | 2–4 domande che un giocatore farebbe davvero |
| `category` | pagina di categoria (`/puzzle-games/`…), breadcrumb | `Action`, `Arcade`, `Board`, `Card`, `Casual`, `Educational`, `Puzzle`, `Racing`, `Sports`, `Strategy`, `Other` |
| `tags` | etichette, ricerca del sito | 3–6 parole chiave |
| `author` | "By …" in fondo alla scheda | |
| `playMode` | etichetta giocatori | `SinglePlayer`, `MultiPlayer`, `Both` |
| `orientation` | avviso "ruota il dispositivo" su mobile | `any`, `landscape`, `portrait` |
| `cover` | copertina (default: `cover.png`) | 16:9, 1280×720 |
| `screenshots` | galleria (default: tutte le immagini in `screenshots/`) | max 8, consigliati 2–4 |
| `featured` | il gioco compare tra i primi nella lista della home | `true` per pochi giochi di punta |
| `added` | badge "New" per 30 giorni, ordine in home | `AAAA-MM-GG` |
| `draft` | `true` = mai sul sito pubblico | toglilo quando fai il merge in `main` |
| `exclude` | file da non pubblicare | es. `["docs", "*.psd"]` |

Tutti i testi vanno in **inglese**. Solo `title` è davvero necessario; gli altri campi sono facoltativi ma ogni campo compilato rende la pagina più ricca per i giocatori e per Google. `npm run check` (o la GitHub Action) ti dice quali mancano.

Con `"$schema"` in cima, VS Code suggerisce i campi e segnala gli errori mentre scrivi.

### Come fare copertina e screenshot
- **Screenshot**: gioca, premi il tasto per lo screenshot della finestra del browser (o usa gli strumenti per sviluppatori → "Capture screenshot") con la finestra a 1280×720.
- **Copertina**: uno screenshot bello del gioco in azione va benissimo; meglio ancora un'immagine disegnata con i personaggi/elementi del gioco. Evita testo piccolo: il titolo lo aggiunge già il sito.

## Regole per stare dentro PewPlay

**Consentito**
- Solo file statici: HTML, CSS, JS, immagini, audio, font, WebGL, WebAssembly, librerie da CDN.
- Framework (Phaser, Three.js, React…) vanno bene, ma **committa i file già compilati**: PewPlay non esegue `npm install` né build.
- **Percorsi relativi** (`src="game.js"`, non `src="/game.js"`): il gioco viene pubblicato in `/<nome-repo>/play/`.
- `localStorage` con prefisso unico (`GAME_ID + ':' + chiave`): tutti i giochi condividono il dominio.
- Metti in pausa quando la scheda non è visibile (`visibilitychange`), come nel template.
- Se il gioco usa swipe o trascinamenti, metti `touch-action: none` sull'area di gioco (come fa il `canvas` del template): altrimenti lo swipe muove anche la pagina. Lascia invece libero lo scorrimento sulle parti che non servono a giocare. Per scorrere la pagina c'è sempre la barra sotto il gioco.

**Non consentito**
- Codice server (Node, PHP, Python) o database.
- File oltre i 25 MB (limite Cloudflare Pages).

## Provare il gioco dentro il sito, in locale

Clona `pewplay` accanto al tuo gioco:

```
cartella/
├── pewplay/
└── mio-gioco/
```
```bash
cd pewplay
npm install
npm run check -- ../mio-gioco                    # controllo veloce
npm run dev -- --games .. --only mio-gioco       # http://localhost:8080
```

## Il gioco demo

Il template contiene "dodge the blocks" con `game.json` compilato in ogni campo, copertina e screenshot: usalo come esempio: canvas nitido su schermi retina, loop con delta time, tastiera/mouse/touch, pausa automatica, record salvato. Tienilo, modificalo o cancellalo.

## Licenza

MIT
