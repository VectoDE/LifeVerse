export function groupBy<T, K extends keyof T>(arr: T[], key: K): Record<string, T[]> {
    return arr.reduce((acc, obj) => {
        const groupKey = String(obj[key]);
        if (!acc[groupKey]) {
            acc[groupKey] = [];
        }
        acc[groupKey].push(obj);
        return acc;
    }, {} as Record<string, T[]>);
}

/**
 * Counts the occurrences of elements in an array.
 * @param arr - The array whose elements are to be counted.
 * @returns An object that contains the count of each element in the array.
 */
export function countOccurrences<T>(arr: T[]): Record<string, number> {
    return arr.reduce((acc, item) => {
        const key = String(item);
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
}

/**
 * Finds the index of the first occurrence of an element in an array.
 * @param arr - The array in which to search for the element.
 * @param element - The element whose index is to be found.
 * @returns The index of the first occurrence of the element or `-1` if the element is not found.
 */
export function findIndex<T>(arr: T[], element: T): number {
    return arr.indexOf(element);
}

/**
 * Pushes an element to the end of an array if it doesn't already exist.
 * @param arr - The array to which the element should be added.
 * @param element - The element to be added.
 * @returns The array with the added element.
 */
export function pushUnique<T>(arr: T[], element: T): T[] {
    if (!arr.includes(element)) {
        arr.push(element);
    }
    return arr;
}

/**
 * Removes the first occurrence of an element from an array.
 * @param arr - The array from which the element should be removed.
 * @param element - The element to be removed.
 * @returns The array without the specified element.
 */
export function removeElement<T>(arr: T[], element: T): T[] {
    const index = arr.indexOf(element);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

/**
 * Splits an array into multiple smaller arrays with a maximum length.
 * @param arr - The array to be split.
 * @param size - The maximum size of each chunk.
 * @returns An array of arrays containing the original elements split into chunks.
 */
export function chunk<T>(arr: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
}

/**
 * Searches for an element in an array and returns it if found.
 * @param arr - The array to search in.
 * @param predicate - A function that is executed for each element of the array. It returns `true` if the element is found.
 * @returns The first element that satisfies the predicate or `undefined` if no element is found.
 */
export function find<T>(arr: T[], predicate: (value: T) => boolean): T | undefined {
    return arr.find(predicate);
}

/**
 * Sorts an array of objects by a key.
 * @param arr - The array of objects to be sorted.
 * @param key - The key by which to sort the array.
 * @param order - The sort order: `asc` for ascending or `desc` for descending.
 * @returns A sorted array.
 */
export function sortBy<T>(arr: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
    return arr.sort((a, b) => {
        if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
        return 0;
    });
}