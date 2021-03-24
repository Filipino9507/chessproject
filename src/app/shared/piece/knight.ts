import { IBoard } from '@app/shared/board/board-interface';
import { addCoordinates, areCoordinatesValid } from '@app/shared/board/board-utility';
import { ICoordinates } from '@app/shared/tile';
import { Piece } from '@app/shared/piece/piece';

export class Knight extends Piece {

    protected readonly _symbols = ['♘', '♞'];
    protected readonly _value = 3;
    protected readonly _checkable = false

    public copy(): Knight {
        return new Knight(this._color);
    }

    protected _generateMoves(_: IBoard, fromCoords: ICoordinates): ICoordinates[] {
        let moves: ICoordinates[] = [];

        for(let toCoords of [
            addCoordinates(fromCoords, {file: -1, rank: 2}),
            addCoordinates(fromCoords, {file: 1, rank: 2}),
            addCoordinates(fromCoords, {file: -1, rank: -2}),
            addCoordinates(fromCoords, {file: 1, rank: -2}),
            addCoordinates(fromCoords, {file: 2, rank: -1}),
            addCoordinates(fromCoords, {file: 2, rank: 1}),
            addCoordinates(fromCoords, {file: -2, rank: -1}),
            addCoordinates(fromCoords, {file: -2, rank: 1}),
        ]) {
            if(areCoordinatesValid(toCoords))
                moves.push(toCoords);
        }
        return moves;
    }
}