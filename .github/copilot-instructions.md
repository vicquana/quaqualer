# Copilot Instructions for quaqualer 🚀

Short, actionable guidance to help an AI coding agent be productive quickly.

## Quick start (commands)

- Install deps: `npm install` (pnpm: `pnpm install` is supported; repo includes `pnpm-lock.yaml`).
- Dev server: `npm run dev` (Vite).
- Build: `npm run build`.
- Preview build locally: `npm run preview`.

> Notes: `index.html` pulls Tailwind and React via CDN/importmap (see `index.html`). Manual UI checks in the browser are the primary test harness.

## Big picture

- Single-page React + TypeScript app built with Vite.
- App state is small and local: `App.tsx` holds the current `ScratchCardData` and `GameStats` and orchestrates draws and stat updates.
- Key UI pieces:
  - `components/CardContainer.tsx` – layout for a card, shows winning numbers and your numbers, resizes scratch area with ResizeObserver.
  - `components/ScratchCanvas.tsx` – canvas overlay that implements the scratch interaction. It tracks the cleared area and calls `onComplete()` when >65% is cleared.
  - `components/WinAnimation.tsx` – confetti (`canvas-confetti`) + celebratory UI; calls `utils/audio.playWinSound()`.
- Core logic:
  - `utils/lotteryLogic.ts` – game rules and random generation (`generateCard`), `PRIZE_POOL`, `getProbabilityInfo`.
  - `utils/audio.ts` – Web Audio API helpers used by the UI (`playScratchSound`, `playRevealSound`, `playWinSound`).
- Types live in `types.ts` (e.g., `GameType`, `ScratchCardData`, `GameStats`).

## Project-specific facts & gotchas (be concrete)

- Scratching threshold: `ScratchCanvas.getPercentage()` counts fully-transparent pixels; if >65% it triggers `onComplete()` (auto-reveal behavior).
- Randomness & seeding:
  - `generateCard` uses `Math.random()` for ID, outcomes, and shuffling — tests should mock or inject RNG to be deterministic.
  - Forced-win behavior: if `willWin` (≈33% chance) is true, the first `yourNumbers` entry is coerced to match a winning number.
- Prize logic: `PRIZE_POOL` (see `utils/lotteryLogic.ts`) is where prize values come from; `getProbabilityInfo` returns human-facing strings (not computed on-the-fly).
- Canvas correctness:
  - `ScratchCanvas` accounts for `devicePixelRatio` when sizing the canvas and uses `globalCompositeOperation = 'destination-out'` to erase overlay.
  - `playScratchSound()` is throttled (~60ms) to avoid audio overload during frequent scratching calls.
- Styling: Tailwind is injected via CDN in `index.html` (no local build-time Tailwind config present).
- Audio context: `utils/audio` resumes suspended AudioContext on first call — tests that run headless should mock `AudioContext` or stub `initAudio()`.

## Recommended focuses for contributors / AI tasks

- Small, well-scoped PRs with manual verification steps in PR description (e.g., "Run `npm run dev`, open http://localhost:5173, play a few cards, verify stats update and win animation triggers").
- Good first tasks for an agent:
  - Add unit tests for `utils/lotteryLogic.ts` (e.g., assert `GameType.NEW_YEAR_FUKU` produces 3 winning numbers).
  - Refactor `generateCard` to accept an injectable RNG (for testability).
  - Add tests around `ScratchCanvas` behavior: mock canvas `getImageData` to assert threshold logic and clearing.
  - Add a config flag or context to disable audio & confetti for automated tests.

## Testing & debugging tips

- No test framework is present currently; add `vitest`/`jest` if introducing tests. Keep tests small and deterministic (mock `Math.random`, `AudioContext`, and `canvas.getContext` where needed).
- For manual UI debugging, use device emulation (mobile touch) and the DevTools to inspect canvas dimensions and `devicePixelRatio` handling.
- To reproduce audio issues, ensure user gesture resume is simulated (AudioContext starts suspended until a gesture in many browsers).

## Files to inspect for changes

- `App.tsx` — primary state flow (stats update, drawNewCard, handleReveal).
- `utils/lotteryLogic.ts` — random generation, `PRIZE_POOL`, `getProbabilityInfo`.
- `components/ScratchCanvas.tsx` — scratch logic and threshold implementation (65%).
- `components/CardContainer.tsx` — integrates canvas and handles `onComplete` -> plays reveal sound -> calls parent `onReveal`.
- `utils/audio.ts` — WebAudio helpers; mockable surface for tests.
- `components/WinAnimation.tsx` — confetti and sound orchestration.

## PR checklist for behavior changes

- Update `types.ts` if you add or change public shapes.
- Add or update unit tests for deterministic logic (lottery, thresholds).
- In PR description include manual verification steps (run dev, steps to trigger edge cases like multiple winners, very quick scratches, audio muted state).

---

If any section is unclear or you'd like me to include example test code snippets / a starter test harness, tell me which area to expand and I'll iterate. ✅
