# PRD — Interaktywne Portfolio (Pin Board)

**Autor:** Damian
**Data:** 2026-05-31
**Wersja:** 1.0 (MVP — ekran główny)
**Status:** Draft do akceptacji

---

## 1. Streszczenie (TL;DR)

Interaktywne portfolio w formie nieskończonego **pin boardu / canvasu** (jak płótno w Figmie).
W centrum widoczny jest duży napis **„PORTFOLIO”**, a wokół niego rozmieszczone są **katalogi/foldery** z pracami (Graphic Design, Motion, Case Study) oraz **karta „Hello, I'm Damian”**.

Użytkownik (głównie **rekruter**) może **przesuwać** całe płótno myszą, aby eksplorować rozłożone elementy. Celem jest pokazanie portfolio w sposób nieszablonowy i zapadający w pamięć.

**Zakres MVP:** wyłącznie ekran główny. Foldery i karta są widoczne i wyglądają na klikalne, ale **wejście do ich zawartości jest poza zakresem MVP** (puste / „coming soon” lub po prostu nieaktywne).

---

## 2. Cele i kontekst

### 2.1 Problem / motywacja
Klasyczne portfolia są przewidywalne. Damian chce wyróżnić się przed rekruterami, pokazując umiejętności (graphic / motion / AI design) już przez sam sposób interakcji ze stroną.

### 2.2 Cele
- **G1:** Zbudować zapadający w pamięć, interaktywny ekran główny w stylu pin boardu.
- **G2:** Umożliwić swobodne przesuwanie (pan) płótna, zachęcając do eksploracji.
- **G3:** Czytelnie zakomunikować strukturę portfolio: Graphic Design, Motion, Case Study + „o mnie”.
- **G4:** Przygotować architekturę pod przyszłą rozbudowę (wejście do folderów, drag & drop, zoom).

### 2.3 Cele NIE-objęte tym wydaniem (Non-goals)
- Wchodzenie do wnętrza folderów / podstrony z pracami.
- Zoom płótna (tylko pan w MVP).
- Drag & drop elementów (planowane na później).
- CMS / backend / panel administracyjny.
- Logowanie, formularze, analityka zaawansowana.

### 2.4 Miary sukcesu
- Rekruter w <5 s rozumie, że to portfolio i że można je „przesuwać”.
- Płynny pan (60 fps na typowym laptopie).
- Wszystkie 3 foldery + karta „o mnie” są odnajdywalne na płótnie.
- Działa na desktopie (Chrome, Safari, Firefox, Edge — aktualne wersje).

---

## 3. Persony i scenariusze

### 3.1 Persona główna — Rekruter / Hiring Manager
Ma mało czasu, przegląda wiele portfolio. Oczekuje szybkiego „wow” i czytelności. Korzysta z desktopa.

### 3.2 Persona drugorzędna — Inny projektant / znajomy z branży
Docenia detale interakcji i estetykę.

### 3.3 Kluczowe scenariusze (MVP)
1. **Wejście na stronę** → widzi wycentrowany napis „PORTFOLIO” i fragmenty folderów dookoła; pojawia się subtelna podpowiedź, że można przesuwać.
2. **Eksploracja** → przytrzymuje przycisk myszy i przeciąga, odsłaniając foldery rozmieszczone na płótnie.
3. **Najechanie na folder/kartę** → element reaguje (hover), sygnalizując interaktywność. Kliknięcie w MVP nie otwiera zawartości (stan „coming soon” lub nieaktywne — patrz §6.4).

---

## 4. Inspiracje i materiały

