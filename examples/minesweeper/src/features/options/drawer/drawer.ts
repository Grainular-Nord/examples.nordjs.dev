import { form } from '@grainular/forms';
import { combined, derived, grain } from '@grainular/grains';
import { $each, html, on } from '@grainular/nord';
import { Button } from '../../../components/button/button.component';
import { clickOutside } from '../../../directives/click-outside.directive';
import { drawerState } from '../../../store/drawer-state';
import { gameState, mines, size, timeLimit } from '../../../store/game-state';
import { Range } from '../range/range';
import './drawer.css';

type OptionsModel = {
    size: number;
    mines: number;
};

const presets = [
    { label: 'Beginner', size: 6, mines: 6 },
    { label: 'Intermediate', size: 8, mines: 12 },
    { label: 'Expert', size: 12, mines: 30 },
];

const limits = [
    { label: '1 min', value: 60 },
    { label: '3 min', value: 180 },
    { label: '5 min', value: 300 },
    { label: '10 min', value: 600 },
    { label: '∞', value: null },
];

export const Drawer = () => {
    const options = form<OptionsModel>({ size: size(), mines: mines() });
    const maximumMines = derived(options.controls.size.value, (boardSize) => boardSize * boardSize - 1);
    options.controls.size.value.subscribe((boardSize) => {
        const maximum = boardSize * boardSize - 1;
        if (options.controls.mines.value() > maximum) options.controls.mines.value.set(maximum);
    });
    const selectedTimeLimit = grain(timeLimit());
    const selectedPreset = derived(
        combined([options.controls.size.value, options.controls.mines.value]),
        ([boardSize, mineCount]) => {
            return presets.find((preset) => preset.size === boardSize && preset.mines === mineCount)?.label ?? 'Custom';
        },
    );

    return html`<aside id="game-settings" class="drawer" data-expanded="${drawerState.expanded}">
        <div class="drawer-content" ${clickOutside(() => drawerState.close())}>
            <section class="drawer-setting">
                <span class="drawer-setting-label">Difficulty</span>
                <div class="difficulty-presets">
                    ${$each(() => presets).$as(
                        (preset) => html`
                            <button
                                type="button"
                                class="difficulty-preset"
                                data-active="${derived(selectedPreset, (selected) => selected === preset.label)}"
                                aria-pressed="${derived(selectedPreset, (selected) => selected === preset.label)}"
                                ${on('click', () => {
                                    options.controls.size.value.set(preset.size);
                                    options.controls.mines.value.set(preset.mines);
                                })}
                            >
                                <span>${preset.label}</span>
                                <small>${preset.size}×${preset.size} · ${preset.mines} mines</small>
                            </button>
                        `,
                    )}
                </div>
            </section>
            ${Range({
                control: options.controls.mines,
                formatter: (value) => `${value} Mines`,
                label: 'Mine Count',
                min: 1,
                max: maximumMines,
            })}
            ${Range({
                control: options.controls.size,
                formatter: (value) => `${value} R/C`,
                label: 'Board Size',
                min: 4,
                max: 12,
            })}
            <section class="drawer-setting">
                <span class="drawer-setting-label">Time limit</span>
                <div class="time-limits">
                    ${$each(() => limits).$as(
                        (limit) => html`
                            <button
                                type="button"
                                class="time-limit"
                                data-active="${derived(selectedTimeLimit, (selected) => selected === limit.value)}"
                                aria-pressed="${derived(selectedTimeLimit, (selected) => selected === limit.value)}"
                                ${on('click', () => selectedTimeLimit.set(limit.value))}
                            >
                                ${limit.label}
                            </button>
                        `,
                    )}
                </div>
            </section>
            ${Button({
                children: 'Start new game',
                className: 'drawer-start-button',
                onClick: () => {
                    const nextOptions = options.value();
                    if (gameState.start({ ...nextOptions, timeLimit: selectedTimeLimit() })) drawerState.close();
                },
            })}
        </div>
    </aside>`;
};
