import { PieceColor } from '@app/shared/piece/piece-color';

export interface IGameSettings {
    secondsToThink: number;
    secondsIncrement: number;
    flipBoard: boolean;
}
