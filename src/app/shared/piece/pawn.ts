import { IBoard } from '@app/shared/board-interface';
import { addCoordinates, areCoordinatesValid } from '@app/shared/board-utility';
import { ICoordinates } from '@app/shared/tile';
import { Piece } from './piece';
import { PieceColor } from './piece-color'; 

export class Pawn extends Piece {

    protected readonly _symbols = ['♙', '♟'];
    protected readonly _value = 1;
    protected _firstRowMoveNumber = 0;

    public copy(): Pawn {
        return new Pawn(this._color);
    }

    private _generateNormalMoves(board: IBoard, fromCoords: ICoordinates): ICoordinates[] {
        let moves: ICoordinates[] = [];
        const toCoords = addCoordinates(fromCoords, {file: 0, rank: this.movementDirection()});
        if(areCoordinatesValid(toCoords) && board.getTile(toCoords).piece == null) {
            moves.push(toCoords);
        }
        return moves;
    }

    private _generateFirstRowMoves(board: IBoard, fromCoords: ICoordinates): ICoordinates[] {
        let moves: ICoordinates[] = [];
        const betweenCoords = addCoordinates(fromCoords, {file: 0, rank: this.movementDirection()});
        const toCoords = addCoordinates(
            fromCoords, {file: 0, rank: 2 * this.movementDirection()}
        );
        if(areCoordinatesValid(toCoords) && 
        board.getTile(betweenCoords).piece == null && board.getTile(toCoords).piece == null &&
        (fromCoords.rank === 1 || fromCoords.rank === 6))
            moves.push(toCoords);
        return moves;
    }

    private _generateCaptureMoves(board: IBoard, fromCoords: ICoordinates, canGoToEmpty: boolean): ICoordinates[] {
        let moves: ICoordinates[] = [];
        for(let toCoords of [
            addCoordinates(fromCoords, {file: 1, rank: this.movementDirection()}),
            addCoordinates(fromCoords, {file: -1, rank: this.movementDirection()})
        ]) {
            if(areCoordinatesValid(toCoords)) {
                const piece = board.getTile(toCoords).piece;
                if ((piece != null && piece.color !== this._color) || canGoToEmpty) {
                    moves.push(toCoords);
                }
            }
        }
        return moves;
    }

    private _generateEnPassantMoves(board: IBoard, fromCoords: ICoordinates): ICoordinates[] {
        let moves: ICoordinates[] = [];
        if(fromCoords.rank === 3 + this._color) {
            for(let toCoords of [
                addCoordinates(fromCoords, {file: 1, rank: this.movementDirection()}),
                addCoordinates(fromCoords, {file: -1, rank: this.movementDirection()})
            ]) {
                const maybePawn = board.getTile({rank: fromCoords.rank, file: toCoords.file}).piece;
                if(maybePawn != null && 
                    maybePawn instanceof Pawn && 
                    maybePawn.firstRowMoveNumber + 1 === board.moveCount)
                    moves.push(toCoords);
            }
        }
        return moves;
    }

    public generateThreatMoves(board: IBoard, fromCoords: ICoordinates): ICoordinates[] {
        return this._generateCaptureMoves(board, fromCoords, true);
    }

    protected _generateMoves(board: IBoard, fromCoords: ICoordinates): ICoordinates[] {
        return this._generateNormalMoves(board, fromCoords)
        .concat(this._generateFirstRowMoves(board, fromCoords)
        .concat(this._generateCaptureMoves(board, fromCoords, false)
        .concat(this._generateEnPassantMoves(board, fromCoords))));
    }

    public movementDirection(): 1 | -1 {
        return this._color === PieceColor.WHITE ? -1 : 1;
    }

    public move(board: IBoard, toCoords: ICoordinates): void {
        this._markFirstRowMove(board, toCoords);
        this._attemptEnPassant(board, toCoords);
        super.move(board, toCoords);
    }

    private _attemptEnPassant(board: IBoard, toCoords: ICoordinates): void {
        const fromCoords = this._tile.coords;
        const isCapture = board.getTile(toCoords).piece != null;
        if(!isCapture) {
            const dRank = fromCoords.rank - toCoords.rank;
            const dFile = fromCoords.file - toCoords.file;
            if(Math.abs(dRank) === 1 && Math.abs(dFile) === 1)
                board.getTile(addCoordinates(toCoords, {rank: dRank, file: 0})).piece = null;
        }    
    }

    private _markFirstRowMove(board: IBoard, toCoords: ICoordinates): void {
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