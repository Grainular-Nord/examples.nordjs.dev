# Nørd examples

Standalone applications built with [Nørd](https://nordjs.dev).

Explore the live gallery at [examples.nordjs.dev](https://examples.nordjs.dev).

## Examples

- Forms
- Game of Life
- Hacker News Reader
- Minesweeper
- Tic-Tac-Toe

```bash
npm install
npm run dev:example --workspace=@examples/game-of-life
npm run check
npm run build
```

Each application lives in `examples/` and consumes published `@grainular/*` packages, so the examples exercise the same dependency flow as downstream users.

## Deployment

The complete gallery is deployed to Cloudflare Workers at [examples.nordjs.dev](https://examples.nordjs.dev). The Cloudflare build assembles every example into one static site and preserves deep links in the Hacker News Reader.

```bash
npm run build:cloudflare
npm run deploy:cloudflare
```
