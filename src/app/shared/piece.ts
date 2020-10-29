import { ITile } from '@app/shared/tile';

export enum PieceColor {
    WHITE = 0,
    BLACK = 1
}

export abstract class Piece {

    protected _color: PieceColor;

    protected readonly _symbols: string[];
    protected readonly _value: number;

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

    public abstract getPossibleMoves(board: ITile[][]): Generator<number[]>;
}

export class Pawn extends Piece {

    protected readonly _symbols = ['♙', '♟'];
    protected readonly _value = 1;

    public *getPossibleMoves(board: ITile[][]): Generator<number[]> {
        yield [0, 1];
    }
}

export class Knight extends Piece {

    protected readonly _symbols = ['♘', '♞'];
    protected readonly _value = 3;

    public *getPossibleMoves(board: ITile[][]): Generator<number[]> {
        yield [0, 1];
    }
}

export class Bishop extends Piece {

    protected readonly _symbols = ['♗', '♝'];
    protected readonly _value = 3;

    public *getPossibleMoves(board: ITile[][]): Generator<number[]> {
        yield [0, 1];
    }
}

export class Rook extends Piece {

    protected readonly _symbols = ['♖', '♜'];
    protected readonly _value = 5;

    public *getPossibleMoves(board: ITile[][]): Generator<number[]> {
        yield [0, 1];
    }
}

export class Queen extends Piece {

    protected readonly _symbols = ['♕', '♛'];
    protected readonly _value = 9;

    public *getPossibleMoves(board: ITile[][]): Generator<number[]> {
        yield [0, 1];
    }
}

export class King extends Piece {

    protected readonly _symbols = ['♔', '♚'];
    protected readonly _value = Infinity;

    public *getPossibleMoves(board: ITile[][]): Generator<number[]> {
        yield [0, 1];
    }
}

