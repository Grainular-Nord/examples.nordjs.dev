# Nørd examples

Standalone applications built with [Nørd](https://nordjs.dev).

## Examples

- Forms
- Game of Life
- Hacker News Reader
- Minesweeper
- Tic-Tac-Toe

```bash
npm install
npm run dev:example --workspace=@examples/game-of-life
npm run build
```

Each application lives in `examples/` and consumes published `@grainular/*` packages, so the examples exercise the same dependency flow as downstream users.

> The compatibility setting in `.npmrc` is temporary. It works around invalid `workspace:*` peer dependency metadata in the currently published 2.0.0 packages and will be removed after the next ecosystem release.
