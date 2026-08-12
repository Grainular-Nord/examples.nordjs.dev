import { createStruct } from '@grainular/nord';
import DOMPurify from 'dompurify';

const sanitize = (untrustedHtml: string) => {
    return DOMPurify.sanitize(untrustedHtml, {
        USE_PROFILES: { html: true },
        FORBID_TAGS: ['style'],
        FORBID_ATTR: ['style'],
    });
};

/**
 * Renders HTML received from an external source after removing executable and
 * unsupported markup. Keep this separate from `$unsafeHtml`, which is for
 * application-owned, trusted HTML only.
 */
export const $SanitizedHtml = (untrustedHtml: string) => {
    return createStruct((anchor) => {
        const template = document.createElement('template');
        template.innerHTML = sanitize(untrustedHtml);
        anchor.replaceWith(template.content);
    });
};
