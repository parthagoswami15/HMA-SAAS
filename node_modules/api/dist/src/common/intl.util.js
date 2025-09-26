"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveLocale = resolveLocale;
exports.resolveTimeZone = resolveTimeZone;
exports.resolveCurrency = resolveCurrency;
exports.formatCurrency = formatCurrency;
exports.formatDate = formatDate;
const DEFAULT_LOCALE = 'en-US';
const DEFAULT_CURRENCY = 'USD';
const DEFAULT_TZ = 'UTC';
function resolveLocale(header) {
    if (!header)
        return DEFAULT_LOCALE;
    const value = header.split(',')[0]?.trim();
    return value || DEFAULT_LOCALE;
}
function resolveTimeZone(header) {
    return header?.trim() || DEFAULT_TZ;
}
function resolveCurrency(header) {
    return header?.trim().toUpperCase() || DEFAULT_CURRENCY;
}
function formatCurrency(amountCents, opts = {}) {
    const locale = opts.locale || DEFAULT_LOCALE;
    const currency = (opts.currency || DEFAULT_CURRENCY).toUpperCase();
    const amount = (amountCents || 0) / 100;
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}
function formatDate(isoOrDate, opts = {}) {
    const locale = opts.locale || DEFAULT_LOCALE;
    const timeZone = opts.timeZone || DEFAULT_TZ;
    const d = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
    return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short', timeZone }).format(d);
}
//# sourceMappingURL=intl.util.js.map