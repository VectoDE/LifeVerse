import { useState, useEffect } from 'react';

/**
 * Custom Hook to debounce a value.
 * @param value The value to be debounced
 * @param delay The delay in milliseconds after which the value is set
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}