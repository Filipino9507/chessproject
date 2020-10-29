import { Piece, PieceColor } from '@app/shared/piece'; 

export interface ITile {
    file: number;
    rank: number;
    highlighted: boolean;
    piece: Piece;
    attackedByColor?: PieceColor;
}
