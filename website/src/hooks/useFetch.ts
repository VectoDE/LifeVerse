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
            setLoading(true);
            setError(null);

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
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return { data, loading, error };
}