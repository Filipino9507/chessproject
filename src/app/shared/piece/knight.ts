import { Board } from '@app/shared/board';
import { ICoordinates } from '@app/shared/tile';
import { Piece } from './piece';

export class Knight extends Piece {

    protected readonly _symbols = ['♘', '♞'];
    protected readonly _value = 3;

    protected _generateMoves(_: Board, fromCoords: ICoordinates): ICoordinates[] {
        let moves: ICoordinates[] = [];

        for(let toCoords of [
            Board.addCoordinates(fromCoords, {file: -1, rank: 2}),
            Board.addCoordinates(fromCoords, {file: 1, rank: 2}),
            Board.addCoordinates(fromCoords, {file: -1, rank: -2}),
            Board.addCoordinates(fromCoords, {file: 1, rank: -2}),
            Board.addCoordinates(fromCoords, {file: 2, rank: -1}),
            Board.addCoordinates(fromCoords, {file: 2, rank: 1}),
            Board.addCoordinates(fromCoords, {file: -2, rank: -1}),
            Board.addCoordinates(fromCoords, {file: -2, rank: 1}),
        ]) {
            if(Board.contains(toCoords)) moves.push(toCoords);
        }
        return moves;
    }
}