- **Referencja interakcji:** https://www.portfoliobyshruti.com/ (canvas/pin board, swobodna eksploracja).
- **Załączniki od autora:**
  - Finalny design napisu „PORTFOLIO” (PORT pogrubione + FOLIO kontur/italic, akcent „WELCOME TO MY”, japoński akcent „デザイナー” w czerwieni, podpis „GRAPHIC • MOTION • AI”).
  - Wstępna makieta layoutu (foldery w stylu odręcznego szkicu rozmieszczone w rogach, centralny „PORTFOLIO”, czerwona karta „Hello, I'm Damian”).

---

## 5. Założenia produktowe i koncepcja UX

### 5.1 Metafora
Płótno = „tablica korkowa / biurko projektanta”. Foldery to katalogi z pracami, „przypięte” w różnych miejscach.

### 5.2 Layout płótna (rozmieszczenie startowe)
Inspirowane makietą. Współrzędne orientacyjne (do dopracowania w implementacji):

| Element | Pozycja względem centrum | Treść |
|---|---|---|
| Napis „PORTFOLIO” | Centrum | Tytuł, duży, dominujący |
| Graphic Design (folder) | Lewy-górny | Podpis: *Performance Ads · Social Media · Key Visuals* |
| Motion (folder) | Prawy | Podpis: *Showreels · Events* |
| Case Study (folder) | Lewy-dolny | Podpis: *Website · Branding* |
| „Hello, I'm Damian” (karta) | Prawy-dolny | Czerwona karta z miniaturą + „Get to know me →” |

Płótno jest **większe niż viewport** — część elementów wystaje poza ekran, co zachęca do przesuwania.

### 5.3 Nawigacja po płótnie (pan)
- **Lewy przycisk myszy:** przytrzymanie + przeciągnięcie = przesuwanie płótna (drag-to-pan).
- **Środkowy przycisk myszy:** przytrzymanie + przeciągnięcie = przesuwanie (jak w Figmie).
- **Kursor:** `grab` w spoczynku, `grabbing` podczas przeciągania.
- **Bez zoomu** w MVP (scroll nie zmienia skali). *(Zoom = przyszła iteracja.)*
- **Ograniczenia (bounds):** miękkie granice, by użytkownik nie „odpłynął” w pustkę (np. clamp do prostokąta z marginesem wokół elementów).
- **Onboarding:** delikatna, znikająca po pierwszej interakcji podpowiedź, np. „Drag to explore” + ikona dłoni.

### 5.4 Stany elementów (folder / karta)
- **Default** — spoczynek.
- **Hover** — subtelna reakcja (np. lekkie uniesienie/scale, cień, podświetlenie podpisu).
- **Active/Pressed** — wizualne wciśnięcie.
- **MVP onClick** — nie nawiguje do zawartości (patrz §6.4).

### 5.5 Treści (język strony: angielski)
- Nagłówki/podpisy w **języku angielskim** (zgodnie z makietą: „Hello, I'm Damian”, „Get to know me →”).
- Akcent typograficzny „デザイナー” (jap. „designer”) w kolorze czerwonym jako element brandu.

---

## 6. Wymagania funkcjonalne (MVP)

### 6.1 Canvas / Pin board
- **FR-1:** Renderuje nieskończone (lub wystarczająco duże) płótno z rozmieszczonymi elementami.
- **FR-2:** Pan lewym oraz środkowym przyciskiem myszy (drag-to-pan).
- **FR-3:** Płynny ruch (transform translate, bez przeładowań), docelowo 60 fps.
- **FR-4:** Miękkie ograniczenia przesuwania (bounds), brak „zgubienia się” w pustce.
- **FR-5:** Kursor zmienia się: `grab` ↔ `grabbing`.
- **FR-6:** Onboardingowa podpowiedź o możliwości przesuwania (znika po 1. interakcji).

### 6.2 Centralny napis „PORTFOLIO”
- **FR-7:** Wyróżniony wizualnie tytuł zgodny z dostarczonym designem (PORT bold + FOLIO outline/italic, akcenty kolorystyczne).
- **FR-8:** Podtytuł „GRAPHIC • MOTION • AI” oraz „WELCOME TO MY”.

### 6.3 Foldery (Graphic Design, Motion, Case Study)
- **FR-9:** Każdy folder ma: grafikę/ikonę folderu, tytuł, listę podkategorii (podpis).
- **FR-10:** Stany hover/active.
- **FR-11:** Miniatury/okładki z **mockupów (placeholdery)** — patrz §8.
- **FR-12:** Definicja folderów w jednym miejscu (config/dane), by łatwo dodać kolejne.

### 6.4 Karta „Hello, I'm Damian”
- **FR-13:** Czerwona karta z nagłówkiem „Hello, I'm Damian”, miniaturą (placeholder) i CTA „Get to know me →”.
- **FR-14:** Stan hover/active.

### 6.5 Zachowanie kliknięć w MVP
Foldery i karta są **widoczne i interaktywne wizualnie** (hover), ale nie otwierają zawartości. Rekomendacja: po kliknięciu pokazać lekki sygnał „Coming soon” (np. tooltip/toast) ALBO pozostawić nieaktywne z `cursor: default`. **Decyzja do potwierdzenia** (patrz §13).

### 6.6 Responsywność
- **FR-15:** Priorytet: **desktop**. Na mobile/tablet — minimalnie: czytelny fallback (np. statyczny układ lub pan dotykiem). Pełne mobile = przyszła iteracja.

---

## 7. Wymagania niefunkcjonalne

- **NFR-1 Wydajność:** płynny pan (transformacje GPU, `will-change: transform`), brak lagów przy przeciąganiu.
- **NFR-2 Kompatybilność:** najnowsze Chrome, Safari, Firefox, Edge (desktop).
- **NFR-3 Dostępność (a11y):** sensowny kontrast tekstu; elementy interaktywne osiągalne; alt-teksty dla obrazów. (Pełna nawigacja klawiaturą po canvasie — przyszłość.)
- **NFR-4 Utrzymywalność:** komponenty wielokrotnego użytku; dane folderów/kart w configu.
- **NFR-5 Wczytywanie:** szybki first paint; lazy-load cięższych grafik jeśli potrzeba.

---

## 8. Zasoby graficzne (placeholdery na MVP)

Na czas MVP używamy **mockupów / przykładowych obrazów** jako okładek folderów i miniatury karty „o mnie”.

- Źródła placeholderów: lokalne pliki w `/public/mock/` lub serwisy typu `picsum.photos` / kolory blokowe.
- Każdy folder: 1 okładka + opcjonalnie 2–3 miniatury prac (mock).
- Karta „o mnie”: 1 miniatura (mock — ciemny prostokąt jak na makiecie).
- Docelowo: podmiana na realne prace Damiana (poza MVP).

---

## 9. Architektura techniczna

### 9.1 Stack
- **Framework:** React 18 + **Vite** + **TypeScript**.
- **Stylowanie:** CSS Modules lub Tailwind (do wyboru w implementacji; rekomendacja: CSS Modules dla precyzyjnej kontroli nad canvasem).
- **Animacje (opcjonalnie):** Framer Motion dla hover/onboarding (lekko).
- **Brak backendu** w MVP.

### 9.2 Model danych (config)
```ts
type FolderItem = {
  id: string;
  title: string;            // np. "Graphic Design"
  subtitles: string[];      // ["Performance Ads", "Social Media", "Key Visuals"]
  cover: string;            // ścieżka do mock-okładki
  position: { x: number; y: number }; // pozycja na płótnie
  enabled: boolean;         // w MVP false (nie otwiera zawartości)
};

type AboutCard = {
  title: string;            // "Hello, I'm Damian"
  cta: string;              // "Get to know me →"
  thumbnail: string;
  position: { x: number; y: number };
};
```

### 9.3 Struktura komponentów (propozycja)
```
src/
  components/
    Canvas/            // logika pan, transform, bounds, kursory
    PortfolioTitle/    // centralny napis "PORTFOLIO"
    FolderCard/        // pojedynczy folder (cover, tytuł, podpisy, hover)
    AboutCard/         // czerwona karta "Hello, I'm Damian"
    OnboardingHint/    // znikająca podpowiedź "Drag to explore"
  data/
    items.ts           // konfiguracja folderów + karty + pozycje
  hooks/
    usePan.ts          // obsługa drag-to-pan (lewy/środkowy przycisk)
  App.tsx
```

### 9.4 Mechanika pan (skrót)
- Nasłuch `pointerdown` (button 0 = lewy, button 1 = środkowy) → start drag, zapis offsetu.
- `pointermove` → aktualizacja `translate(x, y)` warstwy płótna.
- `pointerup` / `pointerleave` → koniec drag.
- Clamp pozycji do zdefiniowanych granic.
- `e.preventDefault()` dla środkowego przycisku (blokada auto-scroll).

---

## 10. Decyzje przyjęte (z ustaleń)

- **Stack:** React + Vite + TypeScript.
- **Nawigacja canvasu:** **tylko pan** (bez zoomu w MVP).
- **Język:** PRD po polsku, treści strony po angielsku.

---

## 11. Roadmapa (po MVP)

| Faza | Zakres |
|---|---|
| **MVP (to wydanie)** | Ekran główny: canvas + pan, napis „PORTFOLIO”, 3 foldery + karta „o mnie”, placeholdery, hover. |
| **v1.1** | Wejście do folderów (podstrony/overlay z pracami), realne grafiki. |
| **v1.2** | Strona „About / Hello I'm Damian” (osobny widok). |
| **v1.3** | Zoom płótna (jak w Figmie) + mini-mapa / „reset view”. |
| **v1.4** | Elementy **drag & drop** (zabawowe — przesuwanie obiektów po biurku). |
| **v1.5** | Pełna responsywność mobile + dotyk. |

---

## 12. Ryzyka i mitigacje

| Ryzyko | Mitigacja |
|---|---|
| Rekruter nie odkryje, że można przesuwać | Onboardingowa podpowiedź + elementy „wystające” poza ekran. |
| Użytkownik „zgubi się” na płótnie | Miękkie bounds; (przyszłość) przycisk „reset view”. |
| Spadki płynności | Transformacje GPU, ograniczenie liczby ciężkich obrazów, `will-change`. |
| Mobile/dotyk | MVP = desktop-first; jasny fallback; pełne mobile w v1.5. |
| Niejasny stan „klikalności” folderów w MVP | Ustalić zachowanie onClick (§6.5 / §13). |

---

## 13. Pytania otwarte (do potwierdzenia)

1. **Kliknięcie folderu w MVP:** pokazać „Coming soon” (tooltip/toast) czy element całkowicie nieaktywny?
2. **Onboarding:** wolisz tekstową podpowiedź „Drag to explore”, animowaną ikonę dłoni, czy oba?
3. **Liczba miniatur w folderze:** sama okładka czy okładka + kilka mini-podglądów prac (mock)?
4. **Tło płótna:** czyste białe (jak makieta) czy delikatna siatka/kropki (jak Figma) dla wzmocnienia metafory canvasu?
5. **Czcionka:** czy masz konkretny font do napisu „PORTFOLIO” (z dostarczonego designu), czy dobieramy zbliżony?

---

## 14. Kryteria akceptacji MVP (Definition of Done)

- [ ] Strona ładuje się i pokazuje wycentrowany napis „PORTFOLIO”.
- [ ] Widoczne 3 foldery (Graphic Design, Motion, Case Study) z podpisami i mock-okładkami.
- [ ] Widoczna karta „Hello, I'm Damian” z CTA „Get to know me →”.
- [ ] Pan działa lewym ORAZ środkowym przyciskiem myszy, płynnie.
- [ ] Kursor zmienia się `grab` ↔ `grabbing`.
- [ ] Miękkie bounds — nie da się „odpłynąć” w nieskończoną pustkę.
- [ ] Hover na folderach/karcie działa.
- [ ] Kliknięcie nie otwiera zawartości (zachowanie zgodne z §6.5).
- [ ] Onboardingowa podpowiedź pojawia się i znika po 1. interakcji.
- [ ] Działa na aktualnych Chrome/Safari/Firefox/Edge (desktop).
```

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
