import { premiConfig } from '../config/premiConfig';

let jackpotAttuale = premiConfig.jackpotIniziale;

export const getJackpot = () => jackpotAttuale;
export const incrementaJackpot = () => { jackpotAttuale += premiConfig.incrementoJackpot; return jackpotAttuale; };
export const resetJackpot = () => { jackpotAttuale = premiConfig.jackpotIniziale; return jackpotAttuale; };
