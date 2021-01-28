import { IBoard } from '@app/shared/board-interface';
import { ICoordinates } from '@app/shared/tile';
import { Piece } from './piece';

export class Bishop extends Piece {

    protected readonly _symbols = ['♗', '♝'];
    protected readonly _value = 3;
    protected readonly _checkable = false

    public copy(): Bishop {
        return new Bishop(this._color);
    }

    protected _generateMoves(board: IBoard, fromCoords: ICoordinates): ICoordinates[] {
        return this.generateDistanceMoves(board, fromCoords, [
            {file: 1, rank: 1}, 
            {file: 1, rank: -1},
            {file: -1, rank: 1}, 
            {file: -1, rank: -1}
        ]);
    }
}