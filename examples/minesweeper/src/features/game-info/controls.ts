import { derived } from '@grainular/grains';
import { html } from '@grainular/nord';
import { Button } from '../../components/button/button.component';
import { Icon, icons } from '../../components/icon/icon.component';
import { drawerState } from '../../store/drawer-state';
import { gameState } from '../../store/game-state';

export const Controls = () => {
    const status = derived(gameState.phase, (phase) => ({ ready: '😁', playing: '😁', won: '🥳', lost: '😵' })[phase]);

    return html`
        <div class="flex flex-row items-center gap-3">
            ${Button({
                onClick: () => drawerState.toggle(),
                ariaLabel: 'Open game settings',
                ariaExpanded: drawerState.expanded,
                children: Icon({ src: icons.gear, size: 16 }),
            })}
            ${Button({
                onClick: () => gameState.reset(),
                ariaLabel: 'Start a new game with the current settings',
                children: Icon({ src: icons.restart, size: 16 }),
            })}
            <div>${status}</div>
        </div>
    `;
};
