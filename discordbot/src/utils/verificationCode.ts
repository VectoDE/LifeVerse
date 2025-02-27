export const generateVerificationCode = (): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';

    for (let i = 0; i < 16; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return code; // Code is returned without spaces
};

// Function for optical formatting (XXXX XXXX XXXX XXXX)
export const formatCode = (code: string): string => {
    return code.match(/.{1,4}/g)?.join(' ') || code;
};