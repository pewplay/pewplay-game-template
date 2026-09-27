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
├── index.html      ← punto di ingresso (obbligatorio)
├── game.js         ← logica del gioco
├── style.css       ← stili
├── game.json       ← titolo, descrizione, comandi… (vedi sotto)
├── preview.png     ← immagine quadrata 512×512 per la card
├── og.png          ← (facoltativa) 1200×630 per i link condivisi; se manca viene generata
└── .github/workflows/pewplay.yml  ← collegamento a PewPlay, non toccarlo
```

## `game.json`

```json
{
  "$schema": "https://raw.githubusercontent.com/pewplay/pewplay/main/schema/game.schema.json",
  "title": "My Game",
  "description": "Dodge the falling blocks for as long as you can…",
  "howToPlay": "Move left and right to avoid the red blocks…",
  "controls": [{ "input": "← →", "action": "Move" }],
  "category": "Arcade",
  "tags": ["dodge", "arcade"],
  "author": "Your name",
  "playMode": "SinglePlayer",
  "orientation": "any",
  "added": "2026-09-26",
  "draft": true
}
```

- Il sito è in inglese: scrivi i testi in inglese.
- `category`: `Action`, `Arcade`, `Board`, `Card`, `Casual`, `Educational`, `Puzzle`, `Racing`, `Sports`, `Strategy`, `Other`.
- `playMode`: `SinglePlayer`, `MultiPlayer`, `Both` · `orientation`: `any`, `landscape`, `portrait`.
- `featured: true` lo mette in cima alla home · `added` dà il badge "New" per 30 giorni.
- `exclude`: file o cartelle da non pubblicare, es. `["docs", "sources/*.psd"]`.

Con `$schema` VS Code suggerisce i campi e segnala gli errori. Il riferimento completo è nel README del repo `pewplay`.

## Regole per stare dentro PewPlay

**Consentito**
- Solo file statici: HTML, CSS, JS, immagini, audio, font, WebGL, WebAssembly, librerie da CDN.
- Framework (Phaser, Three.js, React…) vanno bene, ma **committa i file già compilati**: PewPlay non esegue `npm install` né build.
- **Percorsi relativi** (`src="game.js"`, non `src="/game.js"`): il gioco viene pubblicato in `/<nome-repo>/play/`.
- `localStorage` con prefisso unico (`GAME_ID + ':' + chiave`): tutti i giochi condividono il dominio.
- Metti in pausa quando la scheda non è visibile (`visibilitychange`), come nel template.

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

Il template contiene "dodge the blocks": canvas nitido su schermi retina, loop con delta time, tastiera/mouse/touch, pausa automatica, record salvato. Tienilo, modificalo o cancellalo.

## Licenza

MIT
