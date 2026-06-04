# Portfolio — Pin Board (MVP)

Interaktywne portfolio w formie płótna (canvas) w stylu Figmy. Centralny napis „PORTFOLIO”,
wokół rozmieszczone foldery (Graphic Design, Motion, Case Study) oraz karta „Hello, I'm Damian”.
Całe płótno przesuwa się myszą (drag-to-pan).

Pełna specyfikacja: [PRD.md](PRD.md). Plan wdrożenia: w katalogu planów Claude.

## Stack

React 18 + Vite + TypeScript. Font **Satoshi** (Fontshare CDN). Bez backendu.

## Uruchomienie

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + build produkcyjny do dist/
npm run preview  # podgląd builda
```

## Interakcja

- **Przesuwanie płótna (pan):** przytrzymaj **lewy** lub **środkowy** przycisk myszy i przeciągnij.
- Foldery i karta reagują na hover; w MVP **kliknięcie nie otwiera zawartości**.
- Podpowiedź „Drag to explore” znika po pierwszej interakcji.

## Struktura

```
src/
  data/items.ts                 # config folderów + karty (pozycje, placeholdery picsum)
  hooks/usePan.ts               # drag-to-pan (lewy/środkowy przycisk) + miękkie bounds
  components/
    Canvas/                     # płótno: transform, siatka kropek, kursory grab/grabbing
    PortfolioTitle/             # centralny napis PORTFOLIO + デザイナー
    FolderCard/                 # folder: okładka + mini-podglądy + hover
    AboutCard/                  # czerwona karta "Hello, I'm Damian"
    OnboardingHint/             # znikająca podpowiedź
  App.tsx                       # kompozycja
```

## Placeholdery

Okładki/miniatury to deterministyczne obrazy z `picsum.photos` (seed). Do podmiany na realne prace
w kolejnych iteracjach (`src/data/items.ts`).

## Następne kroki (poza MVP)

Wejście do folderów, strona „About”, zoom płótna, drag & drop elementów, pełna responsywność mobile.
Szczegóły w [PRD.md](PRD.md) §11.
