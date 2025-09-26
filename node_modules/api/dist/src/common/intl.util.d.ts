export type IntlOptions = {
    locale?: string;
    currency?: string;
    timeZone?: string;
};
export declare function resolveLocale(header?: string): string;
export declare function resolveTimeZone(header?: string): string;
export declare function resolveCurrency(header?: string): string;
export declare function formatCurrency(amountCents: number, opts?: IntlOptions): string;
export declare function formatDate(isoOrDate: string | Date, opts?: IntlOptions): string;
