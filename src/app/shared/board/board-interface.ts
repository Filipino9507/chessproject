import { ICoordinates, ITile, IMove } from '@app/shared/tile';
import { PieceColor } from '@app/shared/piece/piece-color';

/** Interface for board used in extern logic to avoid circular dependencies */
export interface IBoard {
    moveCount: number;
    playedMoves: IMove[];
    tileArray: ITile[][];
    reset(): void;
    getTile(coords: ICoordinates): ITile;
    accessibleByKing(coords: ICoordinates, kingColor: PieceColor): boolean;
    isKingSafe(kingColor: PieceColor): boolean;
    isKingSafeAfterMove(fromCoords: ICoordinates, toCoords: ICoordinates): boolean;
    copy(): IBoard;
    updateThreatMoves(): void;
}