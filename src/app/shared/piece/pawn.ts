import { Board } from '@app/shared/board';
import { ICoordinates } from '@app/shared/tile';
import { Piece } from './piece';
import { PieceColor } from './piece-color'; 

export class Pawn extends Piece {

    protected readonly _symbols = ['♙', '♟'];
    protected readonly _value = 1;

    private generateNormalMoves(board: Board, fromCoords: ICoordinates): ICoordinates[] {
        let moves: ICoordinates[] = [];
        const toCoords = Board.addCoordinates(fromCoords, {file: 0, rank: this.movementDirection()});

        if(Board.contains(toCoords) && board.getTile(toCoords).piece == null)
            moves.push(toCoords);
        return moves;
    }

    private generateFirstRowMoves(board: Board, fromCoords: ICoordinates): ICoordinates[] {
        let moves: ICoordinates[] = [];
        const betweenCoords = Board.addCoordinates(fromCoords, {file: 0, rank: this.movementDirection()});
        const firstRowToCoords = Board.addCoordinates(
            fromCoords, {file: 0, rank: 2 * this.movementDirection()}
        );
        if(Board.contains(firstRowToCoords) && 
        board.getTile(betweenCoords).piece == null && board.getTile(firstRowToCoords).piece == null &&
        (fromCoords.rank === 1 || fromCoords.rank === 6))
            moves.push(firstRowToCoords);
        return moves;
    }

    private generateCaptureMoves(board: Board, fromCoords: ICoordinates, canGoToEmpty: boolean): ICoordinates[] {
        let moves: ICoordinates[] = [];
        for(let captureToCoords of [
            Board.addCoordinates(fromCoords, {file: 1, rank: this.movementDirection()}),
            Board.addCoordinates(fromCoords, {file: -1, rank: this.movementDirection()})
        ]) {
            if(Board.contains(captureToCoords) && 
            (board.getTile(captureToCoords).piece != null || canGoToEmpty))
                moves.push(captureToCoords);
        }
        return moves;
    }

    public generateThreatMoves(board: Board, fromCoords: ICoordinates): ICoordinates[] {
        return this.generateCaptureMoves(board, fromCoords, true);
    }

    public generatePossibleMoves(board: Board, fromCoords: ICoordinates): ICoordinates[] {
        return this.generateNormalMoves(board, fromCoords)
        .concat(this.generateFirstRowMoves(board, fromCoords)
        .concat(this.generateCaptureMoves(board, fromCoords, false)))
    }

    private movementDirection(): 1 | -1 {
        return this._color === PieceColor.WHITE ? -1 : 1;
    }
}