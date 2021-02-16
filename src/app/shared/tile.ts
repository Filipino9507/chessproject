import { Piece } from '@app/shared/piece/piece';

export interface ICoordinates {
    file: number;
    rank: number;
}

export interface ITile {
    coords: ICoordinates;
    highlighted: boolean;
    piece: Piece;
    threatenedBy: Set<Piece>;
}

export interface IMove {
    fromCoords: ICoordinates;
    toCoords: ICoordinates;
    pieceSymbol: string;
    capture: boolean;
    castling: ECastling
}

export enum ECastling {
    NONE,
    KING_SIDE,
    QUEEN_SIDE
}