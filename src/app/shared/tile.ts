import { Piece } from '@app/shared/piece/piece';

/** Object holding a square's coordinates */
export interface ICoordinates {
    file: number;
    rank: number;
}

/** Object holding a tile, the 2D board array holds these */
export interface ITile {
    coords: ICoordinates;
    highlighted: boolean;
    piece: Piece;
    threatenedBy: Set<Piece>;
}

/** Object holding information about a move, used generally for replicating and loading games */
export interface IMove {
    fromCoords: ICoordinates;
    toCoords: ICoordinates;
    pieceSymbol: string;
    capture: boolean;
    castling: ECastling
}

/** Enum for types of castling */
export enum ECastling {
    NONE,
    KING_SIDE,
    QUEEN_SIDE
}