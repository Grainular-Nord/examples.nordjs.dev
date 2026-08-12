import { grain, readonly } from '@grainular/grains';

const time = grain<number | null>(0);
let interval: number | undefined;

const stopTimer = () => {
    if (interval === undefined) return;
    clearInterval(interval);
    interval = undefined;
};

export const timer = {
    setTimer: (value: number | null) => {
        stopTimer();
        time.set(value);
    },
    startTimer: (onElapsed: () => void) => {
        const current = time();
        if (interval !== undefined || current === null || current <= 0) return;
        interval = window.setInterval(() => {
            const current = time();
            if (current === null) return;
            const next = current - 1;
            time.set(Math.max(0, next));
            if (next <= 0) {
                stopTimer();
                onElapsed();
            }
        }, 1000);
    },
    stopTimer,
    time: readonly(time),
};
