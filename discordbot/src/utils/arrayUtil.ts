export class ArrayUtil {
    private static cachedChunks: Record<string, any[][]> = {};

    public static chunkArray(arr: any[], size: number): any[][] {
        const cacheKey = `${arr.length}-${size}`;
        if (this.cachedChunks[cacheKey]) {
            return this.cachedChunks[cacheKey];
        }

        const result: any[][] = [];
        for (let i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
        }

        this.cachedChunks[cacheKey] = result;
        return result;
    }

    public static clearCache(): void {
        this.cachedChunks = {};
    }
}
