import { useState, useEffect } from 'react';

/**
 * Custom Hook to fetch data from an API.
 * @param url The URL to fetch data from
 * @returns An object containing `data`, `loading`, and `error` states
 */
export function useFetch<T>(url: string) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Set loading to true before fetching
            setError(null); // Reset error state

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                setData(result);
            } catch (error) {
                setError('Error fetching data: ' + (error instanceof Error ? error.message : 'Unknown error'));
            } finally {
                setLoading(false); // Set loading to false when fetching is done
            }
        };

        fetchData();
    }, [url]); // Re-fetch when the URL changes

    return { data, loading, error };
}
