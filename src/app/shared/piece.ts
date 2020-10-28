export enum MoveMapType {
    NONE = 0,
    PIECE = 1,
    MOVE = 2,
    FAR_MOVE = 3,
    CAPTURE_MOVE = 4,
    FIRST_ROW_MOVE = 5,
}

export enum PieceColor {
    WHITE = 0,
    BLACK = 1
}

export abstract class Piece {

    protected _color: PieceColor;
    protected readonly _symbols: string[];
    protected readonly _moveMap: MoveMapType[][];
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

    public get moveMap(): MoveMapType[][] {
        return this._moveMap;
    }

    public get value(): number {
        return this._value;
    }
}

export class Pawn extends Piece {

    protected readonly _symbols = ['♙', '♟'];
    protected readonly _moveMap = [
        [0, 0, 5, 0, 0],
        [0, 4, 2, 4, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];
    protected readonly _value = 1;
}

export class Knight extends Piece {

    protected readonly _symbols = ['♘', '♞'];
    protected readonly _moveMap = [
        [0, 2, 0, 2, 0],
        [2, 0, 0, 0, 2],
        [0, 0, 1, 0, 0],
        [2, 0, 0, 0, 2],
        [0, 2, 0, 2, 0]
    ];
    protected readonly _value = 3;
}

export class Bishop extends Piece {

    protected readonly _symbols = ['♗', '♝'];
    protected readonly _moveMap = [
        [0, 0, 0, 0, 0],
        [0, 3, 0, 3, 0],
        [0, 0, 1, 0, 0],
        [0, 3, 0, 3, 0],
        [0, 0, 0, 0, 0]
    ];
    protected readonly _value = 3;
}

export class Rook extends Piece {

    protected readonly _symbols = ['♖', '♜'];
    protected readonly _moveMap = [
        [0, 0, 0, 0, 0],
        [0, 0, 3, 0, 0],
        [0, 3, 1, 3, 0],
        [0, 0, 3, 0, 0],
        [0, 0, 0, 0, 0]
    ];
    protected readonly _value = 5;
}

export class Queen extends Piece {

    protected readonly _symbols = ['♕', '♛'];
    protected readonly _moveMap = [
        [0, 0, 0, 0, 0],
        [0, 3, 3, 3, 0],
        [0, 3, 1, 3, 0],
        [0, 3, 3, 3, 0],
        [0, 0, 0, 0, 0]
    ];
    protected readonly _value = 9;
}

export class King extends Piece {

    protected readonly _symbols = ['♔', '♚'];
    protected readonly _moveMap = [
        [0, 0, 0, 0, 0],
        [0, 2, 2, 2, 0],
        [0, 2, 1, 2, 0],
        [0, 2, 2, 2, 0],
        [0, 0, 0, 0, 0]
    ];
    protected readonly _value = Infinity;
}
