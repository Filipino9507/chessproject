import { ICoordinates, ITile, IMove } from '@app/shared/tile';
import { PieceColor } from '@app/shared/piece/piece-color';

export interface IBoard {
    moveCount: number;
    playedMoves: IMove[];
    getTile(coords: ICoordinates): ITile;
    accessibleByKing(coords: ICoordinates, kingColor: PieceColor): boolean;
    isKingSafe(kingColor: PieceColor): boolean;
    isKingSafeAfterMove(fromCoords: ICoordinates, toCoords: ICoordinates): boolean;
    copy(): IBoard;
    updateThreatMoves(): void;
}