import { type Grain } from '@grainular/grains';
import { type PropsWithChildren, html, on } from '@grainular/nord';

export type ButtonProps = PropsWithChildren<{
    onClick: (ev: PointerEvent) => void;
    className?: string;
    ariaLabel?: string | Grain<string>;
    ariaExpanded?: boolean | Grain<boolean>;
}>;

export const Button = ({ children, onClick, className = '', ariaLabel, ariaExpanded }: ButtonProps) => {
    return html`
        <button
            type="button"
            ${on('click', onClick)}
            class="text-stone-400 hover:text-stone-200 inline-flex flex-row gap-2 cursor-pointer ${className}"
            aria-label="${ariaLabel}"
            aria-expanded="${ariaExpanded}"
        >
            ${children}
        </button>
    `;
};
