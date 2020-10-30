import { Board } from '@app/shared/board';
import { ICoordinates } from '@app/shared/tile';
import { Piece } from './piece';
import { Rook } from './rook';

export class King extends Piece {

    protected readonly _symbols = ['♔', '♚'];
    protected readonly _value = Infinity;

    private generateKingMoves(board: Board, fromCoords: ICoordinates, canBeThreatened: boolean): ICoordinates[] {
        let moves: ICoordinates[] = [];

        for(let dRank = -1; dRank <= 1; dRank++)
        for(let dFile = -1; dFile <= 1; dFile++) {
            if(dRank === 0 && dFile === 0) continue;

            const toCoords = Board.addCoordinates(fromCoords, {file: dFile, rank: dRank});
            if(Board.contains(toCoords) && 
                (board.accessibleByKing(toCoords, this._color) || canBeThreatened))
                moves.push(toCoords);
        }
        return moves;
    }

    private generateCastlingMoves(board: Board, fromCoords: ICoordinates): ICoordinates[] {
        if(this._hasMoved) 
            return []; 
        let moves: ICoordinates[] = [];

        for(const coords of [
            {rank: fromCoords.rank, file: 0}, 
            {rank: fromCoords.rank, file: Board.BOARD_DIMEN-1}
        ]) {
            const maybeRook = board.getTile(coords).piece;
            if(maybeRook == null || !(maybeRook instanceof Rook) || maybeRook.hasMoved)
                continue;
            
            const direction = Math.sign(coords.file - fromCoords.file);
            const betweenCoords = Board.addCoordinates(fromCoords, {rank: 0, file: direction});
            const destinationCoords = Board.addCoordinates(
                fromCoords, {rank: 0, file: 2 * direction}
            );

            if(board.accessibleByKing(betweenCoords, this._color) && 
                board.accessibleByKing(destinationCoords, this._color) &&
                board.getTile(betweenCoords).piece == null)
                moves.push(destinationCoords);
        }
        return moves;
    }

    protected _generateMoves(board: Board, fromCoords: ICoordinates): ICoordinates[] {
        return this.generateKingMoves(board, fromCoords, false)
            .concat(this.generateCastlingMoves(board, fromCoords));
    }

    public generateThreatMoves(board: Board, fromCoords: ICoordinates): ICoordinates[] {
        return this.generateKingMoves(board, fromCoords, true);
    }
}