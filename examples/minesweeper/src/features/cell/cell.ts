import { combined, derived } from '@grainular/grains';
import { html, on } from '@grainular/nord';
import { Icon, icons } from '../../components/icon/icon.component';
import { type Cell as CellModel, gameState } from '../../store/game-state';
import './cell.css';

export type CellProps = { cell: CellModel };
export const Cell = ({ cell }: CellProps) => {
    const label = derived(
        combined([cell.discovered, cell.flagged, cell.explosive, cell.neighbors]),
        ([discovered, flagged, explosive, neighbors]) => {
            if (flagged) return 'Flagged cell. Press F to remove the flag.';
            if (!discovered) return 'Covered cell. Press Enter to reveal or F to flag.';
            if (explosive) return 'Mine.';
            return neighbors === null ? 'Revealed empty cell.' : `Revealed cell with ${neighbors} neighboring mines.`;
        },
    );
    const flagCell = (ev: Event) => {
        ev.preventDefault();
        gameState.toggleFlag(cell);
    };
    const handleKeydown = (ev: Event) => {
        if (!(ev instanceof KeyboardEvent) || ev.key.toLowerCase() !== 'f') return;
        ev.preventDefault();
        gameState.toggleFlag(cell);
    };

    return html`
        <button
            type="button"
            class="cell"
            aria-label="${label}"
            data-discovered="${cell.discovered}"
            data-flagged="${cell.flagged}"
            data-explosive="${cell.explosive}"
            data-neighbors="${cell.neighbors}"
            ${on('click', () => gameState.reveal(cell))}
            ${on('contextmenu', flagCell)}
            ${on('keydown', handleKeydown)}
        >
            <div class="cell-flagged">
                ${Icon({ src: icons.flag, size: 16, fill: 'oklch(from var(--color-cyan-400) l c h / 0.6)' })}
            </div>
            <div class="cell-discovered">${cell.neighbors}</div>
            <div class="cell-explosive">
                ${Icon({ src: icons.bomb, size: 16, fill: 'oklch(from var(--color-rose-500) l c h / 0.6)' })}
            </div>
        </button>
    `;
};
