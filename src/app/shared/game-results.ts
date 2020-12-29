import { PieceColor } from '@app/shared/piece/piece-color';
import { Board } from '@app/shared/board';
import { IGameSettings } from '@app/shared/game-settings';
import { EGameResultReason } from '@app/shared/game-result-reason';

export interface IGameResults {
    winner: PieceColor;
    reason: EGameResultReason;
    boardState: Board;
    gameSettings: IGameSettings;
}
