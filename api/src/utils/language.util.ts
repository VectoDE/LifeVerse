import { Request } from 'express';

const SUPPORTED_LANGUAGES = ['en', 'de', 'fr', 'es'] as const;

const DEFAULT_LANGUAGE = 'en' as const;

type LanguageMessageKey = 'greeting' | 'error' | 'userNotFound';

interface LanguageMessages {
    greeting: string;
    error: string;
    userNotFound: string;
}

const messages: { [key in typeof SUPPORTED_LANGUAGES[number]]: LanguageMessages } = {
    en: {
        greeting: 'Hello!',
        error: 'Something went wrong!',
        userNotFound: 'User not found.',
    },
    de: {
        greeting: 'Hallo!',
        error: 'Etwas ist schief gelaufen!',
        userNotFound: 'Benutzer nicht gefunden.',
    },
    fr: {
        greeting: 'Bonjour!',
        error: 'Quelque chose a mal tourné!',
        userNotFound: 'Utilisateur non trouvé.',
    },
    es: {
        greeting: '¡Hola!',
        error: '¡Algo salió mal!',
        userNotFound: 'Usuario no encontrado.',
    },
};

export const getUserLanguage = (req: Request): string => {
    const languageHeader = req.headers['accept-language'];
    
    if (!languageHeader) {
        return DEFAULT_LANGUAGE;
    }

    const languages = languageHeader.split(',').map(lang => lang.split(';')[0]);

    for (let lang of languages) {
        if (SUPPORTED_LANGUAGES.includes(lang as typeof SUPPORTED_LANGUAGES[number])) {
            return lang;
        }
    }

    return DEFAULT_LANGUAGE;
};

export const getLocalizedMessage = (language: string, messageKey: LanguageMessageKey): string => {
    return messages[language as keyof typeof messages]?.[messageKey] || messages[DEFAULT_LANGUAGE][messageKey];
};
