import { useState } from 'react';

export function useSessionStorageState<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.sessionStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error('Error reading from sessionStorage', error);
            return initialValue;
        }
    });

    const setValue = (value: T) => {
        try {
            setStoredValue(value);
            window.sessionStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error writing to sessionStorage', error);
        }
    };

    return [storedValue, setValue] as const;
}
