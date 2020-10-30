import { Board } from '@app/shared/board';
import { ICoordinates } from '@app/shared/tile';
import { Piece } from './piece';

export class King extends Piece {

    protected readonly _symbols = ['♔', '♚'];
    protected readonly _value = Infinity;

    public isThreatened(board: Board, toCoords: ICoordinates): boolean {
        for(let piece of board.getTile(toCoords).threatenedBy) {
            if(piece.color !== this._color) 
                return true;
        }
        return false;
    }

    private generateMoves(board: Board, fromCoords: ICoordinates, canBeThreatened: boolean): ICoordinates[] {
        let moves: ICoordinates[] = [];

        for(let dRank = -1; dRank <= 1; dRank++) {
            for(let dFile = -1; dFile <= 1; dFile++) {
                if(dRank === 0 && dFile === 0) continue;

                const toCoords = Board.addCoordinates(fromCoords, {file: dFile, rank: dRank});
                if(Board.contains(toCoords) && (!this.isThreatened(board, toCoords) || canBeThreatened))
                    moves.push(toCoords);
            }
        }
        return moves;
    }

    public generatePossibleMoves(board: Board, fromCoords: ICoordinates): ICoordinates[] {
        return this.generateMoves(board, fromCoords, false);
    }

    public generateThreatMoves(board: Board, fromCoords: ICoordinates): ICoordinates[] {
        return this.generateMoves(board, fromCoords, true);
    }
}