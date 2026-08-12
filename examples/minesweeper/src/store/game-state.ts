import { type WritableGrain, grain, readonly } from '@grainular/grains';
import { timer } from './timer-state';

export type Cell = {
    discovered: WritableGrain<boolean>;
    explosive: WritableGrain<boolean>;
    flagged: WritableGrain<boolean>;
    neighbors: WritableGrain<number | null>;
};

export type GamePhase = 'ready' | 'playing' | 'won' | 'lost';

const createCell = (): Cell => ({
    discovered: grain(false),
    explosive: grain(false),
    flagged: grain(false),
    neighbors: grain<number | null>(null),
});
const createField = (boardSize: number) => Array.from({ length: boardSize * boardSize }, createCell);

const phase = grain<GamePhase>('ready');
export const size = grain(10);
export const mines = grain(10);
export const timeLimit = grain<number | null>(180);
const cells = grain<Cell[]>(createField(size()));
const flaggedCount = grain(0);
const revealedCount = grain(0);

const neighborIndexes = (index: number, boardSize: number) => {
    const x = index % boardSize;
    const y = Math.floor(index / boardSize);
    const indexes: number[] = [];

    for (let yOffset = -1; yOffset <= 1; yOffset++) {
        for (let xOffset = -1; xOffset <= 1; xOffset++) {
            if (xOffset === 0 && yOffset === 0) continue;

            const neighborX = x + xOffset;
            const neighborY = y + yOffset;
            if (neighborX >= 0 && neighborX < boardSize && neighborY >= 0 && neighborY < boardSize) {
                indexes.push(neighborY * boardSize + neighborX);
            }
        }
    }

    return indexes;
};

const reveal = (cell: Cell) => {
    if (cell.discovered() || cell.flagged()) return false;
    cell.discovered.set(true);
    revealedCount.update((count) => count + 1);
    return true;
};

const revealEmptyArea = (origin: number) => {
    const board = cells();
    const queue = [origin];
    const visited = new Set<number>();

    for (let cursor = 0; cursor < queue.length; cursor++) {
        const index = queue[cursor];
        if (index === undefined || visited.has(index)) continue;
        visited.add(index);

        const cell = board[index];
        if (cell === undefined || cell.flagged() || cell.explosive()) continue;
        reveal(cell);
        if (cell.neighbors() !== null) continue;

        for (const neighbor of neighborIndexes(index, size())) {
            const neighborCell = board[neighbor];
            if (neighborCell && !neighborCell.discovered() && !neighborCell.flagged()) queue.push(neighbor);
        }
    }
};

const finish = (outcome: Extract<GamePhase, 'won' | 'lost'>) => {
    if (phase() !== 'playing') return;
    phase.set(outcome);
    timer.stopTimer();

    if (outcome === 'lost') {
        for (const cell of cells()) {
            if (cell.explosive()) reveal(cell);
        }
        return;
    }

    for (const cell of cells()) {
        if (cell.explosive() && !cell.flagged()) {
            cell.flagged.set(true);
            flaggedCount.update((count) => count + 1);
        }
    }
};

const checkForWin = () => {
    if (revealedCount() === cells().length - mines()) finish('won');
};

const initializeBoard = (origin: number) => {
    const board = cells();
    const candidates = Array.from({ length: board.length }, (_, index) => index).filter((index) => index !== origin);

    for (let placed = 0; placed < mines(); placed++) {
        const candidate = Math.floor(Math.random() * candidates.length);
        const index = candidates.splice(candidate, 1)[0];
        const cell = index === undefined ? undefined : board[index];
        if (cell) cell.explosive.set(true);
    }

    for (const [index, cell] of board.entries()) {
        if (cell.explosive()) continue;
        const neighboringMines = neighborIndexes(index, size()).filter((neighbor) =>
            board[neighbor]?.explosive(),
        ).length;
        cell.neighbors.set(neighboringMines || null);
    }
};

const reset = () => {
    phase.set('ready');
    flaggedCount.set(0);
    revealedCount.set(0);
    timer.setTimer(timeLimit());
    cells.set(createField(size()));
};

export const gameState = {
    phase: readonly(phase),
    cells: readonly(cells),
    size: readonly(size),
    time: readonly(timer.time),
    flaggedCount: readonly(flaggedCount),
    revealedCount: readonly(revealedCount),
    reset,
    start: (options: { size: number; mines: number; timeLimit: number | null }) => {
        const maximumMines = options.size * options.size - 1;
        if (options.mines < 1 || options.mines > maximumMines) return false;
        size.set(options.size);
        mines.set(options.mines);
        timeLimit.set(options.timeLimit);
        reset();
        return true;
    },
    reveal: (cell: Cell) => {
        if (phase() === 'won' || phase() === 'lost' || cell.flagged() || cell.discovered()) return;

        const index = cells().indexOf(cell);
        if (index < 0) return;

        if (phase() === 'ready') {
            initializeBoard(index);
            phase.set('playing');
            timer.startTimer(() => finish('lost'));
        }

        if (cell.explosive()) {
            reveal(cell);
            finish('lost');
            return;
        }

        reveal(cell);
        if (cell.neighbors() === null) revealEmptyArea(index);
        checkForWin();
    },
    toggleFlag: (cell: Cell) => {
        if (phase() === 'won' || phase() === 'lost' || cell.discovered()) return;
        cell.flagged.set(!cell.flagged());
        flaggedCount.update((count) => count + (cell.flagged() ? 1 : -1));
    },
};

reset();
