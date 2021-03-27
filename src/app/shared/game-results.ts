import { PieceColor } from '@app/shared/piece/piece-color';
import { IGameSettings } from '@app/shared/game-settings';
import { EGameResultReason } from '@app/shared/game-result-reason';

/** Contains results of game to show in the end screen */
export interface IGameResults {
    winner: PieceColor;
    reason: EGameResultReason;
    gameSettings: IGameSettings;
}
