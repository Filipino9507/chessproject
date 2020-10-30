import { Board } from '@app/shared/board';
import { ICoordinates } from '@app/shared/tile';
import { Piece } from './piece';

export class Rook extends Piece {

    protected readonly _symbols = ['♖', '♜'];
    protected readonly _value = 5;

    protected _generateMoves(board: Board, fromCoords: ICoordinates): ICoordinates[] {
        return this.generateDistanceMoves(board, fromCoords, [
            {file: 0, rank: 1}, 
            {file: 0, rank: -1},
            {file: -1, rank: 0}, 
            {file: 1, rank: 0}
        ]);
    }
}