import { cp, mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const outputDirectory = resolve('.cloudflare/site');
const examples = ['forms', 'game-of-life', 'hnr', 'minesweeper', 'tic-tac-toe'];

await rm(outputDirectory, { force: true, recursive: true });
await mkdir(outputDirectory, { recursive: true });
await cp('index.html', resolve(outputDirectory, 'index.html'));

for (const example of examples) {
    await cp(resolve('examples', example, 'dist'), resolve(outputDirectory, example), { recursive: true });
}
