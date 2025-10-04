declare module 'mime-types' {
  export function lookup(filename: string): string | false;
  export function extension(mimeType: string): string | false;
  export function charset(mimeType: string): string | false;
}
