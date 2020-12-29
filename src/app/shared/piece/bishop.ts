import { Board } from '@app/shared/board';
import { ICoordinates } from '@app/shared/tile';
import { Piece } from './piece';

export class Bishop extends Piece {

    protected readonly _symbols = ['♗', '♝'];
    protected readonly _value = 3;

    public copy(): Bishop {
        return new Bishop(this._color);
    }

    protected _generateMoves(board: Board, fromCoords: ICoordinates): ICoordinates[] {
        return this.generateDistanceMoves(board, fromCoords, [
            {file: 1, rank: 1}, 
            {file: 1, rank: -1},
            {file: -1, rank: 1}, 
            {file: -1, rank: -1}
        ]);
    }
}