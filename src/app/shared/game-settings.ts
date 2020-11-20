import { PieceColor } from '@app/shared/piece/piece-color';

export interface IGameSettings {
    difficulty?: 0 | 1 | 2 | 3 | 4;
    playerColor: PieceColor;
    secondsToThink: number;
    secondsIncrement: number;
}
