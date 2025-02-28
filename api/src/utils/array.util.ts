export class ArrayUtil {
    /**
     * Removes duplicates from an array.
     * @param array The input array.
     * @returns A new array without duplicates.
     */
    public static removeDuplicates<T>(array: T[]): T[] {
        return [...new Set(array)];
    }

    /**
     * Splits an array into smaller chunks of a given size.
     * @param array The input array.
     * @param chunkSize The maximum size of each chunk.
     * @returns An array of chunks.
     */
    public static chunk<T>(array: T[], chunkSize: number): T[][] {
        if (chunkSize <= 0) throw new Error("Chunk size must be greater than 0");
        const result: T[][] = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            result.push(array.slice(i, i + chunkSize));
        }
        return result;
    }

    /**
     * Shuffles the elements of an array randomly (Fisher-Yates Shuffle).
     * @param array The input array.
     * @returns A new shuffled array.
     */
    public static shuffle<T>(array: T[]): T[] {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Checks if two arrays have the same content (order does not matter).
     * @param array1 The first array.
     * @param array2 The second array.
     * @returns `true` if the arrays contain the same elements, otherwise `false`.
     */
    public static areEqual<T>(array1: T[], array2: T[]): boolean {
        if (array1.length !== array2.length) return false;
        const sorted1 = [...array1].sort();
        const sorted2 = [...array2].sort();
        return sorted1.every((val, index) => val === sorted2[index]);
    }

    /**
     * Removes a specific item from an array.
     * @param array The input array.
     * @param item The item to remove.
     * @returns A new array without the item.
     */
    public static removeItem<T>(array: T[], item: T): T[] {
        return array.filter(element => element !== item);
    }

    /**
     * Creates an array with unique values from multiple arrays.
     * @param arrays Any number of input arrays.
     * @returns A new array with unique values.
     */
    public static union<T>(...arrays: T[][]): T[] {
        return ArrayUtil.removeDuplicates(arrays.flat());
    }

    /**
     * Returns the common values between two arrays.
     * @param array1 The first array.
     * @param array2 The second array.
     * @returns A new array with shared values.
     */
    public static intersection<T>(array1: T[], array2: T[]): T[] {
        return array1.filter(value => array2.includes(value));
    }

    /**
     * Creates an array with values from the first array that are not in the second array.
     * @param array1 The first array.
     * @param array2 The second array.
     * @returns A new array with unique values from `array1`.
     */
    public static difference<T>(array1: T[], array2: T[]): T[] {
        return array1.filter(value => !array2.includes(value));
    }

    /**
     * Returns the last element of an array.
     * @param array The input array.
     * @returns The last element or `undefined` if the array is empty.
     */
    public static last<T>(array: T[]): T | undefined {
        return array.length > 0 ? array[array.length - 1] : undefined;
    }

    /**
     * Creates a number range from `start` to `end` with a given step.
     * @param start The starting number.
     * @param end The ending number.
     * @param step The step size (default: 1).
     * @returns An array of numbers.
     */
    public static range(start: number, end: number, step: number = 1): number[] {
        if (step <= 0) throw new Error("Step must be greater than 0");
        const result: number[] = [];
        for (let i = start; i <= end; i += step) {
            result.push(i);
        }
        return result;
    }

    /**
     * Checks if an array is empty or contains only empty values.
     * @param array The input array.
     * @returns `true` if the array is empty or only contains `null`/`undefined`/`""`.
     */
    public static isEmpty<T>(array: (T | null | undefined | "")[]): boolean {
        return array.length === 0 || array.every(item => item === null || item === undefined || item === "");
    }
}