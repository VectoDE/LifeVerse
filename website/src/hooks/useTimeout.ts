import { useEffect } from 'react';

export function useTimeout(callback: () => void, delay: number) {
    useEffect(() => {
        const timeoutId = setTimeout(callback, delay);
        return () => clearTimeout(timeoutId);
    }, [callback, delay]);
}