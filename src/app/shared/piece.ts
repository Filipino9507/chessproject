export enum MoveMapType {
    NONE = 0,
    PIECE = 1,
    MOVE = 2,
    FAR_MOVE = 3,
    JUMP_MOVE = 4,
    CAPTURE_MOVE = 5,
    FIRST_ROW_MOVE = 6,
}

export enum PieceColor {
    WHITE = 0,
    BLACK = 1
}

export abstract class Piece {

    protected _color: PieceColor;
    protected readonly _symbols: string[];
    protected readonly _moveMap: MoveMapType[][];

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
}

export class Pawn extends Piece {

    protected readonly _symbols = ['♙', '♟'];
    protected readonly _moveMap = [
        [0, 0, 6, 0, 0],
        [0, 5, 2, 5, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];

}

export class Knight extends Piece {

    protected readonly _symbols = ['♘', '♞'];
    protected readonly _moveMap = [
        [0, 4, 0, 4, 0],
        [4, 0, 0, 0, 4],
        [0, 0, 1, 0, 0],
        [4, 0, 0, 0, 4],
        [0, 4, 0, 4, 0]
    ];

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
}
