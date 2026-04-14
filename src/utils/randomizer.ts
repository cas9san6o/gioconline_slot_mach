export const getRandomFloat = (min: number, max: number) => Math.random() * (max - min) + min;
export const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
export const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
