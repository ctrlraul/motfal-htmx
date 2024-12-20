export default function randomString(length: number, charSet = 'abcdefghijklmnopqrstuvwxyz0123456789'): string {
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charSet.length);
        result += charSet.charAt(randomIndex);
    }
    return result;
}