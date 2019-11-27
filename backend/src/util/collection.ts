export function makeArray<T>(items: T | T[]): T[] {
    if (items instanceof Array) {
        return items;
    } else {
        return [items];
    }
}