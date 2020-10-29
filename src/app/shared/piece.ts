import { ITile, ICoordinates, Board } from '@app/shared/board';

export enum PieceColor {
    WHITE = 0,
    BLACK = 1
}

export abstract class Piece {

    protected _color: PieceColor;
    protected readonly _symbols: string[];
    protected readonly _value: number;
    protected _tempPossibilities: ICoordinates[];

    public constructor(color: PieceColor) {
        this._color = color;
    }

    public get color(): PieceColor {
        return this._color;
    }

    public get symbol(): string {
        return this._symbols[this._color];
    }

    public get value(): number {
        return this._value;
    }

    public updateBoardPossibleMoves(board: Board, fromCoords: ICoordinates): void {
        this._tempPossibilities = this.generatePossibleMoves(board, fromCoords);
        for(let coord of this._tempPossibilities) {
            board.getTile(coord).threatenedBy.add(this);
        }
    }

    public clearTempPossibilities(): void {
        this._tempPossibilities = [];
    }

    public abstract generatePossibleMoves(board: Board, fromCoords: ICoordinates): ICoordinates[];
}

export class Pawn extends Piece {

    protected readonly _symbols = ['♙', '♟'];
    protected readonly _value = 1;

    public generatePossibleMoves(board: Board, fromCoords: ICoordinates): ICoordinates[] {
        const moves: ICoordinates[] = [];

        // Normal move
        const toCoords = Board.addCoordinates(fromCoords, {file: 0, rank: this.movementDirection()});
        if(Board.contains(toCoords) && board.getTile(toCoords).piece == null)
            moves.push(toCoords);

        // Move on first row
        const firstRowToCoords = Board.addCoordinates(
            fromCoords, {file: 0, rank: 2 * this.movementDirection()}
        );
        if(Board.contains(firstRowToCoords) && 
        board.getTile(toCoords).piece == null && board.getTile(firstRowToCoords).piece == null &&
        (fromCoords.rank === 1 || fromCoords.rank === 6))
            moves.push(firstRowToCoords);
        
        // Capture only move
        for(let captureToCoords of [
            Board.addCoordinates(fromCoords, {file: 1, rank: this.movementDirection()}),
            Board.addCoordinates(fromCoords, {file: -1, rank: this.movementDirection()})
        ]) {
            if(Board.contains(captureToCoords) && board.getTile(captureToCoords).piece != null)
                moves.push(captureToCoords);
        }
        return moves;
    }

    private movementDirection(): 1 | -1 {
        return this._color === PieceColor.WHITE ? -1 : 1;
    }
}

export class Knight extends Piece {

    protected readonly _symbols = ['♘', '♞'];
    protected readonly _value = 3;

    public generatePossibleMoves(board: Board, fromCoords: ICoordinates): ICoordinates[] {
        return [];
    }
}

export class Bishop extends Piece {

    protected readonly _symbols = ['♗', '♝'];
    protected readonly _value = 3;

    public generatePossibleMoves(board: Board, fromCoords: ICoordinates): ICoordinates[] {
        return [];
    }
}

export class Rook extends Piece {

    protected readonly _symbols = ['♖', '♜'];
    protected readonly _value = 5;

    public generatePossibleMoves(board: Board, fromCoords: ICoordinates): ICoordinates[] {
        return [];
    }
}

export class Queen extends Piece {

    protected readonly _symbols = ['♕', '♛'];
    protected readonly _value = 9;

    public generatePossibleMoves(board: Board, fromCoords: ICoordinates): ICoordinates[] {
        return [];
    }
}

export class King extends Piece {

    protected readonly _symbols = ['♔', '♚'];
    protected readonly _value = Infinity;

    public generatePossibleMoves(board: Board, fromCoords: ICoordinates): ICoordinates[] {
        return [];
    }
}

