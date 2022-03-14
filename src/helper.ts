export function strEscape(str: string): string {
    return str.replace(/,|\r\n|\r|\n/g, ' ');
}