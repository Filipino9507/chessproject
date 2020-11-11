import { Board } from '@app/shared/board';
import { ICoordinates } from '@app/shared/tile';
import { Piece } from './piece';
import { PieceColor } from './piece-color'; 

export class Pawn extends Piece {

    protected readonly _symbols = ['♙', '♟'];
    protected readonly _value = 1;
    protected _firstRowMoveNumber = 0;

    private _generateNormalMoves(board: Board, fromCoords: ICoordinates): ICoordinates[] {
        let moves: ICoordinates[] = [];
        const toCoords = Board.addCoordinates(fromCoords, {file: 0, rank: this.movementDirection()});

        if(Board.contains(toCoords) && board.getTile(toCoords).piece == null)
            moves.push(toCoords);
        return moves;
    }

    private _generateFirstRowMoves(board: Board, fromCoords: ICoordinates): ICoordinates[] {
        let moves: ICoordinates[] = [];
        const betweenCoords = Board.addCoordinates(fromCoords, {file: 0, rank: this.movementDirection()});
        const toCoords = Board.addCoordinates(
            fromCoords, {file: 0, rank: 2 * this.movementDirection()}
        );
        if(Board.contains(toCoords) && 
        board.getTile(betweenCoords).piece == null && board.getTile(toCoords).piece == null &&
        (fromCoords.rank === 1 || fromCoords.rank === 6))
            moves.push(toCoords);
        return moves;
    }

    private _generateCaptureMoves(board: Board, fromCoords: ICoordinates, canGoToEmpty: boolean): ICoordinates[] {
        let moves: ICoordinates[] = [];
        for(let toCoords of [
            Board.addCoordinates(fromCoords, {file: 1, rank: this.movementDirection()}),
            Board.addCoordinates(fromCoords, {file: -1, rank: this.movementDirection()})
        ]) {
            if(Board.contains(toCoords)) {
                const piece = board.getTile(toCoords).piece;
                if ((piece != null && piece.color !== this._color) || canGoToEmpty)
                    moves.push(toCoords);
            }
        }
        return moves;
    }

    private _generateEnPassantMoves(board: Board, fromCoords: ICoordinates): ICoordinates[] {
        let moves: ICoordinates[] = [];

        if(fromCoords.rank === 3 + this._color)
        for(let toCoords of [
            Board.addCoordinates(fromCoords, {file: 1, rank: this.movementDirection()}),
            Board.addCoordinates(fromCoords, {file: -1, rank: this.movementDirection()})
        ]) {
            const maybePawn = board.getTile({rank: fromCoords.rank, file: toCoords.file}).piece;
            if(maybePawn != null && 
                maybePawn instanceof Pawn && 
                maybePawn.firstRowMoveNumber + 1 === board.moveCount)
                moves.push(toCoords);
        }
        return moves;
    }

    public generateThreatMoves(board: Board, fromCoords: ICoordinates): ICoordinates[] {
        return this._generateCaptureMoves(board, fromCoords, true);
    }

    protected _generateMoves(board: Board, fromCoords: ICoordinates): ICoordinates[] {
        return this._generateNormalMoves(board, fromCoords)
        .concat(this._generateFirstRowMoves(board, fromCoords)
        .concat(this._generateCaptureMoves(board, fromCoords, false)
        .concat(this._generateEnPassantMoves(board, fromCoords))));
    }

    public movementDirection(): 1 | -1 {
        return this._color === PieceColor.WHITE ? -1 : 1;
    }

    public move(board: Board, toCoords: ICoordinates): void {
        this._markFirstRowMove(board, toCoords);
        this._attemptEnPassant(board, toCoords);
        super.move(board, toCoords);
    }

    private _attemptEnPassant(board: Board, toCoords: ICoordinates): void {
        const fromCoords = this._tile.coords;
        const isCapture = board.getTile(toCoords).piece != null;
        if(!isCapture) {
            const dRank = fromCoords.rank - toCoords.rank;
            const dFile = fromCoords.file - toCoords.file;
            if(Math.abs(dRank) === 1 && Math.abs(dFile) === 1)
                board.getTile(Board.addCoordinates(toCoords, {rank: dRank, file: 0})).piece = null;
        }    
    }

    private _markFirstRowMove(board: Board, toCoords: ICoordinates): void {
        if(Math.abs(this._tile.coords.rank - toCoords.rank) === 2)
            this.firstRowMoveNumber = board.moveCount;
    }

    public get firstRowMoveNumber(): number {
        return this._firstRowMoveNumber;
    }

    public set firstRowMoveNumber(value: number) {
        this._firstRowMoveNumber = value;
    }
}