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
    NONE = -1,
    WHITE = 0,
    BLACK = 1
}

export abstract class Piece {
    private color: PieceColor;

    protected static moveMap: MoveMapType[][];

    public constructor(color: PieceColor) {
        this.color = color;
    }
}

export class Pawn extends Piece {

    protected static moveMap = [
        [0, 0, 6, 0, 0],
        [0, 5, 2, 5, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];

}

export class Knight extends Piece {

    protected static moveMap = [
        [0, 4, 0, 4, 0],
        [4, 0, 0, 0, 4],
        [0, 0, 1, 0, 0],
        [4, 0, 0, 0, 4],
        [0, 4, 0, 4, 0]
    ];

}

export class Bishop extends Piece {

    protected static moveMap = [
        [0, 0, 0, 0, 0],
        [0, 3, 0, 3, 0],
        [0, 0, 1, 0, 0],
        [0, 3, 0, 3, 0],
        [0, 0, 0, 0, 0]
    ];

}

export class Rook extends Piece {

    protected static moveMap = [
        [0, 0, 0, 0, 0],
        [0, 0, 3, 0, 0],
        [0, 3, 1, 3, 0],
        [0, 0, 3, 0, 0],
        [0, 0, 0, 0, 0]
    ];
}

export class Queen extends Piece {

    protected static moveMap = [
        [0, 0, 0, 0, 0],
        [0, 3, 3, 3, 0],
        [0, 3, 1, 3, 0],
        [0, 3, 3, 3, 0],
        [0, 0, 0, 0, 0]
    ];
}

export class King extends Piece {

    protected static moveMap = [
        [0, 0, 0, 0, 0],
        [0, 2, 2, 2, 0],
        [0, 2, 1, 2, 0],
        [0, 2, 2, 2, 0],
        [0, 0, 0, 0, 0]
    ];
}
