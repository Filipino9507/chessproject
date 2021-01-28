import { IBoard } from '@app/shared/board-interface';
import { ICoordinates } from '@app/shared/tile';
import { Piece } from '@app/shared/piece/piece';

export class Queen extends Piece {

    protected readonly _symbols = ['♕', '♛'];
    protected readonly _value = 9;
    protected readonly _checkable = false

    public copy(): Queen {
        return new Queen(this._color);
    }

    protected _generateMoves(board: IBoard, fromCoords: ICoordinates): ICoordinates[] {
        return this.generateDistanceMoves(board, fromCoords, [
            {file: 1, rank: 1}, 
            {file: 1, rank: -1},
            {file: -1, rank: 1}, 
            {file: -1, rank: -1},
            {file: 0, rank: 1}, 
            {file: 0, rank: -1},
            {file: -1, rank: 0}, 
            {file: 1, rank: 0}
        ]);
    }
}