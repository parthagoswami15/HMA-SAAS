export type IntlOptions = {
  locale?: string;
  currency?: string; // ISO 4217
  timeZone?: string; // IANA tz
};

const DEFAULT_LOCALE = 'en-US';
const DEFAULT_CURRENCY = 'USD';
const DEFAULT_TZ = 'UTC';

export function resolveLocale(header?: string): string {
  if (!header) return DEFAULT_LOCALE;
  const value = header.split(',')[0]?.trim();
  return value || DEFAULT_LOCALE;
}

export function resolveTimeZone(header?: string): string {
  return header?.trim() || DEFAULT_TZ;
}

export function resolveCurrency(header?: string): string {
  return header?.trim().toUpperCase() || DEFAULT_CURRENCY;
}

export function formatCurrency(amountCents: number, opts: IntlOptions = {}) {
  const locale = opts.locale || DEFAULT_LOCALE;
  const currency = (opts.currency || DEFAULT_CURRENCY).toUpperCase();
  const amount = (amountCents || 0) / 100;
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}

export function formatDate(isoOrDate: string | Date, opts: IntlOptions = {}) {
  const locale = opts.locale || DEFAULT_LOCALE;
  const timeZone = opts.timeZone || DEFAULT_TZ;
  const d = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short', timeZone }).format(d);
}


