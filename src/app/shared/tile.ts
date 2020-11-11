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

export interface IFullMove {
    fromCoords: ICoordinates;
    toCoords: ICoordinates;
}