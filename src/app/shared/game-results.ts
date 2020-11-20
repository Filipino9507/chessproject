import { PieceColor } from '@app/shared/piece/piece-color';
import { Board } from '@app/shared/board';
import { IGameSettings } from '@app/shared/game-settings';

export interface IGameResults {
    winner: PieceColor;
    reason: GameResultReason;
    boardState: Board;
    gameSettings: IGameSettings;
}

export enum GameResultReason {
    CHECKMATE,
    STALEMATE,
    REPETITION,
    FIFTY_MOVE_RULE,
    TIME_OUT
}
