import { html } from '@grainular/nord';
import { Icon, icons } from '../../components/icon/icon.component';
import { gameState } from '../../store/game-state';

export const Stats = () => {
    const formattedTime = derived(gameState.time, (time) => (time === null ? '∞' : time));

    return html`
        <div class="flex flex-row gap-2 items-center ml-auto text-stone-400">
            <span class="flex flex-row gap-1 items-center text-sm">
                ${Icon({ src: icons.clock, size: 16 })} ${formattedTime}
            </span>
            <span class="flex flex-row gap-1 items-center text-sm">
                ${Icon({ src: icons.plot, size: 16 })} ${gameState.flaggedCount}
            </span>
            <span class="flex flex-row gap-1 items-center text-sm">
                ${Icon({ src: icons.grid, size: 16 })} ${gameState.revealedCount}
            </span>
        </div>
    `;
};
import { derived } from '@grainular/grains';
