import { IBoard } from '@app/shared/board/board-interface';
import { ICoordinates } from '@app/shared/tile';
import { Piece } from './piece';

export class Bishop extends Piece {

    protected readonly _symbols = ['♗', '♝'];
    protected readonly _value = 3;
    protected readonly _checkable = false

    /** Override */
    public copy(): Bishop {
        return new Bishop(this._color);
    }

    /** Override */
    protected _generateMoves(board: IBoard, fromCoords: ICoordinates): ICoordinates[] {
        return this._generateDistanceMoves(board, fromCoords, [
            {file: 1, rank: 1}, 
            {file: 1, rank: -1},
            {file: -1, rank: 1}, 
            {file: -1, rank: -1}
        ]);
    }
}